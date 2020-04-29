
export const {
    PORT = 3000,
    QUEUE_SERVER = 'localhost:5672',
    QUEUE_NAME = 'ocr',
    FILES_PATH = '/temp',   // Folder where temporally files will be stored
    FILES_SERVER = 'localhost:3001',      // Files server
} = process.env
