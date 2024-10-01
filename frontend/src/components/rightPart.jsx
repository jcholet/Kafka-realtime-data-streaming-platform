import './rightPart.css';
import WeatherGraph from './weatherGraph';
import ProgressBar from './progressBar';
import {FaWind} from "react-icons/fa";
import {FaDroplet} from "react-icons/fa6";
import {FaCloudRain} from "react-icons/fa";
import {FaSun} from "react-icons/fa";
import {FaThermometerHalf} from "react-icons/fa";
import {FaUmbrella} from "react-icons/fa";
import {GaugeComponent} from 'react-gauge-component';
import GridCarousel from './gridCarousel';

function RightPart() {
    const items = [
        'Item 1',
        'Item 2',
        'Item 3',
        'Item 4',
        'Item 5',
        'Item 6',
        'Item 7',
        'Item 8'
      ];

    return (
        <div className="right-part">
            <div className="welcome-title"> Welcome back !</div>
            <div className='welcome-sub'>
                Check out today's weather information
            </div>
            
            <GridCarousel items={items} />

            <div className="graph-bg">
                <WeatherGraph/>
            </div>

            {/* More details of today's weather */}
            <div className="weather-details-title">More details of today's weather</div>

            <div className="weather-details-container">
                {/* Humidity Card */}
                <div className="weather-card">
                    <div className="weather-card-title">Humidity</div>
                    <div className="weather-card-icon">
                        <FaDroplet></FaDroplet>
                    </div>
                    <div className="weather-card-value">82% <span className="status bad">bad</span></div>
                    <div className="weather-card-scale">
                        <div>good</div>
                        <div>normal</div>
                        <div>bad</div>
                    </div>
                    <ProgressBar value="82" max="100" segmentNumber={3}></ProgressBar>
                </div>

                {/* Wind Card */}
                <div className="weather-card">
                    <div className="weather-card-title">Wind</div>
                    <div className="weather-card-icon">
                        <FaWind></FaWind>
                    </div>
                    <div className="weather-card-gauge">
                        <GaugeComponent
                            value={8}
                            maxValue={40}
                            type="semicircle"
                            labels={{
                                valueLabel: {
                                    formatTextValue: value => value + ' km/h',
                                    style: {fill: '#000000', fontFamily: 'ClashDisplay'}
                                },
                                tickLabels: {
                                    type: "outer",
                                    ticks: [
                                        {value: 5},
                                        {value: 10},
                                        {value: 20},
                                        {value: 30},
                                        {value: 40}
                                    ]
                                }
                            }}
                            arc={{
                                colorArray: ['rgba(92,155,229,0.2)', 'rgba(92,155,229,0.4)', 'rgba(92,155,229,0.6)', 'rgba(92,155,229,0.8)', 'rgba(92,155,229,1)'],
                                subArcs: [{limit: 5}, {limit: 10}, {limit: 20}, {limit: 30}, {limit: 40}],
                                padding: 0.05,
                                width: 0.2,
                                cornerRadius: 10
                            }}
                            pointer={{
                                elastic: true,
                                animate: false,
                                color: 'rgba(92,155,229,0.6)',
                                width:15,
                            }}
                        />
                    </div>
                </div>

                {/* Precipitation Card */}
                <div className="weather-card">
                    <div className="weather-card-title">Precipitation</div>
                    <div className="weather-card-icon">
                        <FaCloudRain></FaCloudRain>
                    </div>
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
                    <ProgressBar value="14" max="100" segmentNumber={10}></ProgressBar>
                </div>

                {/* UV Index Card */}
                <div className="weather-card">
                    <div className="weather-card-title">UV Index</div>
                    <div className="weather-card-icon">
                        <FaSun></FaSun>
                    </div>
                    <div className="weather-card-value">4 <span className="status medium">medium</span></div>
                    <div className="weather-card-scale">
                        <div>0-2</div>
                        <div>3-5</div>
                        <div>6-7</div>
                        <div>8-10</div>
                        <div>11+</div>
                    </div>
                    <ProgressBar value="4" max="11" segmentNumber={5}></ProgressBar>
                </div>

                {/* Feels Like Card */}
                <div className="weather-card">
                    <div className="weather-card-title">Feels Like</div>
                    <div className="weather-card-icon">
                        <FaThermometerHalf></FaThermometerHalf>
                    </div>
                    <div className="weather-card-value">30°</div>
                    <div className="weather-card-scale">
                        <div>0°</div>
                        <div>25°</div>
                        <div>50°</div>
                    </div>
                    <ProgressBar value="30" max="50" segmentNumber={1}></ProgressBar>
                </div>

                {/* Chance of Rain Card */}
                <div className="weather-card">
                    <div className="weather-card-title">Chance of Rain</div>
                    <div className="weather-card-icon">
                        <FaUmbrella></FaUmbrella>
                    </div>
                    <div className="weather-card-value">42%</div>
                    <div className="weather-card-scale chance-of-rain">
                        <div>0%</div>
                        <div>25%</div>
                        <div>50%</div>
                        <div>75%</div>
                        <div>100%</div>
                    </div>
                    <ProgressBar value="42" max="100" segmentNumber={1}></ProgressBar>
                </div>
            </div>
        </div>
    );
}

export default RightPart;
