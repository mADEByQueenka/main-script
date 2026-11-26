# INFOREST Image

Open-source image-generation service for the INFOREST ecosystem.

**What this is:** an API wrapper and deployment template around the open-weight `black-forest-labs/FLUX.1-schnell` model. INFOREST Image is our integration/software project; the underlying model weights were created by Black Forest Labs and are not claimed as our own.

## Model and license

- Model: [FLUX.1 schnell](https://huggingface.co/black-forest-labs/FLUX.1-schnell)
- Model license: Apache-2.0 (see the model card and upstream repository).
- Upstream inference code: [black-forest-labs/flux](https://github.com/black-forest-labs/flux)
- The model repository is gated on Hugging Face: each operator must review and accept its terms before downloading weights.

The INFOREST Image source code in this directory is MIT-licensed. The model weights and dependencies retain their own licenses.

## Features

- FastAPI endpoint: `POST /v1/images/generations`
- Bearer-token protection
- Configurable output dimensions and inference steps
- PNG response as base64 JSON
- No paid API fallback and no external generation API calls

## Run locally

Requires Python 3.11+ and a compatible NVIDIA GPU with enough VRAM for the selected model/dtype. FLUX.1 schnell is a large 12B-parameter model; this is not a lightweight CPU service.

1. Create a Hugging Face account, review and accept the model terms.
2. Set `HF_TOKEN` if the model download requires authentication.
3. Copy `.env.example` to `.env` and set a long random `API_TOKEN`.
4. Install dependencies and start the API:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

For Windows PowerShell, activate with `.venv\\Scripts\\Activate.ps1`.

## API

`POST /v1/images/generations`

Header: `Authorization: Bearer YOUR_API_TOKEN`

Body:

```json
{
  "prompt": "A tiny glass greenhouse in a magical forest, soft morning light",
  "width": 1024,
  "height": 1024,
  "steps": 4,
  "seed": 42
}
```

Returns `image/png` as base64 in JSON. See `docs/API.md`.

## Safety and deployment

This starter is intended for personal and small controlled deployments. Add a proper moderation service, persistent per-user quotas, request queue, logging controls, TLS termination, and abuse monitoring before exposing it publicly. Do not expose the API without a strong token. The included in-memory rate limit is process-local and resets on restart; it is not a production quota system.

The server does not make any paid API calls. Hosting and GPU compute may still cost money depending on where it is deployed. No free or unlimited hosting is promised.

## Project status

- [x] Repository starter and API contract
- [x] Local inference adapter
- [ ] GPU deployment and end-to-end generation test
- [ ] Moderation and persistent user quotas
- [ ] Telegram bot integration
- [ ] Fine-tuned INFOREST style adapter (future work; requires a lawful dataset and training compute)

## Attribution

FLUX.1 schnell is by Black Forest Labs. INFOREST Image is an independent integration project and is not affiliated with Black Forest Labs.
