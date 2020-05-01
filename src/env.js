
export const {
    QUEUE_SERVER = 'localhost:5672',
    INPUT_QUEUE_NAME = 'ocr-in',
    OUTPUT_QUEUE_NAME = 'ocr-out',
    FILES_PATH = '/temp',   // Folder where temporally files will be stored
    FILES_SERVER = 'localhost:3000',      // Files server
} = process.env
