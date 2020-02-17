# Node OCR server

Node OCR microsservice using tesseract

## Publicando uma nova versão

```bash
docker login
docker build -t maxjf1/node-ocr-server:latest .
docker push maxjf1/node-ocr-server:latest
```