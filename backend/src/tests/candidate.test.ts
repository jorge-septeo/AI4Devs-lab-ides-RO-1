import request from 'supertest';
import { app } from '../index';
import { prisma } from '../utils/prismaClient';
import path from 'path';

describe('Candidate API Endpoints', () => {
    // Crear candidato de prueba para reutilizar
    const testCandidate = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+123456789',
        address: '123 Test Street',
        education: JSON.stringify([{
            institution: 'Test University',
            title: 'Computer Science',
            startDate: '2015-09-01',
            endDate: '2019-06-30'
        }]),
        experience: JSON.stringify([{
            company: 'Test Company',
            position: 'Software Developer',
            startDate: '2019-07-01',
            endDate: '2023-01-01',
            description: 'Desarrollo de aplicaciones web con React y Node.js'
        }])
    };

    // Limpiar la base de datos antes y después de las pruebas
    beforeAll(async () => {
        await prisma.experience.deleteMany({});
        await prisma.education.deleteMany({});
        await prisma.candidate.deleteMany({});
    });

    afterAll(async () => {
        await prisma.experience.deleteMany({});
        await prisma.education.deleteMany({});
        await prisma.candidate.deleteMany({});
        await prisma.$disconnect();
    });

    // Test para crear un candidato
    it('should create a new candidate', async () => {
        const res = await request(app)
            .post('/api/candidates')
            .field('firstName', testCandidate.firstName)
            .field('lastName', testCandidate.lastName)
            .field('email', testCandidate.email)
            .field('phone', testCandidate.phone)
            .field('address', testCandidate.address)
            .field('education', testCandidate.education)
            .field('experience', testCandidate.experience)
            .attach('cv', path.join(__dirname, 'test-files/test-cv.pdf'));

        expect(res.statusCode).toEqual(201);
        expect(res.body.success).toBeTruthy();
        expect(res.body.data).toHaveProperty('id');
        expect(res.body.data.firstName).toEqual(testCandidate.firstName);
        expect(res.body.data.email).toEqual(testCandidate.email);
        expect(res.body.data).toHaveProperty('education');
        expect(res.body.data).toHaveProperty('experience');
    });

    // Test para validación de datos incorrectos
    it('should fail with invalid data', async () => {
        const res = await request(app)
            .post('/api/candidates')
            .field('firstName', '')  // Campo requerido vacío
            .field('lastName', testCandidate.lastName)
            .field('email', 'invalid-email') // Email inválido
            .field('phone', testCandidate.phone)
            .field('address', testCandidate.address)
            .field('education', testCandidate.education)
            .field('experience', testCandidate.experience);

        expect(res.statusCode).toEqual(400);
        expect(res.body.success).toBeFalsy();
        expect(res.body).toHaveProperty('errors');
    });

    // Test para obtener todos los candidatos
    it('should get all candidates', async () => {
        const res = await request(app).get('/api/candidates');

        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBeTruthy();
        expect(Array.isArray(res.body.data)).toBeTruthy();
    });

    // Test para obtener un candidato por ID
    it('should get a candidate by id', async () => {
        // Primero crear un candidato para obtener su ID
        const createRes = await request(app)
            .post('/api/candidates')
            .field('firstName', 'Jane')
            .field('lastName', 'Smith')
            .field('email', 'jane.smith@example.com')
            .field('phone', '+987654321')
            .field('address', '456 Test Avenue')
            .field('education', testCandidate.education)
            .field('experience', testCandidate.experience);

        const candidateId = createRes.body.data.id;

        const res = await request(app).get(`/api/candidates/${candidateId}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBeTruthy();
        expect(res.body.data).toHaveProperty('id');
        expect(res.body.data.id).toEqual(candidateId);
        expect(res.body.data.firstName).toEqual('Jane');
    });

    // Test para actualizar un candidato
    it('should update a candidate', async () => {
        // Primero crear un candidato para obtener su ID
        const createRes = await request(app)
            .post('/api/candidates')
            .field('firstName', 'Robert')
            .field('lastName', 'Johnson')
            .field('email', 'robert.johnson@example.com')
            .field('phone', '+555666777')
            .field('address', '789 Test Blvd')
            .field('education', testCandidate.education)
            .field('experience', testCandidate.experience);

        const candidateId = createRes.body.data.id;

        // Luego actualizar el candidato
        const res = await request(app)
            .put(`/api/candidates/${candidateId}`)
            .field('firstName', 'Robert Updated')
            .field('lastName', 'Johnson')
            .field('email', 'robert.johnson@example.com')
            .field('phone', '+555666777')
            .field('address', 'Updated address');

        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBeTruthy();
        expect(res.body.data.firstName).toEqual('Robert Updated');
        expect(res.body.data.address).toEqual('Updated address');
    });

    // Test para eliminar un candidato
    it('should delete a candidate', async () => {
        // Primero crear un candidato para obtener su ID
        const createRes = await request(app)
            .post('/api/candidates')
            .field('firstName', 'Delete')
            .field('lastName', 'User')
            .field('email', 'delete.user@example.com')
            .field('phone', '+111222333')
            .field('address', 'Delete Address')
            .field('education', testCandidate.education)
            .field('experience', testCandidate.experience);

        const candidateId = createRes.body.data.id;

        // Luego eliminar el candidato
        const res = await request(app).delete(`/api/candidates/${candidateId}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBeTruthy();
        expect(res.body.message).toContain('eliminado');

        // Verificar que el candidato ya no existe
        const checkRes = await request(app).get(`/api/candidates/${candidateId}`);
        expect(checkRes.statusCode).toEqual(404);
    });
});
