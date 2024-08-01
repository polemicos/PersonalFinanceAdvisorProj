const { cookieJwtAuth } = require("../middleware/cookieJwtAuth");
const loanController = require("../controllers/loan.controller");
const db = require('../db'); 

module.exports = (app) =>
  app.post("/createNewLoan", cookieJwtAuth, async (req, res) => {
    console.log(req.user);
    const user = req.user.payload.username;
    const client_id = req.user.payload.client_id;
    const { desired_interest_rate, repayment_plan } = req.body;

    try {
        // Fetch the client's salary based on the client_id
        const clientResult = await db.query(`SELECT salary FROM client WHERE client_id = ${client_id}`);
        if (clientResult.rows.length === 0) {
            return res.status(404).send("Client not found");
        }

        const salary = clientResult.rows[0].salary;

        // Perform calculations based on the desired interest rate and salary
        const max_loan_amount = calculateMaxLoanAmount(salary, desired_interest_rate);
        const total_interest_paid = calculateTotalInterestPaid(max_loan_amount, desired_interest_rate, parseInt(repayment_plan));

        // Set the calculated values in req.body
        req.body.max_loan_amount = max_loan_amount;
        req.body.total_interest_paid = total_interest_paid;
        req.body.client_id = client_id;

        // Save the loan details in the database
        const newLoan = await loanController.createLoan(req, res);
        console.log(newLoan);
        // Render the view with the loan details
        return res.redirect('show', { 
            user: user });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

function calculateMaxLoanAmount(salary, desired_interest_rate) {
    return salary * desired_interest_rate + salary; 
}

function calculateTotalInterestPaid(max_loan_amount, desired_interest_rate, repayment_plan) {
    return max_loan_amount * (desired_interest_rate / 100) * repayment_plan / 12;
}