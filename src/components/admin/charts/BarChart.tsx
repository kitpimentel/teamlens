import React from 'react'
import { Bar } from 'react-chartjs-2'

/**
 * BarChartComponent for displaying bar charts with multiple categories
 * Uses Chart.js instead of recharts as specified in requirements
 * 
 * @param data - Array of data objects to display
 * @param categories - Array of keys from data objects to display as different bar groups
 * @param index - Key in data objects for X-axis categories
 */
interface BarChartProps {
  data: any[]
  categories: string[]
  index: string
}

export const BarChartComponent: React.FC<BarChartProps> = ({ data, categories, index }) => {
  // Extract labels (x-axis categories)
  const labels = data.map(item => item[index])
  
  // Create datasets for each category
  const datasets = categories.map((category, idx) => {
    // Define colors for different categories
    const colors = [
      { bg: 'rgba(99, 102, 241, 0.8)', border: 'rgb(99, 102, 241)' },
      { bg: 'rgba(248, 113, 113, 0.8)', border: 'rgb(248, 113, 113)' },
      { bg: 'rgba(52, 211, 153, 0.8)', border: 'rgb(52, 211, 153)' },
      { bg: 'rgba(251, 191, 36, 0.8)', border: 'rgb(251, 191, 36)' },
    ]
    
    return {
      label: category.charAt(0).toUpperCase() + category.slice(1),
      data: data.map(item => item[category]),
      backgroundColor: colors[idx % colors.length].bg,
      borderColor: colors[idx % colors.length].border,
      borderWidth: 1,
    }
  })
  
  // Chart configuration
  const chartData = {
    labels,
    datasets,
  }
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
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
    <Bar data={chartData} options={options} />
  )
}