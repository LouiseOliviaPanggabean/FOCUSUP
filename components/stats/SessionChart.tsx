import React, { useEffect, useRef } from 'react';
import { SessionRecord } from '../../types';
import { Chart } from 'chart.js/auto';
import { useTheme } from '../../hooks/useTheme';

interface SessionChartProps {
  sessions: SessionRecord[];
}

const SessionChart: React.FC<SessionChartProps> = ({ sessions }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const [theme] = useTheme();

  useEffect(() => {
    if (!chartRef.current) return;

    // Process data for the last 7 days
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toISOString().split('T')[0];
    }).reverse();

    const dataByDay = last7Days.reduce((acc, day) => {
        acc[day] = 0;
        return acc;
    }, {} as { [key: string]: number });

    sessions.forEach(session => {
        const sessionDay = session.date.split('T')[0];
        if (dataByDay[sessionDay] !== undefined) {
            dataByDay[sessionDay] += session.durationMinutes;
        }
    });

    const chartData = Object.values(dataByDay);
    const chartLabels = last7Days.map(day => new Date(day).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric'}));

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;
    
    // Destroy previous chart instance if it exists
    if (chartInstance.current) {
        chartInstance.current.destroy();
    }

    const gridColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    const textColor = theme === 'dark' ? '#E2E8F0' : '#343A40';

    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: chartLabels,
        datasets: [{
          label: 'Focus Minutes',
          data: chartData,
          backgroundColor: 'rgba(67, 104, 250, 0.6)',
          borderColor: 'rgba(67, 104, 250, 1)',
          borderWidth: 1,
          borderRadius: 4,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: gridColor,
            },
            ticks: {
              color: textColor,
            },
          },
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: textColor,
            },
          },
        },
      },
    });

    return () => {
        chartInstance.current?.destroy();
    };

  }, [sessions, theme]);

  return <div style={{ height: '300px' }}><canvas ref={chartRef} /></div>;
};

export default SessionChart;
