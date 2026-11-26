# INFOREST Neural Lab — Seed 0.1

An original, compact decoder-only Transformer language-model implementation by INFOREST, initialized from random weights. No pretrained model weights are bundled or downloaded.

This is a research starter, not a finished assistant. A randomly initialized model produces low-quality output until it is trained on a sufficiently large, lawful, carefully curated text corpus. Training requires GPU compute for useful experiments. The repository does not include a dataset.

## What is ours

- Model implementation and training pipeline in this repository.
- Byte-level tokenizer (256 byte values plus a beginning-of-sequence token).
- Small GPT-style decoder-only Transformer architecture.
- Sampling script and reproducible configuration.

The general Transformer/GPT design is established research; this implementation is original project code, not a claim that INFOREST invented the Transformer architecture.

## Quick start

Python 3.11+, PyTorch 2.4+.

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Prepare a plain UTF-8 text file that you have the right to use:

```bash
python train.py --data data/train.txt --steps 2000 --batch-size 16
```

Generate:

```bash
python generate.py --checkpoint checkpoints/seed.pt --prompt "INFOREST"
```

On Windows PowerShell, activate with `.venv\\Scripts\\Activate.ps1`.

## Important limitations

- This is a tiny experimental language model, not ChatGPT and not a production chatbot.
- Random initialization means it knows nothing before training.
- Byte-level tokenization is simple and robust but less compute-efficient than modern subword tokenizers.
- Training quality depends on dataset quality, size, rights, hardware, and compute budget.
- Do not train on private conversations, personal data, or copyrighted material without appropriate rights and consent.
- Model output may be inaccurate or biased; do not use it for high-stakes decisions.

## License

The source code is MIT licensed. Training data and any resulting checkpoints are separate artifacts and must retain their own provenance and licensing information.
