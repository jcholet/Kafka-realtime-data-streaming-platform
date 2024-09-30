import './rightPart.css';
import WeatherChart from './weatherChart';


function RightPart() {
  return (
    <div className="right-part">
      <div className="welcome-title"> Welcome back !</div>
      <div className='welcome-sub'>
        Check out today's weather information
      </div>
      <WeatherChart />
    </div>
  );
}

export default RightPart;
