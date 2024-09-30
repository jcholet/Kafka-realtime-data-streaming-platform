import { TiLocationArrowOutline } from "react-icons/ti";
import { LuSunrise } from "react-icons/lu";
import { LuSunset } from "react-icons/lu";
import { GoSun } from "react-icons/go";
import BuildingSun from '../assets/building_sun.png';
import './leftPart.css';

function LeftPart() {
  return (
    <div className="left-part">
      <div className="sun-grid">
        {/* Première ligne */}
        <div className="location">
          <TiLocationArrowOutline color="white" />
          <div>Laval, 53000 France</div>
        </div>
        <div className="sunrise">
          <LuSunrise color="white" />
          <div>07:00</div>
        </div>

        {/* Deuxième ligne */}
        <div className="date">
          <div>Aujourd'hui 30 sept.</div>
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
        <div>Ensoleillé</div>
      </div>
      <img src={BuildingSun} alt="Building and sun" className="background-image" /> 
    </div>
  );
}

export default LeftPart;