import { useReducer } from 'react';
import './App.css';
import RewardsDashboard from './components/RewardsDashboardComponent';
import { StoreContext } from './store';
import { INITIAL_STATE, reducer } from './store/reducer';


function App() {

  const [globalState, dispatch] = useReducer(reducer, INITIAL_STATE)
  return (
    <div className="App">
      <StoreContext.Provider value={[globalState, dispatch]}>
        <RewardsDashboard />
      </StoreContext.Provider>
    </div>
  );
}

export default App;
