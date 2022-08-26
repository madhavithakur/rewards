import { baseUrl } from "./baseUrl"

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const fetchTransactionData = () => {
    return fetch(baseUrl + 'transactionsData')
        .then(response => {
            if(response.ok) {
                return response;
            } else {
                let error = new Error("Error " + response.status + " : " + response.statusText);
                error.response = response;
                throw error;
            }
        },
        error => {
            const errMess = new Error(error.message);
            throw errMess;
        })
        .then(response => response.json())
        .then(txnData => calculateUpdatedData(txnData))
        .catch(error=>error.message);
}

const calculateUpdatedData = (txnData) => {

    let [customerMonthlyData, totalPointsCustomerData, total, totcustomerMonthlyData] = [{},{},[],[]];

    const updatedTransactionsWithPoints = txnData.map(transaction=> {
        let rewardPoints = 0;
        const over100 = transaction.amount - 100;
        const month = new Date(transaction.transactionDate).getMonth();
        
        // A customer receives 2 rewardPoints for every dollar spent over $100 plus 1 point for every dollar between 50 and 100 in each transaction  
        if (over100 > 0) {    
        rewardPoints += (over100 * 2);
        rewardPoints += 50; 
        } else if (transaction.amount > 50) {
        rewardPoints += transaction.amount-50;      
        }
        return {...transaction, rewardPoints, month};
    });

    updatedTransactionsWithPoints.forEach(updatedTransactionWithPoints => {
        let {custId, name, month, rewardPoints} = updatedTransactionWithPoints;   
        if (!customerMonthlyData[custId]) {
            customerMonthlyData[custId] = [];      
        }    
        if (!totalPointsCustomerData[custId]) {
            totalPointsCustomerData[custId] = 0;
        }
        totalPointsCustomerData[custId] += rewardPoints;
        const existingCmd = customerMonthlyData[custId].filter(cmd => cmd.hasOwnProperty(month))[0];
        if (existingCmd) {
            existingCmd[month].rewardPoints += rewardPoints;
            existingCmd[month].numTransactions++;      
        } else {  
        customerMonthlyData[custId].push({[month]: {
            custId,
            name,
            month: MONTHS[month],
            numTransactions: 1,        
            rewardPoints
        }});
        }    
    });

    for (let custKey in customerMonthlyData) {    
        customerMonthlyData[custKey].forEach(cRow=> {
            total.push(Object.values(cRow)[0]);
        });    
    }

    for (let custKey in totalPointsCustomerData) {    
        totcustomerMonthlyData.push({
            custId: custKey,
            name: updatedTransactionsWithPoints.filter(txn=>txn.custId===+custKey)[0].name,
            rewardPoints: totalPointsCustomerData[custKey]
        });    
    }

    return {
        customerMonthlyData: total,
        totalPointsCustomerData: totcustomerMonthlyData
    };
}