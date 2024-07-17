const db = require('../db');


class ClientController{
    async createClient(req, res) {
        const { username, password, salary, preferred_currency_id } = req.body; 
        try {
            const newClient = await db.query(`
                INSERT INTO client (username, password, salary, preferred_currency_id) 
                values ('${username}', '${password}', ${salary}, ${preferred_currency_id}) RETURNING *;`);
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

    async getClient(req, res) {
        const id = req.params.id;
        try {
            const client = await db.query(`SELECT * FROM client WHERE client_id = ${id}`);
            if (client.rows.length > 0) {
                const clientData = client.rows[0];
                res.json(clientData);
                return clientData;
            } else {
                res.status(404).json({ error: 'Client not found' });
                return null;
            }
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Server error' });
            return null;
        }
    }

    async getClientByUsername(username) {
        try {
            const client = await db.query(`SELECT username, password FROM client WHERE username = '${username}'`);
            if (client.rows.length > 0) {
                return client.rows[0];
            } else {
                return null;
            }
        } catch (err) {
            console.error(err.message);
            throw new Error('Server error');
        }
    }
    

    async updateClient(req, res){
        const {id, username} = req.body;
        const client = await db.query(`UPDATE client SET username = '${username}' WHERE client_id = ${id} RETURNING *`);
        res.json(client.rows[0]);
    }

    async deleteClient(req, res){
        const id = req.params.id;
        const client = await db.query(`DELETE FROM client where client_id =${id}`);
        res.json(client.rows[0]);
    }
}

module.exports = new ClientController();