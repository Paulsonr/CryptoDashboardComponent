import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  BarElement,
} from 'chart.js';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faExpandArrowsAlt,
  faCompressArrowsAlt,
  faChartLine,
} from '@fortawesome/free-solid-svg-icons';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement
);

const ControlsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ActionButtonContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 30px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled.button`
  padding: 5px 10px;
  border: none;
  background-color: ${(props) =>
    props.active === true ? '#4B40EE' : '#f1f3f4'};
  color: ${(props) => (props.active === true ? '#ffffff' : '#5f6368')};
  cursor: pointer;
  border-radius: 4px;
`;

const ControlButton = styled.button`
  padding: 5px 10px;
  border: none;
  background-color: transparent;
  outline: none !important;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  color: #6F7177
`;

const ChartContainer = styled.div`
  position: relative;
  height: 400px;
  width: 840px;
  background-color: white;
`;

const PriceIndicator = styled.div`
  position: absolute;
  right: 10px;
  background-color: #4B40EE;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
`;

const CryptoChart = () => {
  const [price, setPrice] = useState(63179.71);
  const [chartData, setChartData] = useState(null);
  const [comparisonData, setComparisonData] = useState(null);
  const [activeTimeRange, setActiveTimeRange] = useState('1w');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const chartRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [activeTimeRange]);

  useEffect(() => {
    const handleFullScreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullScreenChange); // For Safari
    document.addEventListener('mozfullscreenchange', handleFullScreenChange); // For Firefox
    document.addEventListener('MSFullscreenChange', handleFullScreenChange); // For IE/Edge

    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
      document.removeEventListener(
        'webkitfullscreenchange',
        handleFullScreenChange
      );
      document.removeEventListener(
        'mozfullscreenchange',
        handleFullScreenChange
      );
      document.removeEventListener(
        'MSFullscreenChange',
        handleFullScreenChange
      );
    };
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const mockData = generateMockData();
      setChartData(mockData);
      setComparisonData(generateComparisonData(mockData));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockData = () => {
    const labels = Array.from({ length: 50 }, (_, i) => i + 1);
    const priceData = labels.map(() => Math.random() * 5000 + 60000);
    const volumeData = labels.map(() => Math.random() * 1000000 * 0.5);

    return {
      labels,
      datasets: [
        {
          label: 'Price (USD)',
          data: priceData,
          borderColor: '#4B40EE',
          tension: 0.1,
          yAxisID: 'y',
          fill: true,
          backgroundColor: (context) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, 400);
            gradient.addColorStop(0, 'rgba(26, 115, 232, 0.4)');
            gradient.addColorStop(1, 'rgba(26, 115, 232, 0)');
            return gradient;
          },
        },
        {
          label: 'Volume',
          data: volumeData,
          type: 'bar',
          backgroundColor: '#E6E8EB',
          yAxisID: 'y1',
          barThickness: 10,
          barHeight: '50px',
        },
      ],
    };
  };

  const generateComparisonData = (originalData) => {
    const comparisonPriceData = originalData.datasets[0].data.map(
      (price) => price * (0.8 + Math.random() * 0.4)
    );
    return {
      ...originalData,
      datasets: [
        ...originalData.datasets,
        {
          label: 'Comparison Price (USD)',
          data: comparisonPriceData,
          borderColor: '#34a853',
          tension: 0.1,
          yAxisID: 'y',
          fill: true,
          backgroundColor: (context) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, 400);
            gradient.addColorStop(0, 'rgba(52, 168, 83, 0.4)');
            gradient.addColorStop(1, 'rgba(52, 168, 83, 0)');
            return gradient;
          },
        },
      ],
    };
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        display: showComparison,
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            if (context.dataset.type === 'bar') {
              return `Volume: ${context.parsed.y.toLocaleString()}`;
            } else {
              return `${context.dataset.label}: $${context.parsed.y.toFixed(
                2
              )}`;
            }
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: true,
          drawOnChartArea: true,
        },
        ticks: {
          display: false,
        },
        border: {
          display: true,
        },
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        grid: {
          display: false,
          drawOnChartArea: false,
        },
        ticks: {
          display: false,
        },
        border: {
          display: true,
        },
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          display: false,
          drawOnChartArea: false,
        },
        ticks: {
          display: false,
        },
        border: {
          display: true,
        },
        min: 0,
        max: 1000000,
      },
    },
    hover: {
      mode: 'index',
      intersect: false,
    },
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      chartRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const toggleComparison = () => {
    if (!chartData) {
      console.error('Chart data is not available');
      return;
    }
    setShowComparison(!showComparison);
  };

  return (
    <div>
      <ControlsContainer>
        <ActionButtonContainer>
          <ControlButton onClick={toggleFullscreen}>
            <FontAwesomeIcon
              icon={isFullscreen ? faCompressArrowsAlt : faExpandArrowsAlt}
            />
            Fullscreen
          </ControlButton>
          <ControlButton onClick={toggleComparison}>
            <FontAwesomeIcon icon={faChartLine} />
            {showComparison ? 'Hide Comparison' : 'Compare'}
          </ControlButton>
        </ActionButtonContainer>
        <ButtonContainer>
          <Button
            active={activeTimeRange === '1d'}
            onClick={() => setActiveTimeRange('1d')}
          >
            1d
          </Button>
          <Button
            active={activeTimeRange === '3d'}
            onClick={() => setActiveTimeRange('3d')}
          >
            3d
          </Button>
          <Button
            active={activeTimeRange === '1w'}
            onClick={() => setActiveTimeRange('1w')}
          >
            1w
          </Button>
          <Button
            active={activeTimeRange === '1m'}
            onClick={() => setActiveTimeRange('1m')}
          >
            1m
          </Button>
          <Button
            active={activeTimeRange === '6m'}
            onClick={() => setActiveTimeRange('6m')}
          >
            6m
          </Button>
          <Button
            active={activeTimeRange === '1y'}
            onClick={() => setActiveTimeRange('1y')}
          >
            1y
          </Button>
          <Button
            active={activeTimeRange === 'max'}
            onClick={() => setActiveTimeRange('max')}
          >
            max
          </Button>
        </ButtonContainer>
      </ControlsContainer>
      <ChartContainer
        ref={chartRef}
        style={{ padding: isFullscreen ? '60px 20px' : '0px' }}
      >
        {isLoading ? (
          <div>Loading...</div>
        ) : chartData ? (
          <Line
            data={showComparison ? comparisonData : chartData}
            options={options}
            plugins={[
              {
                id: 'customCrosshair',
                afterDraw: (chart) => {
                  if (chart.tooltip?._active && chart.tooltip?._active.length) {
                    const activePoint = chart.tooltip?._active[0];
                    const { ctx } = chart;
                    const { x } = activePoint.element;
                    const topY = chart.scales.y.top;
                    const bottomY = chart.scales.y.bottom;

                    ctx.save();
                    ctx.beginPath();
                    ctx.moveTo(x, topY);
                    ctx.lineTo(x, bottomY);
                    ctx.lineWidth = 1;
                    ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
                    ctx.setLineDash([5, 5]);
                    ctx.stroke();
                    ctx.restore();

                    ctx.save();
                    ctx.beginPath();
                    ctx.moveTo(chart.scales.x.left, activePoint.element.y);
                    ctx.lineTo(chart.scales.x.right, activePoint.element.y);
                    ctx.lineWidth = 1;
                    ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
                    ctx.setLineDash([5, 5]);
                    ctx.stroke();
                    ctx.restore();
                  }
                },
              },
            ]}
          />
        ) : (
          <div>No data available</div>
        )}
        {!isLoading && <PriceIndicator>${price.toFixed(2)}</PriceIndicator>}
      </ChartContainer>
    </div>
  );
};

export default CryptoChart;
