import { Request, Response, NextFunction } from 'express';
import { MulterError } from 'multer';
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library';

// Clase personalizada para errores de la API
export class ApiError extends Error {
    statusCode: number;
    
    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'ApiError';
        Object.setPrototypeOf(this, ApiError.prototype);
    }
}

// Middleware para gestionar errores
export function errorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) {
    console.error('Error:', err);

    // Error de Multer (carga de archivos)
    if (err instanceof MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(413).json({
                success: false,
                message: 'El archivo excede el tamaño máximo permitido (5MB)'
            });
        }
        return res.status(400).json({
            success: false,
            message: `Error en la carga de archivos: ${err.message}`
        });
    }

    // Error de la API personalizado
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message
        });
    }

    // Error de validación de Prisma
    if (err instanceof PrismaClientValidationError) {
        return res.status(400).json({
            success: false,
            message: 'Error de validación en los datos'
        });
    }

    // Error de Prisma (como clave única violada)
    if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
            return res.status(409).json({
                success: false,
                message: `Ya existe un registro con este ${err.meta?.target || 'campo'}`
            });
        }
        
        return res.status(400).json({
            success: false,
            message: 'Error en la base de datos'
        });
    }

    // Error genérico
    return res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
    });
}
