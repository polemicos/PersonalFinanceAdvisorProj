const db = require('../db');

class LoanController {
    async createLoan(req, res) {
        const { client_id, desired_interest_rate, max_loan_amount, repayment_plan, total_interest_paid } = req.body;
        
        try {
            const query = `
                INSERT INTO loan (client_id, desired_interest_rate, max_loan_amount, repayment_plan, total_interest_paid) 
                VALUES ($1, $2, $3, $4, $5) RETURNING *;
            `;
            
            const values = [client_id, desired_interest_rate, max_loan_amount, repayment_plan, total_interest_paid];
            
            const newLoan = await db.query(query, values);
            res.json(newLoan.rows[0]);
        } catch (err) {
            console.error("Error during loan creation:", err.message);
            res.status(500).json({ error: "Server error" });
        }
    }

    async getLoanByClient(req, res) {
        const client_id = req.params.client_id || req.body.client_id;
        try {
            const loanResult = await db.query(`SELECT * FROM loan WHERE client_id = $1`, [client_id]);
            const loans = loanResult.rows.reduce((acc, loan) => {
                acc[loan.loan_id] = loan;
                return acc;
            }, {});
            res.json(loans);
        } catch (err) {
            console.error("Error fetching loans:", err.message);
            res.status(500).json({ error: "Error fetching loans" });
        }
    }

    async deleteLoan(req, res) {
        const id = req.params.id;
        try {
            const client = await db.query(`DELETE FROM loan WHERE loan_id = $1 RETURNING *`, [id]);
            if (client.rows.length > 0) {
                res.json(client.rows[0]);
            } else {
                res.status(404).json({ error: 'Loan not found' });
            }
        } catch (err) {
            console.error("Error during loan deletion:", err.message);
            res.status(500).json({ error: "Server error" });
        }
    }
}

module.exports = new LoanController();
