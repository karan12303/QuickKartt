import React, { useState, useEffect } from 'react';
import { Card, Form, Row, Col } from 'react-bootstrap';
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

// Register ChartJS components
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

const SalesChart = ({ salesData }) => {
  const [timeRange, setTimeRange] = useState('week');
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    if (!salesData) return;

    // Process data based on selected time range
    let labels = [];
    let data = [];
    let compareData = [];

    switch (timeRange) {
      case 'week':
        // Last 7 days
        labels = salesData.dailyData.slice(-7).map(item => item.date);
        data = salesData.dailyData.slice(-7).map(item => item.sales);
        // Previous 7 days for comparison
        compareData = salesData.dailyData.slice(-14, -7).map(item => item.sales);
        break;
      case 'month':
        // Last 30 days
        labels = salesData.dailyData.slice(-30).map(item => item.date);
        data = salesData.dailyData.slice(-30).map(item => item.sales);
        // Previous 30 days for comparison
        compareData = salesData.dailyData.slice(-60, -30).map(item => item.sales);
        break;
      case 'quarter':
        // Last 3 months
        labels = salesData.monthlyData.slice(-3).map(item => item.month);
        data = salesData.monthlyData.slice(-3).map(item => item.sales);
        // Previous 3 months for comparison
        compareData = salesData.monthlyData.slice(-6, -3).map(item => item.sales);
        break;
      case 'year':
        // Last 12 months
        labels = salesData.monthlyData.slice(-12).map(item => item.month);
        data = salesData.monthlyData.slice(-12).map(item => item.sales);
        // Previous 12 months for comparison
        compareData = salesData.monthlyData.slice(-24, -12).map(item => item.sales);
        break;
      default:
        break;
    }

    // Format chart data
    setChartData({
      labels,
      datasets: [
        {
          label: 'Sales',
          data,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true,
          tension: 0.4,
        },
        {
          label: 'Previous Period',
          data: compareData,
          borderColor: 'rgba(153, 102, 255, 1)',
          backgroundColor: 'rgba(153, 102, 255, 0.1)',
          borderDash: [5, 5],
          fill: false,
          tension: 0.4,
        },
      ],
    });
  }, [salesData, timeRange]);

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Sales Trend',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `₹${context.parsed.y.toLocaleString('en-IN')}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '₹' + value.toLocaleString('en-IN');
          }
        }
      }
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
  };

  return (
    <Card className="shadow-sm mb-4">
      <Card.Header className="bg-light d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Sales Overview</h5>
        <Form.Select
          size="sm"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          style={{ width: 'auto' }}
        >
          <option value="week">Last 7 Days</option>
          <option value="month">Last 30 Days</option>
          <option value="quarter">Last 3 Months</option>
          <option value="year">Last 12 Months</option>
        </Form.Select>
      </Card.Header>
      <Card.Body>
        <Line data={chartData} options={options} />
        
        {/* Summary Stats */}
        <Row className="mt-4">
          <Col md={3} className="mb-3">
            <div className="border rounded p-3 text-center">
              <h6 className="text-muted mb-1">Total Sales</h6>
              <h4>₹{salesData?.totalSales.toLocaleString('en-IN') || 0}</h4>
            </div>
          </Col>
          <Col md={3} className="mb-3">
            <div className="border rounded p-3 text-center">
              <h6 className="text-muted mb-1">Orders</h6>
              <h4>{salesData?.totalOrders || 0}</h4>
            </div>
          </Col>
          <Col md={3} className="mb-3">
            <div className="border rounded p-3 text-center">
              <h6 className="text-muted mb-1">Avg. Order Value</h6>
              <h4>₹{salesData?.averageOrderValue.toLocaleString('en-IN') || 0}</h4>
            </div>
          </Col>
          <Col md={3} className="mb-3">
            <div className="border rounded p-3 text-center">
              <h6 className="text-muted mb-1">Conversion Rate</h6>
              <h4>{salesData?.conversionRate || 0}%</h4>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default SalesChart;
