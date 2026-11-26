import argparse
from pathlib import Path
import torch
from model import InforestSeed, encode


def main():
    parser = argparse.ArgumentParser(description="Train INFOREST Seed from random initialization.")
    parser.add_argument("--data", required=True, help="UTF-8 text corpus you have rights to use")
    parser.add_argument("--steps", type=int, default=2000)
    parser.add_argument("--batch-size", type=int, default=16)
    parser.add_argument("--context", type=int, default=256)
    parser.add_argument("--lr", type=float, default=3e-4)
    parser.add_argument("--out", default="checkpoints/seed.pt")
    args = parser.parse_args()

    text = Path(args.data).read_text(encoding="utf-8")
    tokens = torch.tensor(encode(text), dtype=torch.long)
    if len(tokens) < args.context + 2:
        raise SystemExit(f"Corpus too small: need at least {args.context + 2} bytes.")
    device = "cuda" if torch.cuda.is_available() else "cpu"
    model = InforestSeed(context=args.context).to(device)
    optimizer = torch.optim.AdamW(model.parameters(), lr=args.lr)

    model.train()
    for step in range(1, args.steps + 1):
        starts = torch.randint(0, len(tokens) - args.context - 1, (args.batch_size,))
        x = torch.stack([tokens[i:i + args.context] for i in starts]).to(device)
        y = torch.stack([tokens[i + 1:i + args.context + 1] for i in starts]).to(device)
        _, loss = model(x, y)
        optimizer.zero_grad(set_to_none=True)
        loss.backward()
        torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
        optimizer.step()
        if step == 1 or step % 100 == 0:
            print(f"step {step}/{args.steps} loss={loss.item():.4f} device={device}")

    output = Path(args.out)
    output.parent.mkdir(parents=True, exist_ok=True)
    torch.save({
        "model": model.state_dict(),
        "config": {"context": args.context, "width": 256, "layers": 6, "heads": 8},
        "training": {"steps": args.steps, "corpus_bytes": len(tokens)},
    }, output)
    print(f"Saved checkpoint: {output}")


if __name__ == "__main__":
    main()
