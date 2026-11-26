# API reference

## Health check

`GET /health`

No authentication required. Reports whether model loading has completed.

## Generate an image

`POST /v1/images/generations`

Headers:

- `Authorization: Bearer <API_TOKEN>`
- `Content-Type: application/json`

Example:

```json
{
  "prompt": "A quiet futuristic botanical library, glass architecture, cinematic lighting",
  "width": 1024,
  "height": 1024,
  "steps": 4,
  "seed": 1234
}
```

Response:

```json
{
  "created": 1795700000,
  "model": "black-forest-labs/FLUX.1-schnell",
  "data": [{ "b64_json": "<base64 PNG>" }]
}
```

The caller can decode `data[0].b64_json` to a PNG file. This API returns the image bytes encoded in JSON and does not upload images to a third-party image host.
