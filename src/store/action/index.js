import * as ActionType from '../actionType';

export const addContent = (transactionData) => ({
    type: ActionType.LOAD_DATA,
    transactionData
});

export const dataLoading = () => ({
    type: ActionType.DATA_LOADING
});