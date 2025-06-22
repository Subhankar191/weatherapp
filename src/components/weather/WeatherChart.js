import { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { useWeather } from '../../hooks';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const WeatherChart = () => {
  const { hourlyData, unit } = useWeather();

  const chartData = useMemo(() => {
    if (!hourlyData) return null;

    const labels = hourlyData.map((hour, index) => {
      const date = new Date(hour.dt * 1000);
      return index % 3 === 0 ? date.getHours() + ':00' : '';
    });

    const temperatures = hourlyData.map(hour => hour.temp);
    const feelsLike = hourlyData.map(hour => hour.feels_like);
    const precipitation = hourlyData.map(hour => hour.pop * 100);

    return {
      labels,
      datasets: [
        {
          label: `Temperature (°${unit === 'metric' ? 'C' : 'F'})`,
          data: temperatures,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          yAxisID: 'y',
          tension: 0.4,
          fill: true,
        },
        {
          label: 'Feels Like',
          data: feelsLike,
          borderColor: 'rgb(54, 162, 235)',
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          yAxisID: 'y',
          tension: 0.4,
        },
        {
          label: 'Precipitation %',
          data: precipitation,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          yAxisID: 'y1',
          tension: 0.4,
        },
      ],
    };
  }, [hourlyData, unit]);

  const options = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      title: {
        display: true,
        text: '24-Hour Forecast',
      },
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        min: 0,
        max: 100,
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  if (!chartData) return null;

  return (
    <div className="weather-chart">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default WeatherChart;