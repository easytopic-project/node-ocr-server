#!/usr/bin/env node
import express from 'express';
import cors from 'cors'
import bodyParser from 'body-parser'
import { PORT } from './env';
import tesseract from 'node-tesseract-ocr'
import fileUpload from 'express-fileupload'


const config = {
    lang: "eng",
    oem: 1,
    psm: 3,
}

const uploadMiddleware = fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/ocr/'
})

const app = express()

app.disable('x-powered-by')
app.use(cors())
app.use(bodyParser.json())

app.all('/', (req, res) => res.send('API ROOT'))

app.get(['/example/:id', '/example'], ({ params: { id = 1 } }, res) => {
    tesseract.recognize(`example/example-${id}.jpg`, config)
        .then(text => res.send(`<img style="float:right;width: 50vw" src="/example-${id}.jpg"/><pre>${text}</pre>`))
        .catch(error => {
            console.error(error)
            res.status(500).send(error.message)
        })
})

app.post('/ocr', uploadMiddleware, (req, res) => {
    console.log(req.files)
    tesseract.recognize(req.files.file.tempFilePath, config)
        .then(text => res.send(text))
        .catch(error => {
            console.error(error)
            res.status(500).send(error.message)
        })
})

app.use('/', express.static('example'))

app.all('*', (req, res) => res.sendStatus(404))

app.listen(PORT, () => console.log(`Servidor inciado na porta ${PORT} ( http://localhost:${PORT}/ )`))

export default app