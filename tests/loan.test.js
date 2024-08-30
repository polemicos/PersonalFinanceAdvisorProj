const request = require('supertest');
const app = require('../src/app');
const db = require('../src/db');
const setupDatabase = require('../src/setupDB');

setupDatabase();

describe('LoanController', () => {
    beforeAll(async () => {
        await db.connect();
    });

    // afterAll(async () => {
    //     await db.end();
    // });

    describe('GET /loan/:client_id', () => {
        let testClientId;
        let testLoanId;

        beforeEach(async () => {
            const clientResult = await db.query(
                `INSERT INTO client (username, password, salary, preferred_currency_id) 
                VALUES ('testuser_${Date.now()}', 'password', 50000, 1) RETURNING client_id`
            );
            testClientId = clientResult.rows[0].client_id;

            const loanRes = await db.query(
                `INSERT INTO loan (client_id, desired_interest_rate, max_loan_amount, repayment_plan, total_interest_paid) 
                 VALUES ($1, $2, $3, $4, $5) RETURNING loan_id`,
                [testClientId, 10, 10, 12, 10]
            );
            testLoanId = loanRes.rows[0].loan_id;
        });

        // Clean up the loan after each test
        afterEach(async () => {
            await db.query('DELETE FROM loan WHERE client_id = $1', [testClientId]);
        });

        it('should return 200 and the loan details for a valid client ID', async () => {
            const response = await request(app)
                .get(`/api/loan/${testClientId}`)
                .expect(200);

            expect(response.body).toHaveProperty(testLoanId.toString());
            expect(response.body[testLoanId.toString()]).toMatchObject({
                client_id: testClientId,
                desired_interest_rate: "10.00",
                max_loan_amount: "10.00",
                repayment_plan: 12,
                total_interest_paid: "10.00"
            });
        });

        it('should return 404 if no loans are found for the client ID', async () => {
            const response = await request(app)
                .get(`/api/loan/${testClientId + 1}`) // Assuming this ID does not exist
                .expect(404);

            expect(response.body).toEqual({ error: 'No loans found for the provided client ID' });
        });

        it('should return 500 if there is a server error', async () => {
            jest.spyOn(db, 'query').mockImplementation(() => {
                throw new Error('Database connection error');
            });

            const response = await request(app)
                .get(`/api/loan/${testClientId}`)
                .expect(500);

            expect(response.body).toEqual({ error: 'Error fetching loans' });

            db.query.mockRestore();
        });
    });

    describe('POST /loan', () => {
        let testClientId;

        beforeEach(async () => {
            const clientResult = await db.query(
                `INSERT INTO client (username, password, salary, preferred_currency_id) 
                VALUES ('testuser_${Date.now()}', 'password', 50000, 1) RETURNING client_id`
            );
            testClientId = clientResult.rows[0].client_id;
        });

        it('should create a new loan and return 201 status', async () => {
            const loanData = {
                client_id: testClientId,
                desired_interest_rate: 5,
                max_loan_amount: 5000,
                repayment_plan: 12,
                total_interest_paid: 300,
            };

            const response = await request(app)
                .post('/api/loan') // Ensure this matches your route definition
                .send(loanData)
                .expect(201);

            expect(response.body).toHaveProperty('loan_id');
            expect(response.body).toMatchObject({
                client_id: testClientId,
                desired_interest_rate: loanData.desired_interest_rate.toString() + ".00",
                max_loan_amount: loanData.max_loan_amount.toString() + ".00",
                repayment_plan: loanData.repayment_plan,
                total_interest_paid: loanData.total_interest_paid.toString() + ".00",
            });
        });

        it('should return 500 if there is a server error', async () => {
            const response = await request(app)
                .post('/api/loan')
                .send({})
                .expect(500);

            expect(response.body).toHaveProperty('error', 'Server error');
        });
    });

    describe('DELETE /loan/:id', () => {
        let testClientId;
        let testLoanId;

        beforeEach(async () => {
            const clientResult = await db.query(
                `INSERT INTO client (username, password, salary, preferred_currency_id) 
                VALUES ('testuser_${Date.now()}', 'password', 50000, 1) RETURNING client_id`
            );
            testClientId = clientResult.rows[0].client_id;

            const loanRes = await db.query(
                `INSERT INTO loan (client_id, desired_interest_rate, max_loan_amount, repayment_plan, total_interest_paid) 
                VALUES ($1, $2, $3, $4, $5) RETURNING loan_id;`,
                [testClientId, 5, 5000, 12, 300]
            );

            testLoanId = loanRes.rows[0].loan_id;
        });

        it('should delete a loan and return 204 status', async () => {
            const response = await request(app)
                .delete(`/api/loan/${testLoanId}`)
                .expect(204);

            expect(response.body).toEqual({});
        });

        it('should return 404 if the loan does not exist', async () => {
            const nonExistentLoanId = testLoanId + 1; // Assuming this ID does not exist

            const response = await request(app)
                .delete(`/api/loan/${nonExistentLoanId}`)
                .expect(404);

            expect(response.body).toHaveProperty('error', 'Loan not found');
        });

        it('should return 500 if there is a server error', async () => {
            const response = await request(app)
                .delete('/api/loan/invalid-id')
                .expect(500);

            expect(response.body).toHaveProperty('error', 'Server error');
        });
    });
});
