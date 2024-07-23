const db = require('../db');


class CurrencyController{
    async createCurrency(req, res) {
        const { currency_code, currency_name} = req.body; 
        try {
            const newClient = await db.query(`
                INSERT INTO loan (currency_code, currency_name) 
                values ('${currency_code}, ${currency_name}}) RETURNING *;`);
            res.json(newClient.rows[0]); 
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server error");
        }
    }

    async getCurrencyList(req, res) {
        try {
            const result = await db.query('SELECT currency_id, currency_code FROM Currency');
            const currencyList = result.rows.reduce((acc, row) => {
                acc[row.currency_id] = row.currency_code;
                return acc;
            }, {});
            //res.json(currencyList);
            return currencyList;
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Server error' });
            return null;
        }
    }
    

    async deleteLoan(req, res){
        const id = req.params.id;
        const client = await db.query(`DELETE FROM loan where loan_id =${id}`);
        res.json(client.rows[0]);
    }
}

module.exports = new CurrencyController();