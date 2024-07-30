const res = require('express/lib/response');
const db = require('../db');


class LoanController{
    async createLoan(req, res) {
        const { client_id, desired_interest_rate, max_loan_amount, repayment_plan, total_interest_paid} = req.body; 
        try {
            const newLoan = await db.query(`
                INSERT INTO loan (client_id, desired_interest_rate, max_loan_amount, repayment_plan, total_interest_paid) 
                values ('${client_id}', '${desired_interest_rate}', ${max_loan_amount}, ${repayment_plan}, ${total_interest_paid}) RETURNING *;`);
            res.json(newLoan.rows[0]); 
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server error");
        }
    }


    async getLoanByClient(client_id) {
        try {
            const loanResult = await db.query(`SELECT * FROM loan WHERE client_id = $1`, [client_id]);
            const loans = loanResult.rows.reduce((acc, loan) => {
                acc[loan.id] = loan;
                return acc;
            }, {});
            return loans;
        } catch (err) {
            console.error(err.message);
            throw new Error("Error fetching loans");
        }
    }
    

    async deleteLoan(req, res){
        const id = req.params.id;
        const client = await db.query(`DELETE FROM loan where loan_id =${id}`);
        res.json(client.rows[0]);
    }
}

module.exports = new LoanController();