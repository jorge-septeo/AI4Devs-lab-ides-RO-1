import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// Validación de datos personales
export const validateCandidate = [
    // Validar campos personales
    body('firstName')
        .trim()
        .notEmpty().withMessage('El nombre es obligatorio')
        .isLength({ min: 2, max: 50 }).withMessage('El nombre debe tener entre 2 y 50 caracteres'),
    
    body('lastName')
        .trim()
        .notEmpty().withMessage('El apellido es obligatorio')
        .isLength({ min: 2, max: 50 }).withMessage('El apellido debe tener entre 2 y 50 caracteres'),
    
    body('email')
        .trim()
        .notEmpty().withMessage('El email es obligatorio')
        .isEmail().withMessage('Debe ser un email válido'),
    
    body('phone')
        .trim()
        .notEmpty().withMessage('El teléfono es obligatorio')
        .matches(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\\s\\./0-9]*$/).withMessage('Formato de teléfono inválido'),
    
    // Validaciones para dirección estructurada (opcionales)
    body('street').optional({ checkFalsy: true }).trim().isLength({ min: 2, max: 150 }).withMessage('La calle debe tener entre 2 y 150 caracteres'),
    body('city').optional({ checkFalsy: true }).trim().isLength({ min: 2, max: 100 }).withMessage('La ciudad debe tener entre 2 y 100 caracteres'),
    body('state').optional({ checkFalsy: true }).trim().isLength({ min: 2, max: 100 }).withMessage('El estado/provincia debe tener entre 2 y 100 caracteres'),
    body('postalCode').optional({ checkFalsy: true }).trim().isLength({ min: 3, max: 20 }).withMessage('El código postal debe tener entre 3 y 20 caracteres'),
    body('country').optional({ checkFalsy: true }).trim().isLength({ min: 2, max: 100 }).withMessage('El país debe tener entre 2 y 100 caracteres'),

    // Validación para campos opcionales de Candidate
    body('status').optional({ checkFalsy: true }).trim().isString().withMessage('El estado debe ser un texto'),
    body('tags')
        .optional({ checkFalsy: true })
        .customSanitizer((value) => { 
            if (typeof value === 'string') {
                try { return JSON.parse(value); } catch (e) { return value; }
            }
            return value;
        })
        .isArray().withMessage('Las etiquetas deben ser un array o un string JSON de un array'),
    body('tags.*').optional().isString().trim().withMessage('Cada etiqueta debe ser un texto'),
    
    // Validación para el array de educación
    body('education')
        .customSanitizer((value) => {
            if (typeof value === 'string') {
                try {
                    return JSON.parse(value);
                } catch (e) {
                    // Si falla el parseo, devuelve el valor original para que falle isArray()
                    return value; 
                }
            }
            return value; // Si ya es un array o cualquier otro tipo, lo devuelve tal cual
        })
        .isArray().withMessage('La educación debe ser un array (o un string JSON de un array).'),
    
    body('education.*.institution')
        .trim()
        .notEmpty().withMessage('La institución es obligatoria')
        .isLength({ min: 2, max: 100 }).withMessage('La institución debe tener entre 2 y 100 caracteres'),
    
    body('education.*.title')
        .trim()
        .notEmpty().withMessage('El título es obligatorio')
        .isLength({ min: 2, max: 100 }).withMessage('El título debe tener entre 2 y 100 caracteres'),
    
    body('education.*.startDate')
        .trim()
        .notEmpty().withMessage('La fecha de inicio es obligatoria')
        .isISO8601().withMessage('La fecha de inicio debe tener un formato válido'),
    body('education.*.endDate')
        .trim()
        .notEmpty().withMessage('La fecha de fin es obligatoria')
        .isISO8601().withMessage('La fecha de fin debe tener un formato válido'),
    body('education.*.degree').optional({ checkFalsy: true }).trim().isString().withMessage('El grado debe ser un texto'),
    body('education.*.fieldOfStudy').optional({ checkFalsy: true }).trim().isString().withMessage('El campo de estudio debe ser un texto'),
    body('education.*.description').optional({ checkFalsy: true }).trim().isString().isLength({ min: 5, max: 500 }).withMessage('La descripción de la educación debe tener entre 5 y 500 caracteres'),

    // Validación para el array de experiencia
    body('experience')
        .customSanitizer((value) => {
            if (typeof value === 'string') {
                try {
                    return JSON.parse(value);
                } catch (e) {
                    return value;
                }
            }
            return value;
        })
        .isArray().withMessage('La experiencia debe ser un array (o un string JSON de un array).'),
    
    body('experience.*.company')
        .trim()
        .notEmpty().withMessage('La empresa es obligatoria')
        .isLength({ min: 2, max: 100 }).withMessage('La empresa debe tener entre 2 y 100 caracteres'),
    
    body('experience.*.position')
        .trim()
        .notEmpty().withMessage('El cargo es obligatorio')
        .isLength({ min: 2, max: 100 }).withMessage('El cargo debe tener entre 2 y 100 caracteres'),
    
    body('experience.*.startDate')
        .trim()
        .notEmpty().withMessage('La fecha de inicio es obligatoria')
        .isISO8601().withMessage('La fecha de inicio debe tener un formato válido'),
    body('experience.*.endDate')
        .trim()
        .notEmpty().withMessage('La fecha de fin es obligatoria')
        .isISO8601().withMessage('La fecha de fin debe tener un formato válido'),
    body('experience.*.description')
        .trim()
        .notEmpty().withMessage('La descripción es obligatoria')
        .isLength({ min: 10, max: 1000 }).withMessage('La descripción debe tener entre 10 y 1000 caracteres'),
    body('experience.*.location').optional({ checkFalsy: true }).trim().isString().withMessage('La ubicación debe ser un texto'),
    body('experience.*.currentJob').optional({ checkFalsy: true })
        .customSanitizer(value => {
            if (typeof value === 'string') {
                if (value.toLowerCase() === 'true') return true;
                if (value.toLowerCase() === 'false') return false;
            }
            return value;
        })
        .isBoolean().withMessage('Trabajo actual debe ser un valor booleano (true/false) o un string "true"/"false"'),
    body('experience.*.achievements')
        .optional({ checkFalsy: true })
        .customSanitizer((value) => {
            if (typeof value === 'string') {
                try { return JSON.parse(value); } catch (e) { return value; }
            }
            return value;
        })
        .isArray().withMessage('Los logros deben ser un array o un string JSON de un array'),
    body('experience.*.achievements.*').optional().isString().trim().withMessage('Cada logro debe ser un texto'),
    body('experience.*.skills')
        .optional({ checkFalsy: true })
        .customSanitizer((value) => {
            if (typeof value === 'string') {
                try { return JSON.parse(value); } catch (e) { return value; }
            }
            return value;
        })
        .isArray().withMessage('Las habilidades deben ser un array o un string JSON de un array'),
    body('experience.*.skills.*').optional().isString().trim().withMessage('Cada habilidad debe ser un texto'),
    
    // Middleware para verificar errores de validación
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Error de validación',
                errors: errors.array()
            });
        }
        next();
    }
];
