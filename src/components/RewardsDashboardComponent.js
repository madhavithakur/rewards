import React, { useContext, useEffect } from "react";
import { fetchTransactionData } from "../shared/api.mock";
import { StoreContext } from "../store";
import { addContent, dataLoading } from "../store/action";
import { Loading } from "./LoadingComponent";


const RewardsDashboard = () => {
    const [globalState, dispatch] = useContext(StoreContext);
    const {transactionsData, isLoading}  = globalState;
    const repeatedNames = new Set();

    useEffect(()=>{
        const loadContent = async () => {
            dispatch(dataLoading());
            const transactionData = await fetchTransactionData();
            dispatch(addContent(transactionData));
        };
        loadContent();
    },[dispatch]);

    
    return isLoading ?
        <Loading /> : (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-10">
                        <h2>Reward Points for Customers by Month</h2>
                    </div>
                </div>
                <div className="row">
                    <div className="col-8">
                        <table>
                            <tr>
                                <th>Customer Name</th>
                                <th>Month</th>
                                <th>Transactions count</th>
                                <th>Reward Points</th>
                            </tr>
                            {transactionsData.customerMonthlyData.map((val) => {
                                return (
                                    <tr key={val.custId}>
                                        <td>{repeatedNames.has(val.name)?"":repeatedNames.add(val.name) && val.name}</td>
                                        <td>{val.month}</td>
                                        <td>{val.numTransactions}</td>
                                        <td>{val.rewardPoints}</td>
                                    </tr>
                                )
                            })}
                        </table>             
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="row">
                    <div className="col-10">
                        <h2>Total Rewards for Customers</h2>
                    </div>
                </div>
                <div className="row">
                    <div className="col-8">
                        <table>
                            <tr>
                                <th>Customer Name</th>
                                <th>Total Reward Points</th>
                            </tr>
                            {transactionsData.totalPointsCustomerData.map((val, key) => {
                                return (
                                    <tr key={key}>
                                        <td>{val.name}</td>
                                        <td>{val.rewardPoints}</td>
                                    </tr>
                                )
                            })}
                        </table>             
                    </div>
                </div>
            </div>
        </>
      )
}

export default RewardsDashboard;