const express = require ('express');
const config = require('./config/config');
const dbConnection = require('./config/db');
const transactionService = require('./service/transactionService');

const app = express();
const port = config.port;

app.use(express.json());
dbConnection();
var path = require('path');
app.use(express.static(path.join(__dirname, '../public')));


app.post('/add', async (req, res) => {
    try{
        await transactionService.addPoints(req);
        res.status(200).send();
    }
    catch(error){        
        return res.status(500).send("Add failed");
    }
})

// SPEND POINTS
app.post('/spend', async (req, res) => {
    try{
        const {points} = req.body;
        const payload = await transactionService.spendPoints(points);
        if (payload.length === 0){
            return res.status(400).send("User does not have enough points")
        }
        return res.status(200).send(payload);
    }
    catch(error){
        return res.status(500).send("Spend failed");
    }
})

// GET BALANCE
app.get('/balance', async(req, res) => {
    try {
        const transactions = await transactionService.getBalance();
        return res.status(200).send(transactions);
    }
    catch (error) {
        return res.status(500).send('Get balance failed');
    }
})


app.listen(port, () => {
    console.log(`listening on port ${port}`);
})
