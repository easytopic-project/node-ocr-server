const util = require('util')
import { createWriteStream } from "fs"
import fetch from "node-fetch"
const streamPipeline = util.promisify(require('stream').pipeline)


/**
 * Download an file and stores it in an folder
 * @export
 * @param {String} url the file URL
 * @param {String} file the filename it wil be stored
 * @param {String} folder the folder  it wil be stored
 * @returns
 */
export async function downloadFile(url, folder = '', file = null) {
    if (!file) { // generate an name for the file
        file = url.split('/')
        file = file[file.length - 1]
    }

    const res = await fetch(url)
    if (!res.ok) throw new Error(`unexpected response ${res.statusText}`);
    await streamPipeline(res.body, createWriteStream(`${folder}/${file}`));
    return `${folder}/${file}`
}
