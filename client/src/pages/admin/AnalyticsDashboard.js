import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Nav, Tab, Alert, Button, Badge } from 'react-bootstrap';
import { FaChartLine, FaBoxOpen, FaUsers, FaBell, FaDownload, FaCalendarAlt } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import Loader from '../../components/Loader';
import SalesChart from '../../components/admin/SalesChart';
import ProductPerformanceChart from '../../components/admin/ProductPerformanceChart';
import CustomerAnalyticsChart from '../../components/admin/CustomerAnalyticsChart';
import LowStockAlert from '../../components/admin/LowStockAlert';

// Mock data for development
const mockData = {
  salesData: {
    totalSales: 1250000,
    totalOrders: 450,
    averageOrderValue: 2778,
    conversionRate: 3.2,
    dailyData: Array.from({ length: 60 }, (_, i) => ({
      date: new Date(Date.now() - (59 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      sales: Math.floor(Math.random() * 50000) + 10000,
    })),
    monthlyData: Array.from({ length: 24 }, (_, i) => ({
      month: new Date(Date.now() - (23 - i) * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      sales: Math.floor(Math.random() * 300000) + 100000,
    })),
  },
  productData: {
    categoryDistribution: [
      { category: 'Electronics', count: 120 },
      { category: 'Clothing', count: 85 },
      { category: 'Footwear', count: 65 },
      { category: 'Home & Kitchen', count: 45 },
      { category: 'Beauty', count: 30 },
      { category: 'Books', count: 25 },
      { category: 'Others', count: 15 },
    ],
    topProducts: [
      { name: 'iPhone 13 Pro Max - 256GB', unitsSold: 85 },
      { name: 'Samsung Galaxy S21 Ultra', unitsSold: 72 },
      { name: 'Nike Air Max 270', unitsSold: 68 },
      { name: 'Sony WH-1000XM4 Headphones', unitsSold: 65 },
      { name: 'Apple Watch Series 7', unitsSold: 60 },
    ],
    inventoryStatus: [
      { name: 'iPhone 13 Pro Max - 256GB', category: 'Electronics', currentStock: 25, status: 'In Stock', trend: 'down', trendValue: 15 },
      { name: 'Samsung Galaxy S21 Ultra', category: 'Electronics', currentStock: 18, status: 'In Stock', trend: 'up', trendValue: 10 },
      { name: 'Nike Air Max 270', category: 'Footwear', currentStock: 5, status: 'Low Stock', trend: 'down', trendValue: 30 },
      { name: 'Sony WH-1000XM4 Headphones', category: 'Electronics', currentStock: 12, status: 'In Stock', trend: 'up', trendValue: 5 },
      { name: 'Apple Watch Series 7', category: 'Electronics', currentStock: 0, status: 'Out of Stock', trend: 'down', trendValue: 100 },
    ],
  },
  customerData: {
    totalCustomers: 2500,
    activeCustomers: 1800,
    activeCustomersPercentage: 72,
    averageCustomerValue: 5500,
    retentionRate: 65,
    acquisitionData: Array.from({ length: 12 }, (_, i) => ({
      date: new Date(Date.now() - (11 - i) * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      count: Math.floor(Math.random() * 100) + 50,
    })),
    customerSegments: [
      { segment: 'New Customers', percentage: 25 },
      { segment: 'Returning Customers', percentage: 40 },
      { segment: 'Loyal Customers', percentage: 20 },
      { segment: 'Inactive Customers', percentage: 15 },
    ],
  },
  lowStockAlerts: [
    { id: 1, name: 'Nike Air Max 270', category: 'Footwear', currentStock: 5, threshold: 10 },
    { id: 2, name: 'Levi\'s 501 Original Fit Jeans', category: 'Clothing', currentStock: 8, threshold: 15 },
    { id: 3, name: 'Logitech MX Master 3', category: 'Electronics', currentStock: 3, threshold: 10 },
  ],
};

const AnalyticsDashboard = () => {
  const { userInfo } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [dateRange, setDateRange] = useState('last30days');
  const [lowStockCount, setLowStockCount] = useState(0);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);

        // In a real implementation, you would fetch data from your API
        // const config = {
        //   headers: {
        //     Authorization: `Bearer ${userInfo.token}`,
        //   },
        // };
        // const { data } = await axios.get(`/api/analytics?range=${dateRange}`, config);
        // setAnalyticsData(data);

        // For now, use mock data
        setTimeout(() => {
          setAnalyticsData(mockData);
          setLoading(false);
        }, 1000);
      } catch (error) {
        setError(
          error.response && error.response.data.message
            ? error.response.data.message
            : 'Failed to load analytics data'
        );
        setLoading(false);
      }
    };

    const fetchLowStockCount = async () => {
      try {
        if (!userInfo || !userInfo.token) return;

        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };

        const response = await fetch(`/api/inventory-notifications/low-stock?threshold=10`, {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          }
        });
        const data = await response.json();
        const totalCount = data.lowStockProducts.length + data.outOfStockProducts.length;
        setLowStockCount(totalCount);
      } catch (error) {
        console.error('Error fetching low stock count:', error);
        // Don't set error state here to avoid disrupting the main dashboard
      }
    };

    if (userInfo && userInfo.role === 'admin') {
      fetchAnalyticsData();
      fetchLowStockCount();
    } else {
      setError('You do not have permission to view this page');
      setLoading(false);
    }
  }, [userInfo, dateRange]);

  const handleDateRangeChange = (range) => {
    setDateRange(range);
  };

  const handleExportData = () => {
    // In a real implementation, you would generate and download a report
    alert('Export functionality would generate a CSV or PDF report in a real implementation.');
  };

  return (
    <Container fluid className="py-4">
      <Row className="mb-4 align-items-center">
        <Col>
          <h1 className="mb-0">Analytics Dashboard</h1>
          <p className="text-muted">Comprehensive view of your store's performance</p>
        </Col>
        <Col xs="auto">
          <div className="d-flex">
            <div className="me-3">
              <Button
                variant="outline-secondary"
                className="d-flex align-items-center"
                onClick={handleExportData}
              >
                <FaDownload className="me-2" /> Export Data
              </Button>
            </div>
            <div className="date-range-selector">
              <Button
                variant={dateRange === 'last7days' ? 'primary' : 'outline-secondary'}
                className="me-2"
                onClick={() => handleDateRangeChange('last7days')}
              >
                7D
              </Button>
              <Button
                variant={dateRange === 'last30days' ? 'primary' : 'outline-secondary'}
                className="me-2"
                onClick={() => handleDateRangeChange('last30days')}
              >
                30D
              </Button>
              <Button
                variant={dateRange === 'last90days' ? 'primary' : 'outline-secondary'}
                className="me-2"
                onClick={() => handleDateRangeChange('last90days')}
              >
                90D
              </Button>
              <Button
                variant={dateRange === 'lastYear' ? 'primary' : 'outline-secondary'}
                onClick={() => handleDateRangeChange('lastYear')}
              >
                1Y
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {loading ? (
        <Loader />
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <>
          {/* Low Stock Alerts */}
          {lowStockCount > 0 && (
            <Alert variant="warning" className="d-flex align-items-center">
              <FaBell className="me-2" size={20} />
              <div>
                <strong>Low Stock Alert:</strong> {lowStockCount} products are below their stock threshold.
                <Button
                  variant="link"
                  className="p-0 ms-2"
                  onClick={() => setActiveTab('inventory')}
                >
                  View Details
                </Button>
              </div>
            </Alert>
          )}

          <Tab.Container id="analytics-tabs" activeKey={activeTab} onSelect={setActiveTab}>
            <Row className="mb-4">
              <Col>
                <Nav variant="tabs">
                  <Nav.Item>
                    <Nav.Link eventKey="overview" className="d-flex align-items-center">
                      <FaChartLine className="me-2" /> Overview
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="products" className="d-flex align-items-center">
                      <FaBoxOpen className="me-2" /> Products
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="customers" className="d-flex align-items-center">
                      <FaUsers className="me-2" /> Customers
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="inventory" className="d-flex align-items-center">
                      <FaBell className="me-2" /> Inventory Alerts
                      {lowStockCount > 0 && (
                        <span className="badge bg-danger ms-2">
                          {lowStockCount}
                        </span>
                      )}
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Col>
            </Row>

            <Tab.Content>
              <Tab.Pane eventKey="overview">
                <Row>
                  <Col xs={12}>
                    <SalesChart salesData={analyticsData.salesData} />
                  </Col>

                  <Col md={6}>
                    <Card className="shadow-sm mb-4">
                      <Card.Header className="bg-light">
                        <h5 className="mb-0">Top Selling Products</h5>
                      </Card.Header>
                      <Card.Body>
                        <div className="table-responsive">
                          <table className="table table-borderless">
                            <thead>
                              <tr>
                                <th>Product</th>
                                <th className="text-end">Units Sold</th>
                                <th className="text-end">Revenue</th>
                              </tr>
                            </thead>
                            <tbody>
                              {analyticsData.productData.topProducts.slice(0, 5).map((product, index) => (
                                <tr key={index}>
                                  <td>{product.name}</td>
                                  <td className="text-end">{product.unitsSold}</td>
                                  <td className="text-end">₹{(product.unitsSold * 15000).toLocaleString('en-IN')}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>

                  <Col md={6}>
                    <Card className="shadow-sm mb-4">
                      <Card.Header className="bg-light">
                        <h5 className="mb-0">Recent Activity</h5>
                      </Card.Header>
                      <Card.Body>
                        <div className="timeline">
                          {[1, 2, 3, 4, 5].map((_, index) => (
                            <div key={index} className="timeline-item pb-3">
                              <div className="d-flex">
                                <div className="me-3">
                                  <div className="timeline-icon bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                    <FaCalendarAlt />
                                  </div>
                                </div>
                                <div>
                                  <p className="mb-1 fw-bold">New order #{1000 + index}</p>
                                  <p className="text-muted small mb-0">
                                    {new Date(Date.now() - index * 3600000).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Tab.Pane>

              <Tab.Pane eventKey="products">
                <ProductPerformanceChart productData={analyticsData.productData} />
              </Tab.Pane>

              <Tab.Pane eventKey="customers">
                <CustomerAnalyticsChart customerData={analyticsData.customerData} />
              </Tab.Pane>

              <Tab.Pane eventKey="inventory">
                <LowStockAlert />
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </>
      )}
    </Container>
  );
};

export default AnalyticsDashboard;
