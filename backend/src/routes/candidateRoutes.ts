import express from 'express';
import { candidateController } from '../controllers/candidateController';
import { uploadCV } from '../middlewares/fileUpload';
import { validateCandidate } from '../validators/candidateValidator';
import { Request, Response, NextFunction } from 'express';

const router = express.Router();

// Middleware para manejar errores de carga con multer
const handleFileUpload = (req: Request, res: Response, next: NextFunction) => {
    uploadCV(req, res, (error: any) => {
        if (error) {
            return res.status(400).json({ 
                success: false, 
                message: `Error al cargar el archivo: ${error.message}` 
            });
        }
        next();
    });
};

// Rutas para candidatos
router.post('/', handleFileUpload, validateCandidate, candidateController.createCandidate);
router.get('/', candidateController.getAllCandidates);
router.get('/:id', candidateController.getCandidateById);
router.put('/:id', handleFileUpload, validateCandidate, candidateController.updateCandidate);
router.delete('/:id', candidateController.deleteCandidate);

export default router;
