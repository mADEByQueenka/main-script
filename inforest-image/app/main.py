import base64
import io
import os
import secrets
import time
from collections import defaultdict, deque
from contextlib import asynccontextmanager
from threading import Lock

import torch
from diffusers import FluxPipeline
from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException, Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel, Field
from PIL import Image

load_dotenv()

API_TOKEN = os.getenv("API_TOKEN", "")
MODEL_ID = os.getenv("MODEL_ID", "black-forest-labs/FLUX.1-schnell")
HF_TOKEN = os.getenv("HF_TOKEN") or None
MAX_REQUESTS_PER_MINUTE = int(os.getenv("MAX_REQUESTS_PER_MINUTE", "2"))

if not API_TOKEN or API_TOKEN == "replace-with-a-long-random-secret":
    raise RuntimeError("Set a strong API_TOKEN in the environment before starting.")

security = HTTPBearer(auto_error=False)
pipeline = None
rate_lock = Lock()
request_times: dict[str, deque[float]] = defaultdict(deque)


class GenerationRequest(BaseModel):
    prompt: str = Field(min_length=5, max_length=1800)
    width: int = Field(default=1024, ge=512, le=1024)
    height: int = Field(default=1024, ge=512, le=1024)
    steps: int = Field(default=4, ge=1, le=4)
    seed: int | None = Field(default=None, ge=0, le=2**32 - 1)


@asynccontextmanager
async def lifespan(app: FastAPI):
    global pipeline
    dtype = torch.bfloat16 if torch.cuda.is_available() and torch.cuda.is_bf16_supported() else torch.float16
    pipeline = FluxPipeline.from_pretrained(
        MODEL_ID,
        torch_dtype=dtype,
        token=HF_TOKEN,
    )
    if torch.cuda.is_available():
        pipeline.to("cuda")
    else:
        # CPU mode is for experimentation only and will be very slow / memory intensive.
        pipeline.enable_model_cpu_offload()
    yield
    pipeline = None


app = FastAPI(title="INFOREST Image API", version="0.1.0", lifespan=lifespan)


def require_token(credentials: HTTPAuthorizationCredentials | None = Depends(security)):
    if credentials is None or not secrets.compare_digest(credentials.credentials, API_TOKEN):
        raise HTTPException(status_code=401, detail="Invalid or missing bearer token")


def apply_rate_limit(request: Request):
    client = request.client.host if request.client else "unknown"
    now = time.monotonic()
    with rate_lock:
        q = request_times[client]
        while q and now - q[0] > 60:
            q.popleft()
        if len(q) >= MAX_REQUESTS_PER_MINUTE:
            raise HTTPException(status_code=429, detail="Local rate limit reached; try again later.")
        q.append(now)


@app.get("/health")
def health():
    return {"ok": True, "service": "INFOREST Image", "model": MODEL_ID, "ready": pipeline is not None}


@app.post("/v1/images/generations", dependencies=[Depends(require_token), Depends(apply_rate_limit)])
def generate(body: GenerationRequest):
    if pipeline is None:
        raise HTTPException(status_code=503, detail="Model is still loading.")
    try:
        generator = None
        if body.seed is not None:
            generator = torch.Generator(device="cpu").manual_seed(body.seed)
        result = pipeline(
            prompt=body.prompt,
            width=body.width,
            height=body.height,
            num_inference_steps=body.steps,
            guidance_scale=0.0,
            max_sequence_length=256,
            generator=generator,
        )
        image = result.images[0]
        buf = io.BytesIO()
        image.save(buf, format="PNG")
        encoded = base64.b64encode(buf.getvalue()).decode("ascii")
        return {"created": int(time.time()), "model": MODEL_ID, "data": [{"b64_json": encoded}]}
    except torch.cuda.OutOfMemoryError:
        raise HTTPException(status_code=503, detail="GPU memory exhausted; reduce concurrency or image size.")
    except Exception as exc:
        # Avoid returning internal paths, tokens, or stack traces to clients.
        raise HTTPException(status_code=500, detail=f"Generation failed: {type(exc).__name__}")
