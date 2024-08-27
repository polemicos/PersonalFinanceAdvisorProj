const request = require('supertest');
const app = require('../app'); 
const db = require('../db');

describe('GET /loan/:client_id', () => {
    // Cleanup after each test
    afterEach(async () => {
        await db.query('DELETE FROM loan WHERE client_id = $1', [testClientId]);
    });

    let testClientId;
    let testLoanId;
    // Add a test loan to the database before each test
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
            .get(`/api/loan/${testClientId+1}`) // Assuming 9999 is an invalid client_id
            .expect(404);

        expect(response.body).toEqual({ error: 'No loans found for the provided client ID' });
    });

    it('should return 500 if there is a server error', async () => {
        // Temporarily break the DB connection to simulate a server error
        jest.spyOn(db, 'query').mockImplementation(() => {
            throw new Error('Database connection error');
        });

        const response = await request(app)
            .get(`/api/loan/${testClientId}`)
            .expect(500);

        expect(response.body).toEqual({ error: 'Error fetching loans' });

        // Restore the original implementation
        db.query.mockRestore();
    });
});
