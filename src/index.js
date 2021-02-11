#!/usr/bin/env node
import {
    QUEUE_SERVER,
    INPUT_QUEUE_NAME as qIn,
    OUTPUT_QUEUE_NAME as qOut,
    FILES_PATH,
    FILES_SERVER,
    RECONNECT_TIMEOUT,
    RECONNECT_MAX,
} from './env';
import tesseract from 'node-tesseract-ocr'
import amqp from 'amqplib'
import { downloadFile, deleteFile } from './files';
let retries = 0
const config = {
    lang: "eng",
    oem: 1,
    psm: 3,
}

const asyncTimeout = time => new Promise(resolve => setTimeout(resolve, time))

async function getConnection() {
    try {
        return await amqp.connect(`amqp://${QUEUE_SERVER}`)
    }
    catch (err) {
        retries++;
        if (retries > RECONNECT_MAX) throw err
        console.warn(`Connection to ${QUEUE_SERVER} failed (attempt ${retries}). Retrying in ${RECONNECT_TIMEOUT / 1000} seconds...`)
        await asyncTimeout(RECONNECT_TIMEOUT);
        return await getConnection()
    }
}



async function main() {
    const connection = await getConnection()
    const ch = await connection.createChannel()
    await ch.assertQueue(qOut, { durable: true })
    await ch.assertQueue(qIn, { durable: true })

    console.log(`Waiting for messages in '${qIn}'. Output will be sended to '${qOut}'. To exit press CTRL+C`);
    ch.consume(qIn, async msg => {
        console.log(`Received file`);

        const args = JSON.parse(msg.content.toString());
        const { file } = args, url = file.name ? `http://${FILES_SERVER}/files/${file.name}` : file
        const f = await downloadFile(url, FILES_PATH)
        console.log(`file downloaded at ${f}`);


        // Star the OCR parser
        const text = await tesseract.recognize(f, config)
        ch.sendToQueue(qOut, Buffer.from(JSON.stringify({
            ...args,
            ocr: text
        })), { persistent: true })
        ch.ack(msg)
        console.log(`OCR results of ${file.name || 'file'} sent.`);
        deleteFile(f)
    });
}


main()