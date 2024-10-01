import './App.css';
import LeftPart from './components/leftPart';
import RightPart from './components/rightPart';

function App() {
  return (
    <div className="App">
      <div className="grid-container">
        <LeftPart />
        <RightPart />
      </div>
    </div>
  );
}

export default App;