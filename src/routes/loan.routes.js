const Router = require("express");
const router = new Router();
const loanController = require("../controllers/loan.controller")

router.post('/loan', loanController.createLoan);
router.get('/loan/:client_id', loanController.getLoanByClient)
router.delete('/loan/:id', loanController.deleteLoan);

module.exports = router;