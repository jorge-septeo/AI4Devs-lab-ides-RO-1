import multer from 'multer';
import path from 'path';
import { Request } from 'express';
import fs from 'fs-extra';

// Asegurar que el directorio de uploads exista
const uploadDir = path.join(process.cwd(), 'uploads', 'cv');
fs.ensureDirSync(uploadDir);

// Configuración de almacenamiento para Multer
const storage = multer.diskStorage({
    destination: (_req: Request, _file: Express.Multer.File, cb) => {
        cb(null, uploadDir);
    },
    filename: (_req: Request, file: Express.Multer.File, cb) => {
        // Crear un nombre de archivo único basado en la fecha actual y el nombre original
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, uniqueSuffix + ext);
    }
});

// Validación de tipos de archivo
const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Tipo de archivo no permitido. Solo se aceptan PDF o DOCX.'));
    }
};

// Límite de tamaño de archivo: 5MB
const limits = {
    fileSize: 5 * 1024 * 1024
};

// Middleware de Multer configurado
export const uploadCV = multer({ 
    storage,
    fileFilter,
    limits
}).single('cv');
