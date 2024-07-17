const db = require('../db');


class LoanController{
    async createLoan(req, res) {
        const { client_id, desired_interest_rate, max_loan_amount, repayment_plan, total_interest_paid} = req.body; 
        try {
            const newClient = await db.query(`
                INSERT INTO loan (client_id, desired_interest_rate, max_loan_amount, repayment_plan, total_interest_paid) 
                values ('${client_id}', '${desired_interest_rate}', ${max_loan_amount}, ${repayment_plan}, ${total_interest_paid}) RETURNING *;`);
            res.json(newClient.rows[0]); 
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server error");
        }
    }

    async getLoanByClient(req, res){
        const id = req.query.id;
        const loans = await db.query(`select * from loan where client_id = ${id}`);
    }

    async deleteLoan(req, res){
        const id = req.params.id;
        const client = await db.query(`DELETE FROM loan where loan_id =${id}`);
        res.json(client.rows[0]);
    }
}

module.exports = new LoanController();