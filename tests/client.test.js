const request = require('supertest');
const app = require('../src/app');
const db = require('../src/db');

describe('ClientController', () => {
    let testClientId;

    beforeAll(async () => {
        await db.connect();
    });

    // afterAll(async () => {
    //     await db.end();
    // });

    beforeEach(async () => {
        await db.query('DELETE FROM client');
        const clientResult = await db.query(
            `INSERT INTO client (username, password, salary, preferred_currency_id) 
             VALUES ('testuser_${Date.now()}', 'password', 50000, 1) RETURNING client_id`
        );
        testClientId = clientResult.rows[0].client_id;
    });

    describe('POST /client', () => {
        it('should create a new client and return 201 status', async () => {
            const clientData = {
                username: 'newuser',
                password: 'newpassword',
                salary: 60000,
                preferred_currency_id: 2
            };

            const response = await request(app)
                .post('/api/client')
                .send(clientData);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('client_id');
            expect(response.body).toMatchObject({
                username: clientData.username,
                salary: clientData.salary.toString() + ".00",
                preferred_currency_id: clientData.preferred_currency_id
            });
        });

        it('should return 500 if there is a server error', async () => {
            const response = await request(app)
                .post('/api/client')
                .send({});

            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty('error', 'Server error');
        });
    });

    describe('GET /client', () => {
        it('should fetch all clients and return 200 status', async () => {
            const response = await request(app)
                .get('/api/client');

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
        });

        it('should return 500 if there is a server error', async () => {
            jest.spyOn(db, 'query').mockImplementation(() => {
                throw new Error('Database connection error');
            });

            const response = await request(app)
                .get('/api/client');

            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty('error', 'Server error');
            db.query.mockRestore();
        });
    });

    describe('GET /client/:id', () => {
        it('should fetch a client by ID and return 200 status', async () => {
            const response = await request(app)
                .get(`/api/client/${testClientId}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('client_id', testClientId);
        });

        it('should return 404 if the client does not exist', async () => {
            const nonExistentClientId = 999999; // Use a clearly invalid ID

            const response = await request(app)
                .get(`/api/client/${nonExistentClientId}`);

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('error', 'Client not found');
        });

        it('should return 500 if there is a server error', async () => {
            jest.spyOn(db, 'query').mockImplementation(() => {
                throw new Error('Database connection error');
            });

            const response = await request(app)
                .get(`/api/client/${testClientId}`);

            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty('error', 'Server error');
            db.query.mockRestore();
        });
    });

    describe('PUT /client', () => {
        it('should update a client and return 200 status', async () => {
            const updateData = {
                id: testClientId,
                username: 'updateduser'
            };

            const response = await request(app)
                .put('/api/client')
                .send(updateData);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('client_id', testClientId);
            expect(response.body).toHaveProperty('username', updateData.username);
        });

        it('should return 404 if the client does not exist', async () => {
            const updateData = {
                id: 999999, // Use a clearly invalid ID
                username: 'nonexistentuser'
            };

            const response = await request(app)
                .put('/api/client')
                .send(updateData);

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('error', 'Client not found');
        });

        it('should return 500 if there is a server error', async () => {
            const updateData = {
                id: testClientId,
                username: `updateuser_${Date.now()}`
            };

            jest.spyOn(db, 'query').mockImplementation(() => {
                throw new Error('Database connection error');
            });

            const response = await request(app)
                .put('/api/client')
                .send(updateData);

            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty('error', 'Server error');
            db.query.mockRestore();
        });
    });

    describe('DELETE /client/:id', () => {
        it('should delete a client and return 204 status', async () => {
            const response = await request(app)
                .delete(`/api/client/${testClientId}`);

            expect(response.status).toBe(204);
        });

        it('should return 404 if the client does not exist', async () => {
            const nonExistentClientId = 999999; // Use a clearly invalid ID

            const response = await request(app)
                .delete(`/api/client/${nonExistentClientId}`);

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('error', 'Client not found');
        });

        it('should return 500 if there is a server error', async () => {
            jest.spyOn(db, 'query').mockImplementation(() => {
                throw new Error('Database connection error');
            });

            const response = await request(app)
                .delete(`/api/client/${testClientId}`);

            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty('error', 'Server error');
            db.query.mockRestore();
        });
    });
});
