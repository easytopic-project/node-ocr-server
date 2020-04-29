#!/usr/bin/env node
import { QUEUE_SERVER, QUEUE_NAME as q, FILES_PATH, FILES_SERVER } from './env';
import tesseract from 'node-tesseract-ocr'
import amqp from 'amqplib'
import { downloadFile } from './files';

const config = {
    lang: "eng",
    oem: 1,
    psm: 3,
}


function ocr(file) {
    return tesseract.recognize(file, config)
}

async function main() {
    const conn = await amqp.connect(`amqp://${QUEUE_SERVER}`);
    const ch = await conn.createChannel();
    ch.assertQueue(q, { durable: false })
    ch.prefetch(1)

    console.log(`Waiting for messages in '${q}'. To exit press CTRL+C`);
    ch.consume(q, async msg => {
        const { file } = JSON.parse(msg.content.toString())
        const f = await downloadFile(`http://${FILES_SERVER}/files/${file.name}`, FILES_PATH)
        console.warn(await ocr(f));
    }, { noAck: true });
}


main()