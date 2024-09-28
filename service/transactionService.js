const Transaction = require('../model/transactionModel');
const Payer = require('../model/payerModel');
const mongoose = require('mongoose');

async function addPoints(req){
    try{
        const {payer, points, timestamp} = req.body;

        await Transaction.create({
            payer,
            points,
            timestamp,
        });

        const payerObject = await Payer.findOneAndUpdate({payer}, {
            $inc: {points}
        });
        if (!payerObject){
            await Payer.create({
                payer,
                points,
            })
        }
    }
    catch(error){
        throw new Error(error);
    }
    
}

async function sortTransactionByTimestamp(){
    const transactions = await Transaction.find().sort({ timestamp: 1 });    
    return transactions;
}

async function bulkUpdatePoints(transactions){
    try{        
        for (const transaction of transactions){
            await Payer.findOneAndUpdate({payer: transaction["payer"]}, {
                $inc: { points: transaction["points"] },
            })
        }
    }
    catch(error){
        throw new Error(error);
        
    }
}

async function spendPoints(points){
    try{
        
        const transactions = await sortTransactionByTimestamp();
        if (!transactions){
            return [];
        }        

        let currentPoint = points;
        let payload = {};

        for (const transaction of transactions){
            
            let subtractedPoint;
            subtractedPoint = -1 * Math.min(currentPoint, transaction.points);
            
            currentPoint += subtractedPoint;
            if (!payload[transaction.payer]){
                payload[transaction.payer] = subtractedPoint;
            }
            else{
                payload[transaction.payer] += subtractedPoint;
            }

            if (currentPoint <= 0){
                break;
            }
        }
        
        let spendList = [];
        if (currentPoint > 0){
            return spendList;
        }        
        
        for (const element in payload){
            await Payer.findOneAndUpdate({payer: element}, {
                $inc: { points: payload[element] },
            })
            spendList.push({"payer": element, "points":payload[element]});
        }        
        return spendList;
    }
    catch(error){        
    }
}

async function getBalance(){
    const payers = await Payer.find();
    let result = {};
    
    for (const payer of payers){        
        result[payer.payer] = payer.points;
    }
    return result;    
}



module.exports = {addPoints, spendPoints, getBalance};
