const { cookieJwtAuth } = require("../middleware/cookieJwtAuth");
const loanController = require("../controllers/loan.controller");
const db = require('../db');

const createLoan = async (req) => {
    return new Promise((resolve, reject) => {
        loanController.createLoan(req, {
            status: (code) => ({
                json: (data) => {
                    if (code >= 200 && code < 300) {
                        resolve(data);
                    } else {
                        reject(data);
                    }
                }
            })
        });
    });
};

module.exports = (app) =>
  app.post("/createNewLoan", cookieJwtAuth, async (req, res) => {
    const client_id = req.user.payload.client_id;
    const { desired_interest_rate, repayment_plan } = req.body;

    try {
        const clientResult = await db.query(`SELECT salary FROM client WHERE client_id = $1`, [client_id]);
        if (clientResult.rows.length === 0) {
            return res.status(404).send("Client not found");
        }

        const salary = parseFloat(clientResult.rows[0].salary);
        const interestRate = parseFloat(desired_interest_rate); 
        const repaymentPlan = parseInt(repayment_plan, 10);

        const max_loan_amount = calculateMaxLoanAmount(salary, interestRate);
        const total_interest_paid = calculateTotalInterestPaid(max_loan_amount, interestRate, repaymentPlan);

        const maxLoanAmountFormatted = parseFloat(max_loan_amount.toFixed(1));
        const totalInterestPaidFormatted = parseFloat(total_interest_paid.toFixed(1));

        console.log(`Formatted Max Loan Amount: ${maxLoanAmountFormatted}`);
        console.log(`Formatted Total Interest Paid: ${totalInterestPaidFormatted}`);

        req.body.max_loan_amount = maxLoanAmountFormatted;
        req.body.total_interest_paid = totalInterestPaidFormatted;
        req.body.client_id = client_id;

        const newLoan = await createLoan(req);
        console.log("New Loan Created:", newLoan);

        return res.redirect('/homepage');
    } catch (err) {
        console.error("Error during loan creation:", err.message);
        return res.status(500).send("Server error");
    }
});

function calculateMaxLoanAmount(salary, desired_interest_rate) {
    const amount = salary + (salary * (desired_interest_rate / 100));
    return amount;
}

function calculateTotalInterestPaid(max_loan_amount, desired_interest_rate, repayment_plan) {
    const total = max_loan_amount * (desired_interest_rate / 100) * repayment_plan / 12;
    return total;
}
