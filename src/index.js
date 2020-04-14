#!/usr/bin/env node
import express from 'express';
import { QUEUE_SERVER, QUEUE_NAME as q } from './env';
import tesseract from 'node-tesseract-ocr'

const config = {
    lang: "eng",
    oem: 1,
    psm: 3,
}

const app = express()


app.post('/ocr', uploadMiddleware, (req, res) => {
    console.log(req.files)
    tesseract.recognize(req.files.file.tempFilePath, config)
        .then(text => res.send(text))
        .catch(error => {
            console.error(error)
            res.status(500).send(error.message)
        })
})

amqp.connect(`amqp://${QUEUE_SERVER}`, (err, conn) =>  {
    if(err) console.error(err)
    
    conn.createChannel( (err, ch) => {
        if(err) console.error(err)

        ch.assertQueue(q, { durable: false })
        ch.prefetch(1)

        console.log(`Waiting for messages in '${q}'. To exit press CTRL+C`);
        ch.consume(q, msg => {
            console.log(msg.content.toString());
        }, 
        { noAck: true });
    });
});