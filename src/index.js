#!/usr/bin/env node
import {
    QUEUE_SERVER,
    INPUT_QUEUE_NAME as qIn,
    OUTPUT_QUEUE_NAME as qOut,
    FILES_PATH,
    FILES_SERVER
} from './env';
import tesseract from 'node-tesseract-ocr'
import amqp from 'amqplib'
import { downloadFile, deleteFile } from './files';

const config = {
    lang: "eng",
    oem: 1,
    psm: 3,
}



async function main() {
    const connection = await amqp.connect(`amqp://${QUEUE_SERVER}`)
    const ch = await connection.createChannel()
    await ch.assertQueue(qOut, { durable: true })
    await ch.assertQueue(qIn, { durable: true })

    console.log(`Waiting for messages in '${qIn}'. Output will be sended to '${qOut}'. To exit press CTRL+C`);
    ch.consume(qIn, async msg => {
        console.log(`Received file`);
        
        const { file } = JSON.parse(msg.content.toString()), url = `http://${FILES_SERVER}/files/${file.name}`
        const f = await downloadFile(url, FILES_PATH)
        console.log(`file downloaded at ${f}`);
        

        // Star the OCR parser
        const text = await tesseract.recognize(f, config)
        ch.sendToQueue(qOut, Buffer.from(JSON.stringify({
            file,
            ocr: text
        })), { persistent: true })
        ch.ack(msg)
        console.log(`OCR results of ${file.name} sent.`);
        deleteFile(f)
    });
}


main()