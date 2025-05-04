import React from 'react';
import { Card, Row, Col, Table, Badge } from 'react-bootstrap';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const ProductPerformanceChart = ({ productData }) => {
  // Format data for category distribution chart
  const categoryData = {
    labels: productData?.categoryDistribution.map(item => item.category) || [],
    datasets: [
      {
        data: productData?.categoryDistribution.map(item => item.count) || [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
          'rgba(255, 159, 64, 0.7)',
          'rgba(199, 199, 199, 0.7)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(199, 199, 199, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Format data for top products chart
  const topProductsData = {
    labels: productData?.topProducts.map(item => item.name.substring(0, 15) + '...') || [],
    datasets: [
      {
        label: 'Units Sold',
        data: productData?.topProducts.map(item => item.unitsSold) || [],
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Product Category Distribution',
      },
    },
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Top Selling Products',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Row>
      <Col md={6}>
        <Card className="shadow-sm mb-4">
          <Card.Header className="bg-light">
            <h5 className="mb-0">Category Distribution</h5>
          </Card.Header>
          <Card.Body>
            <Doughnut data={categoryData} options={doughnutOptions} />
          </Card.Body>
        </Card>
      </Col>
      
      <Col md={6}>
        <Card className="shadow-sm mb-4">
          <Card.Header className="bg-light">
            <h5 className="mb-0">Top Selling Products</h5>
          </Card.Header>
          <Card.Body>
            <Bar data={topProductsData} options={barOptions} />
          </Card.Body>
        </Card>
      </Col>
      
      <Col xs={12}>
        <Card className="shadow-sm mb-4">
          <Card.Header className="bg-light">
            <h5 className="mb-0">Inventory Status</h5>
          </Card.Header>
          <Card.Body>
            <Table responsive striped hover>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Current Stock</th>
                  <th>Status</th>
                  <th>Trend</th>
                </tr>
              </thead>
              <tbody>
                {productData?.inventoryStatus.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.category}</td>
                    <td>{item.currentStock}</td>
                    <td>
                      <Badge
                        bg={
                          item.status === 'In Stock'
                            ? 'success'
                            : item.status === 'Low Stock'
                            ? 'warning'
                            : 'danger'
                        }
                      >
                        {item.status}
                      </Badge>
                    </td>
                    <td>
                      {item.trend === 'up' ? (
                        <span className="text-success">
                          <FaArrowUp /> {item.trendValue}%
                        </span>
                      ) : (
                        <span className="text-danger">
                          <FaArrowDown /> {item.trendValue}%
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default ProductPerformanceChart;
