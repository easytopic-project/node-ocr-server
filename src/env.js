
export const {
    QUEUE_SERVER = 'localhost:5672',
    INPUT_QUEUE_NAME = 'ocr-in',
    OUTPUT_QUEUE_NAME = 'ocr-out',
    FILES_PATH = '/temp',               // Folder where temporally files will be stored
    FILES_SERVER = 'localhost:3000',    // Files server
    RECONNECT_TIMEOUT = 3000,           // Time to retry to connect to AMQP
    RECONNECT_MAX = 30,                 // Maximum attempts to reconnect
} = process.env
