import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prismaClient';
import { ApiError } from '../middlewares/errorHandler';

export const candidateController = {
    /**
     * Crear un nuevo candidato
     */
    createCandidate: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {
                firstName, lastName, email, phone,
                street, city, state, postalCode, country, // Campos de dirección estructurada
                status, // Nuevo campo opcional
                // tags // Se manejará por separado si es necesario parseo complejo o si viene como array
            } = req.body;

            let education = req.body.education;
            let experience = req.body.experience;
            let tags = req.body.tags; // Nuevo campo opcional

            // Parseo de JSON strings a arrays (si vienen así desde FormData)
            if (typeof education === 'string') education = JSON.parse(education);
            if (typeof experience === 'string') experience = JSON.parse(experience);
            if (typeof tags === 'string') tags = JSON.parse(tags); // Parsear tags si es string
            if (tags === undefined) tags = []; // Asegurar que tags sea un array si no se proporciona

            const cvFilePath = req.file ? `uploads/cv/${req.file.filename}` : null;

            const candidate = await prisma.candidate.create({
                data: {
                    firstName,
                    lastName,
                    email,
                    phone,
                    // Dirección estructurada
                    street,
                    city,
                    state,
                    postalCode,
                    country,
                    cvFilePath,
                    status, // Añadir status
                    tags,   // Añadir tags
                    education: {
                        create: education.map((edu: any) => ({
                            institution: edu.institution,
                            title: edu.title,
                            startDate: new Date(edu.startDate),
                            endDate: new Date(edu.endDate),
                            degree: edu.degree, // Nuevo campo
                            fieldOfStudy: edu.fieldOfStudy, // Nuevo campo
                            description: edu.description, // Nuevo campo
                        }))
                    },
                    experience: {
                        create: experience.map((exp: any) => ({
                            company: exp.company,
                            position: exp.position,
                            startDate: new Date(exp.startDate),
                            endDate: new Date(exp.endDate),
                            description: exp.description,
                            location: exp.location, // Nuevo campo
                            currentJob: typeof exp.currentJob === 'string' ? exp.currentJob.toLowerCase() === 'true' : Boolean(exp.currentJob), // Nuevo campo, asegurar booleano
                            achievements: exp.achievements || [], // Nuevo campo, asegurar array
                            skills: exp.skills || [], // Nuevo campo, asegurar array
                        }))
                    }
                },
                include: {
                    education: true,
                    experience: true
                }
            });
            
            return res.status(201).json({
                success: true,
                message: 'Candidato creado exitosamente',
                data: candidate
            });
        } catch (error) {
            next(error);
        }
    },
    
    /**
     * Obtener todos los candidatos
     */
    getAllCandidates: async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const candidates = await prisma.candidate.findMany({
                include: {
                    education: true,
                    experience: true
                }
            });
            
            return res.status(200).json({
                success: true,
                data: candidates
            });
        } catch (error) {
            next(error);
        }
    },
    
    /**
     * Obtener un candidato por ID
     */
    getCandidateById: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            
            const candidate = await prisma.candidate.findUnique({
                where: { id },
                include: {
                    education: true,
                    experience: true
                }
            });
            
            if (!candidate) {
                throw new ApiError(404, 'Candidato no encontrado');
            }
            
            return res.status(200).json({
                success: true,
                data: candidate
            });
        } catch (error) {
            next(error);
        }
    },
    
    /**
     * Actualizar un candidato existente
     */
    updateCandidate: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const {
                firstName, lastName, email, phone,
                street, city, state, postalCode, country, // Campos de dirección estructurada
                status, // Nuevo campo opcional
                // tags // Se manejará por separado si es necesario parseo complejo
            } = req.body;

            let tags = req.body.tags; // Nuevo campo opcional
            if (typeof tags === 'string') tags = JSON.parse(tags);
            // No se actualiza education y experience aquí, se haría en endpoints dedicados

            const existingCandidate = await prisma.candidate.findUnique({
                where: { id }
            });

            if (!existingCandidate) {
                throw new ApiError(404, 'Candidato no encontrado');
            }

            const updatedCandidate = await prisma.candidate.update({
                where: { id },
                data: {
                    firstName,
                    lastName,
                    email,
                    phone,
                    street,
                    city,
                    state,
                    postalCode,
                    country,
                    status,
                    ...(tags && { tags }), // Actualizar tags si se proporcionan
                    ...(req.file && { cvFilePath: `uploads/cv/${req.file.filename}` })
                }
            });

            return res.status(200).json({
                success: true,
                message: 'Candidato actualizado exitosamente',
                data: updatedCandidate
            });
        } catch (error) {
            next(error);
        }
    },
    
    /**
     * Eliminar un candidato
     */
    deleteCandidate: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            
            // Verificar si el candidato existe
            const existingCandidate = await prisma.candidate.findUnique({
                where: { id }
            });
            
            if (!existingCandidate) {
                throw new ApiError(404, 'Candidato no encontrado');
            }
            
            // Eliminar candidato (esto eliminará automáticamente los registros de educación
            // y experiencia relacionados debido a la relación Cascade definida en el esquema)
            await prisma.candidate.delete({
                where: { id }
            });
            
            return res.status(200).json({
                success: true,
                message: 'Candidato eliminado exitosamente'
            });
        } catch (error) {
            next(error);
        }
    }
};
