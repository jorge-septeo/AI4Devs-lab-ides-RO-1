import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import 'express-async-errors'; // Para manejar errores asíncronos automáticamente
import apiRoutes from './routes';
import { errorHandler } from './middlewares/errorHandler';
import { prisma } from './utils/prismaClient';

// Cargar variables de entorno
dotenv.config();

// Inicializar la aplicación Express
export const app = express();

// Puerto de la aplicación
const port = process.env.PORT || 3010;

// Middlewares
app.use(helmet()); // Seguridad
app.use(cors()); // Habilitar CORS
app.use(express.json()); // Parsear solicitudes JSON
app.use(express.urlencoded({ extended: true })); // Parsear solicitudes de formulario

// Servir archivos estáticos (para los CVs)
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Ruta principal
app.get('/', (_req, res) => {
  res.send('ATS API - Backend para Sistema de Seguimiento de Talento');
});

// Rutas de la API
app.use('/api', apiRoutes);

// Middleware de manejo de errores
app.use(errorHandler);

// Iniciar el servidor
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Servidor ejecutándose en http://localhost:${port}`);
  });
}

// Manejar cierre de la aplicación
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  console.log('Conexión a la base de datos cerrada');
  process.exit(0);
});

export default app;
