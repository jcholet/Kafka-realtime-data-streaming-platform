import { TiLocationArrowOutline } from "react-icons/ti";
import { LuSunrise } from "react-icons/lu";
import { LuSunset } from "react-icons/lu";
import { GoSun } from "react-icons/go";
import BuildingSun from '../assets/building_sun.png';
import './leftPart.css';
import BuildingNight from '../assets/building_night.png';

function LeftPart() {
  return (
    <div className="left-part">
      <div className="sun-grid">
        {/* First row */}
        <div className="location">
          <TiLocationArrowOutline color="white" />
          <div>Laval, 53000 France</div>
        </div>
        <div className="sunrise">
          <LuSunrise color="white" />
          <div>07:00</div>
        </div>

        {/* Second row */}
        <div className="date">
          <div>Today, Sept. 30</div>
        </div>
        <div className="sunset">
          <LuSunset color="white" />
          <div>21:00</div>
        </div>
      </div>
      <div className="temperature">
        <div>25°</div>
      </div>
      <div className="weather">
        <GoSun color="white" />
        <div>Sunny</div>
      </div>
      <img src={BuildingNight} alt="Building and sun" className="background-image" /> 
    </div>
  );
}

export default LeftPart;
