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
        {
            text: 'METEO. Jusqu\'à 300 mm de pluie, orages stationnaires : un nouvel épisode cévenol intense attendu ce week-end, l\'Hérault et le Gard en première ligne',
            imageUrl: 'https://france3-regions.francetvinfo.fr/image/92uDlbXeZ4nHqRGq91Qk28sIHU0/930x620/regions/2024/07/12/080-hl-slapeyrere-1545463-66910dfaf07b2056925636.jpg',


        },
        {
            text: 'METEO. Pluies et inondations : l’Allier, le Cantal, la Loire et le Puy-de-Dôme placés en vigilance orange',
            imageUrl: 'https://france3-regions.francetvinfo.fr/image/MBVuVn7edsufRR2nmuTQjCwBrmw/930x620/regions/2024/09/04/080-hl-rcostaseca-2457828-66d871d914405199787993.jpg',


        },
        {
            text: 'METEO. Une baisse des températures attendue cette semaine en Auvergne',
            imageUrl: 'https://france3-regions.francetvinfo.fr/image/1_C-GURlJb4pWGPqLJhyFcf0rG4/930x620/regions/2024/09/09/maxnewsworldfour197343-66df1029c745f455850868.jpg',


        },
        {
            text: 'jetblack-open-meteo added to PyPI',
            imageUrl: 'https://pypi.org/static/images/twitter.abaf4b19.webp',


        },
        {
            text: 'Des quartiers du centre de Marseille inondés après le plus gros orage depuis octobre 2021',
            imageUrl: 'https://france3-regions.francetvinfo.fr/image/qfQ3PSxNZhnannfgvGBJ8upv25Q/930x620/regions/2024/09/04/orages2-66d86f7a562f2090845696.png',


        },
        {
            text: 'Meteo France International décroche un gros contrat au Koweït',
            imageUrl: 'https://static.latribune.fr/full_width/2445969/meteo-france-international.jpg',


        },
        {
            text: 'Meteo. Pluies orageuses : le Gard et l`\'Hérault en vigilance orange',
            imageUrl: 'https://cdn-s-www.ledauphine.com/images/4C819823-5905-4E37-819A-AA91F2E83CF9/FB1200/photo-1727015598.jpg',


        },
        {
            text: 'Le département de Seine-et-Marne maintenu en vigilance orange crues ce samedi',
            imageUrl: 'https://media.ouest-france.fr/v1/pictures/MjAyNDA5YmI0ZmMwYTlhOTNhYzg1MTc2OTM2OGJkNWNkZTlhMzM?width=1260&height=708&focuspoint=50%2C25&cropresize=1&client_id=bpeditorial&sign=dc14f755090352c11ee443211055e02a6225b6c04bdd2325e4911805c163c15f'
        }
    ];

    return (
        <div className="right-part">
            <GridCarousel items={items}/>

            <div className="welcome-title"> Welcome back !</div>
            <div className='welcome-sub'>
                Check out today's weather information
            </div>

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
                                width: 15,
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
