import * as ActionType from '../actionType';

export const INITIAL_STATE = {
    transactionsData : null,
    isLoading: true
  }

  export const reducer = (state, action) => {
    switch(action.type) {
        case ActionType.LOAD_DATA:
            return {...state, transactionsData: action.transactionData, isLoading: false}
        case ActionType.DATA_LOADING:
            return {...state, transactionData: null, isLoading: true}
        default:
            return state;
    }
  }