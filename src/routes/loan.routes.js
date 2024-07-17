const Router = require("express");
const router = new Router();
const loanController = require("../controllers/loan.controller")

router.post('/loan', loanController.createLoan);
router.get('/loan', loanController.getLoanByClient)
router.delete('/loan/:id', loanController.deleteLoan);

module.exports = router;