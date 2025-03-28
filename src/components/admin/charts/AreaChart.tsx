import React from 'react'
import { Line } from 'react-chartjs-2'

/**
 * AreaChart component for displaying area charts
 * Uses Chart.js instead of recharts as specified in requirements
 * 
 * @param data - Array of data objects to display in the chart
 * @param xKey - Key in data objects for X-axis values
 * @param yKey - Key in data objects for Y-axis values
 */
interface AreaChartProps {
  data: any[]
  xKey: string
  yKey: string
}

export const AreaChart: React.FC<AreaChartProps> = ({ data, xKey, yKey }) => {
  // Extract labels (x-axis values) and dataset values from data
  const labels = data.map(item => item[xKey])
  const values = data.map(item => item[yKey])
  
  // Chart configuration
  const chartData = {
    labels,
    datasets: [
      {
        label: yKey.charAt(0).toUpperCase() + yKey.slice(1),
        data: values,
        fill: true,
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderColor: 'rgba(99, 102, 241, 1)',
        tension: 0.4,
      }
    ]
  }
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
    },
  }
  
  return (
    <Line data={chartData} options={options} />
  )
}