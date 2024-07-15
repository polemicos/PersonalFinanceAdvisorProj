const db = require('../db');


class ClientController{
    async createClient(req, res) {
        const { username, password, salary, preferred_currency_id } = req.body; 
        try {
            const newClient = await db.query(`
                INSERT INTO Client (username, password, salary, preferred_currency_id) 
                values (${username}, ${password}, ${salary}, ${preferred_currency_id}) RETURNING *`);
            res.json(newClient.rows[0]); 
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server error");
        }
    }

    async getClients(req, res){
        const clients = await db.query('SELECT * FROM client');
        res.json(clients.rows);
    }

    async getClient(req, res){
        const id = req.params.id;
        const client = await db.query(`SELECT * FROM client where client_id =${id}`);
        res.json(client.rows[0]);
    }

    async updateClient(req, res){
        const {id, username} = req.body;
        const client = await db.query(`UPDATE client set username = ${username} where client_id = ${id}
            RETURNING *`);
        res.json(client.rows[0]);
    }

    async deleteClient(req, res){

    }
}

module.exports = new ClientController();