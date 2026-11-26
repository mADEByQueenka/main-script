import argparse
import torch
from model import InforestSeed, encode, decode


def main():
    parser = argparse.ArgumentParser(description="Generate text with an INFOREST Seed checkpoint.")
    parser.add_argument("--checkpoint", required=True)
    parser.add_argument("--prompt", default="")
    parser.add_argument("--tokens", type=int, default=200)
    parser.add_argument("--temperature", type=float, default=0.9)
    args = parser.parse_args()

    device = "cuda" if torch.cuda.is_available() else "cpu"
    saved = torch.load(args.checkpoint, map_location=device, weights_only=False)
    cfg = saved["config"]
    model = InforestSeed(**cfg).to(device)
    model.load_state_dict(saved["model"])
    model.eval()
    start = torch.tensor([encode(args.prompt) or [256]], dtype=torch.long, device=device)
    output = model.generate(start, max_new_tokens=args.tokens, temperature=args.temperature)
    print(decode(output[0].tolist()))


if __name__ == "__main__":
    main()
