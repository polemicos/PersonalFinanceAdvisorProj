const Router = require("express");
const router = new Router();
const clientController = require("../controllers/client.controller")

router.post('/client', clientController.createClient);
router.get('/client/:id', clientController.getClient);
router.get('/client', clientController.getClients);
router.put('/client', clientController.updateClient);
router.post('/client/:id', clientController.deleteClient);

module.exports = router;