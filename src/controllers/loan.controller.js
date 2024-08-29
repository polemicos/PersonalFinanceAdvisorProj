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
            res.status(201).json(newLoan.rows[0]);
        } catch (err) {
            console.error("Error during loan creation:", err.message);
            res.status(500).json({ error: "Server error" });
        }
    }

    async getLoanByClient(req, res) {
        const client_id = req.params.client_id || req.body.client_id;

        try {
            const loanResult = await db.query(`SELECT loan_id, client_id, desired_interest_rate, max_loan_amount, repayment_plan, total_interest_paid FROM loan WHERE client_id = $1`, [client_id]);

            if (loanResult.rows.length === 0) {
                return res.status(404).json({ error: "No loans found for the provided client ID" });
            }

            const loans = loanResult.rows.reduce((acc, loan) => {
                acc[loan.loan_id] = loan;
                return acc;
            }, {});

            return res.status(200).json(loans);
        } catch (err) {
            console.error("Error fetching loans:", err.message);
            return res.status(500).json({ error: "Error fetching loans" });
        }
    }


    async deleteLoan(req, res) {
        const id = req.params.id;
        try {
            const client = await db.query(`DELETE FROM loan WHERE loan_id = $1 RETURNING *`, [id]);
            if (client.rows.length > 0) {
                res.status(204).json(client.rows[0]);
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
