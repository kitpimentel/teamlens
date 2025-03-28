import React from 'react'
import { Doughnut } from 'react-chartjs-2'

/**
 * DoughnutChart component for displaying doughnut/pie charts
 * Uses Chart.js instead of recharts as specified in requirements
 * 
 * @param data - Array of data objects with name and value properties
 */
interface DoughnutChartProps {
  data: Array<{ name: string; value: number }>
}

export const DoughnutChart: React.FC<DoughnutChartProps> = ({ data }) => {
  // Extract labels and values from data
  const labels = data.map(item => item.name)
  const values = data.map(item => item.value)
  
  // Define a color palette
  const backgroundColors = [
    'rgba(99, 102, 241, 0.8)',   // indigo
    'rgba(248, 113, 113, 0.8)',  // red
    'rgba(52, 211, 153, 0.8)',   // emerald
    'rgba(251, 191, 36, 0.8)',   // amber
    'rgba(139, 92, 246, 0.8)',   // violet
    'rgba(14, 165, 233, 0.8)',   // sky
  ]
  
  // Chart configuration
  const chartData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: backgroundColors,
        borderColor: 'white',
        borderWidth: 2,
        hoverOffset: 4,
      }
    ]
  }
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          boxWidth: 12,
          padding: 15,
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || ''
            const value = context.raw || 0
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0)
            const percentage = Math.round((value / total) * 100)
            return `${label}: ${percentage}%`
          }
        }
      }
    },
    cutout: '70%',
  }
  
  return (
    <Doughnut data={chartData} options={options} />
  )
}