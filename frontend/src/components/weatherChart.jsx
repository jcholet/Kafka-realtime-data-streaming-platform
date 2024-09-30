import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

const data = [
  { time: 'Maintenant', temperature: 27, humidity: 23, icon: '☀️' },
  { time: '11:00', temperature: 28, humidity: 29, icon: '☀️' },
  { time: '12:00', temperature: 28, humidity: 58, icon: '☁️' },
  { time: '13:00', temperature: 29, humidity: 75, icon: '☁️' },
  { time: '14:00', temperature: 30, humidity: 33, icon: '☀️' },
  { time: '15:00', temperature: 29, humidity: 20, icon: '☁️' },
  { time: '16:00', temperature: 29, humidity: 73, icon: '☁️' },
  { time: '17:00', temperature: 28, humidity: 49, icon: '☀️' },
];

function CustomTooltip({ payload, label }) {
    // Vérifie que `payload` n'est pas vide et contient des données valides
    if (payload && payload.length) {
      return (
        <div style={{ backgroundColor: 'white', border: '1px solid #ccc', padding: '5px' }}>
          <p>{label}</p>
          {payload.map((item, index) => (
            <p key={index}>
              {`${item.name}: ${item.value}${item.dataKey === 'temperature' ? '°' : '%'}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
}

function WeatherChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorHumidity" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="humidity"
          stroke="#8884d8"
          fillOpacity={1}
          fill="url(#colorHumidity)"
        />
        <Line
          type="monotone"
          dataKey="temperature"
          stroke="#ff7300"
          dot={{ fill: '#ff7300', r: 5 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default WeatherChart;