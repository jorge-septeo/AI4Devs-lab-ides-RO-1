import express from 'express';
import candidateRoutes from './candidateRoutes';

const router = express.Router();

// Definir rutas principales
router.use('/candidates', candidateRoutes);

// Ruta para verificar que la API está funcionando
router.get('/health', (_req, res) => {
    res.status(200).json({ 
        status: 'success', 
        message: 'API is running' 
    });
});

export default router;
