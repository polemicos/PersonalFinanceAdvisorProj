const db = require('../db');

class ClientController {
    async createClient(req, res) {
        const { username, password, salary, preferred_currency_id } = req.body;
        try {
            const newClient = await db.query(
                `INSERT INTO client (username, password, salary, preferred_currency_id) 
                 VALUES ($1, $2, $3, $4) RETURNING *;`,
                [username, password, salary, preferred_currency_id]
            );
            res.json(newClient.rows[0]);
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ error: "Server error" });
        }
    }

    async getClients(req, res) {
        try {
            const clients = await db.query('SELECT * FROM client');
            res.json(clients.rows);
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Server error' });
        }
    }

    async getClient(req, res) {
        const id = req.params.id;
        try {
            const client = await db.query(`SELECT * FROM client WHERE client_id = $1`, [id]);
            if (client.rows.length > 0) {
                res.json(client.rows[0]);
            } else {
                res.status(404).json({ error: 'Client not found' });
            }
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Server error' });
        }
    }

    async getClientByUsername(username, res) {
        try {
            const client = await db.query(`SELECT * FROM client WHERE username = $1`, [username]);
            res.json(client.rows[0]);
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ error: "Error fetching client" });
        }
    }

    async updateClient(req, res) {
        const { id, username } = req.body;
        try {
            const client = await db.query(
                `UPDATE client SET username = $1 WHERE client_id = $2 RETURNING *`,
                [username, id]
            );
            if (client.rows.length > 0) {
                res.json(client.rows[0]);
            } else {
                res.status(404).json({ error: 'Client not found' });
            }
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Server error' });
        }
    }

    async deleteClient(req, res) {
        const id = req.params.id;
        try {
            const client = await db.query(`DELETE FROM client WHERE client_id = $1 RETURNING *`, [id]);
            if (client.rows.length > 0) {
                res.json(client.rows[0]);
            } else {
                res.status(404).json({ error: 'Client not found' });
            }
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Server error' });
        }
    }
}

module.exports = new ClientController();
