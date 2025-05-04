import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
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
  ArcElement
);

const CustomerAnalyticsChart = ({ customerData }) => {
  // Format data for customer acquisition chart
  const acquisitionData = {
    labels: customerData?.acquisitionData.map(item => item.date) || [],
    datasets: [
      {
        label: 'New Customers',
        data: customerData?.acquisitionData.map(item => item.count) || [],
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Format data for customer segments chart
  const segmentData = {
    labels: customerData?.customerSegments.map(item => item.segment) || [],
    datasets: [
      {
        data: customerData?.customerSegments.map(item => item.percentage) || [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Customer Acquisition Trend',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Customer Segments',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.parsed}%`;
          }
        }
      }
    },
  };

  return (
    <Row>
      <Col md={7}>
        <Card className="shadow-sm mb-4">
          <Card.Header className="bg-light">
            <h5 className="mb-0">Customer Acquisition</h5>
          </Card.Header>
          <Card.Body>
            <Line data={acquisitionData} options={lineOptions} />
          </Card.Body>
        </Card>
      </Col>
      
      <Col md={5}>
        <Card className="shadow-sm mb-4">
          <Card.Header className="bg-light">
            <h5 className="mb-0">Customer Segments</h5>
          </Card.Header>
          <Card.Body>
            <Pie data={segmentData} options={pieOptions} />
          </Card.Body>
        </Card>
      </Col>
      
      <Col xs={12}>
        <Card className="shadow-sm mb-4">
          <Card.Header className="bg-light">
            <h5 className="mb-0">Customer Insights</h5>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={3} className="mb-3">
                <div className="border rounded p-3 text-center">
                  <h6 className="text-muted mb-1">Total Customers</h6>
                  <h4>{customerData?.totalCustomers.toLocaleString() || 0}</h4>
                </div>
              </Col>
              <Col md={3} className="mb-3">
                <div className="border rounded p-3 text-center">
                  <h6 className="text-muted mb-1">Active Customers</h6>
                  <h4>{customerData?.activeCustomers.toLocaleString() || 0}</h4>
                  <small className="text-muted">
                    {customerData?.activeCustomersPercentage || 0}% of total
                  </small>
                </div>
              </Col>
              <Col md={3} className="mb-3">
                <div className="border rounded p-3 text-center">
                  <h6 className="text-muted mb-1">Avg. Customer Value</h6>
                  <h4>₹{customerData?.averageCustomerValue.toLocaleString('en-IN') || 0}</h4>
                </div>
              </Col>
              <Col md={3} className="mb-3">
                <div className="border rounded p-3 text-center">
                  <h6 className="text-muted mb-1">Retention Rate</h6>
                  <h4>{customerData?.retentionRate || 0}%</h4>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default CustomerAnalyticsChart;
