# Node OCR server

Node OCR microsservice using tesseract and RabbitMQ.

## Usage

This server can be used with Docker (see docker-compose file for example). In Linux:

```bash
sudo apt install tesseract-ocr
npm install
npm start
```

## Settings

Settings need to be passed as enviroment variables:

 - `QUEUE_SERVER`: RabbitMQ queue server. **Default**: 'localhost:5672'
 - `FILES_SERVER`: [Node Files Server](https://github.com/maxjf1/node-files-microservice) URL. **Default**: 'localhost:3000'
 - `INPUT_QUEUE_NAME`: RabbitMQ input queue name. **Default**: 'ocr-in'
 - `OUTPUT_QUEUE_NAME`: RabbitMQ input queue name. **Default**: 'ocr-out'
 - `FILES_PATH`: Folder for temporally files. **Default**: '/temp'

## Publishing a new version

```bash
docker login
docker build -t maxjf1/node-ocr-server:latest .
docker push maxjf1/node-ocr-server:latest
```