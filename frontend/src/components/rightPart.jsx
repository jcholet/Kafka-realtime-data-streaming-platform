import './rightPart.css';
import WeatherGraph from './weatherGraph';
import ProgressBar from './progressBar';

function RightPart() {
    return (
        <div className="right-part">
            <div className="welcome-title"> Welcome back !</div>
            <div className='welcome-sub'>
                Check out today's weather information
            </div>
            <div className="graph-bg">
                <WeatherGraph />
            </div>

            {/* More details of today's weather */}
            <div className="weather-details-title">More details of today's weather</div>

            <div className="weather-details-container">
                {/* Humidity Card */}
                <div className="weather-card">
                    <div className="weather-card-title">Humidity</div>
                    <div className="weather-card-icon"></div>
                    <div className="weather-card-value">82% <span className="status bad">bad</span></div>
                    <div className="weather-card-scale">
                        <div>good</div>
                        <div>normal</div>
                        <div>bad</div>
                    </div>
                    <ProgressBar value="82" max="100"></ProgressBar>
                </div>

                {/* Wind Card */}
                <div className="weather-card">
                    <div className="weather-card-title">Wind</div>
                    <div className="weather-card-icon"></div>
                    <div className="weather-card-value">8 km/h</div>
                    <div className="weather-card-scale">
                        <div className="wind-speed-gauge"></div>
                    </div>
                </div>

                {/* Precipitation Card */}
                <div className="weather-card">
                    <div className="weather-card-title">Precipitation</div>
                    <div className="weather-card-icon"></div>
                    <div className="weather-card-value">1.4 cm</div>
                    <div className="weather-card-scale">
                        <div>0</div>
                        <div>10</div>
                        <div>20</div>
                        <div>30</div>
                        <div>40</div>
                        <div>50</div>
                        <div>60</div>
                        <div>70</div>
                        <div>80</div>
                        <div>90</div>
                    </div>
                    <ProgressBar value="14" max="90"></ProgressBar>
                </div>

                {/* UV Index Card */}
                <div className="weather-card">
                    <div className="weather-card-title">UV Index</div>
                    <div className="weather-card-icon"></div>
                    <div className="weather-card-value">4 <span className="status medium">medium</span></div>
                    <div className="weather-card-scale">
                        <div>0-2</div>
                        <div>3-5</div>
                        <div>6-7</div>
                        <div>8-10</div>
                        <div>11+</div>
                    </div>
                    <ProgressBar value="4" max="11"></ProgressBar>
                </div>

                {/* Feels Like Card */}
                <div className="weather-card">
                    <div className="weather-card-title">Feels Like</div>
                    <div className="weather-card-icon"></div>
                    <div className="weather-card-value">30°</div>
                    <div className="weather-card-scale">
                        <div>0°</div>
                        <div>25°</div>
                        <div>50°</div>
                    </div>
                    <ProgressBar value="30" max="50"></ProgressBar>
                </div>

                {/* Chance of Rain Card */}
                <div className="weather-card">
                    <div className="weather-card-title">Chance of Rain</div>
                    <div className="weather-card-icon"></div>
                    <div className="weather-card-value">42%</div>
                    <div className="weather-card-scale chance-of-rain">
                        <div>0%</div>
                        <div>25%</div>
                        <div>50%</div>
                        <div>75%</div>
                        <div>100%</div>
                    </div>
                    <ProgressBar value="42" max="100"></ProgressBar>
                </div>
            </div>
        </div>
    );
}

export default RightPart;
