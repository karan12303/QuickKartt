import React, { useState, useEffect, useContext } from 'react';
import { Table, Button, Badge, Row, Col, Card, Form, InputGroup, Pagination, Dropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaFilter, FaEye, FaShippingFast, FaBox, FaTruck, FaCheckCircle,
         FaCreditCard, FaMoneyBillWave, FaSortAmountDown, FaSortAmountUp, FaCalendarAlt } from 'react-icons/fa';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import Message from '../../components/Message';
import Loader from '../../components/Loader';

const OrderListScreen = () => {
  const navigate = useNavigate();
  const { userInfo } = useContext(AuthContext);

  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filtering and sorting states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Order statistics
  const [orderStats, setOrderStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    paid: 0,
    unpaid: 0
  });

  // Active stats filter
  const [activeStatsFilter, setActiveStatsFilter] = useState('all');

  useEffect(() => {
    if (!userInfo || userInfo.role !== 'admin') {
      navigate('/login');
    } else {
      fetchOrders();
    }
  }, [navigate, userInfo]);

  // Apply filters and sorting whenever relevant states change
  useEffect(() => {
    if (orders.length > 0) {
      applyFiltersAndSort();
    }
  }, [orders, searchTerm, statusFilter, paymentFilter, sortField, sortOrder, currentPage, itemsPerPage]);

  // Calculate order statistics
  useEffect(() => {
    if (orders.length > 0) {
      const stats = {
        total: orders.length,
        pending: orders.filter(order => order.status === 'pending').length,
        processing: orders.filter(order => order.status === 'processing').length,
        shipped: orders.filter(order => order.status === 'shipped').length,
        delivered: orders.filter(order => order.status === 'delivered').length,
        paid: orders.filter(order => order.isPaid).length,
        unpaid: orders.filter(order => !order.isPaid).length
      };
      setOrderStats(stats);
    }
  }, [orders]);

  // Apply all filters and sorting
  const applyFiltersAndSort = () => {
    let result = [...orders];

    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(
        order =>
          (order.orderId && order.orderId.toLowerCase().includes(search)) ||
          (order.user?.name && order.user.name.toLowerCase().includes(search)) ||
          (order._id && order._id.toLowerCase().includes(search))
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(order => order.status === statusFilter);
    }

    // Apply payment filter
    if (paymentFilter === 'paid') {
      result = result.filter(order => order.isPaid);
    } else if (paymentFilter === 'unpaid') {
      result = result.filter(order => !order.isPaid);
    }

    // Apply active stats filter (pending or processing orders)
    if (activeStatsFilter === 'active') {
      result = result.filter(order => order.status === 'pending' || order.status === 'processing');
    }

    // Apply sorting
    result.sort((a, b) => {
      let fieldA, fieldB;

      // Handle different field types
      if (sortField === 'createdAt') {
        fieldA = new Date(a.createdAt).getTime();
        fieldB = new Date(b.createdAt).getTime();
      } else if (sortField === 'totalPrice') {
        fieldA = a.totalPrice;
        fieldB = b.totalPrice;
      } else if (sortField === 'user') {
        fieldA = a.user?.name?.toLowerCase() || '';
        fieldB = b.user?.name?.toLowerCase() || '';
      } else {
        fieldA = a[sortField];
        fieldB = b[sortField];

        // Handle string fields
        if (typeof fieldA === 'string') {
          fieldA = fieldA.toLowerCase();
          fieldB = fieldB.toLowerCase();
        }
      }

      if (sortOrder === 'asc') {
        return fieldA > fieldB ? 1 : -1;
      } else {
        return fieldA < fieldB ? 1 : -1;
      }
    });

    // Calculate total pages
    setTotalPages(Math.ceil(result.length / itemsPerPage));

    // Apply pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedResult = result.slice(startIndex, startIndex + itemsPerPage);

    setFilteredOrders(paginatedResult);
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.get('/api/orders', config);
      setOrders(data);
      setFilteredOrders(data.slice(0, itemsPerPage));
      setTotalPages(Math.ceil(data.length / itemsPerPage));
      setLoading(false);
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
      setLoading(false);
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      setLoading(true);
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await axios.put(`/api/orders/${id}/status`, { status }, config);

      // Save current state
      const currentPageSaved = currentPage;
      const currentFiltersSaved = {
        searchTerm,
        statusFilter,
        paymentFilter,
        sortField,
        sortOrder,
        activeStatsFilter
      };

      // Fetch updated orders
      await fetchOrders();

      // Restore saved state
      setCurrentPage(currentPageSaved);

      // Apply the saved filters
      applyFiltersWithSavedState(currentFiltersSaved);

    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
      setLoading(false);
    }
  };

  const updatePaymentStatus = async (id, isPaid) => {
    try {
      setLoading(true);
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await axios.put(`/api/orders/${id}/pay`, { isPaid }, config);

      // Save current state
      const currentPageSaved = currentPage;
      const currentFiltersSaved = {
        searchTerm,
        statusFilter,
        paymentFilter,
        sortField,
        sortOrder,
        activeStatsFilter
      };

      // Fetch updated orders
      await fetchOrders();

      // Restore saved state
      setCurrentPage(currentPageSaved);

      // Apply the saved filters
      applyFiltersWithSavedState(currentFiltersSaved);

    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
      setLoading(false);
    }
  };

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle sort change
  const handleSortChange = (field) => {
    if (sortField === field) {
      // Toggle sort order if clicking the same field
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and default to ascending
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Handle items per page change
  const handleItemsPerPageChange = (e) => {
    const value = parseInt(e.target.value);
    setItemsPerPage(value);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Handle stats filter change
  const handleStatsFilterChange = (filter) => {
    setActiveStatsFilter(filter);
    setCurrentPage(1); // Reset to first page when changing filter

    // Update the status and payment filters based on the selected stats filter
    if (filter === 'all') {
      setStatusFilter('all');
      setPaymentFilter('all');
    } else if (filter === 'active') {
      setStatusFilter('all'); // We'll handle this in applyFiltersAndSort
      setPaymentFilter('all');
    } else if (filter === 'delivered') {
      setStatusFilter('delivered');
      setPaymentFilter('all');
    } else if (filter === 'paid') {
      setStatusFilter('all');
      setPaymentFilter('paid');
    }
  };

  // Apply filters with saved state
  const applyFiltersWithSavedState = (savedState) => {
    // Restore filter states
    setSearchTerm(savedState.searchTerm);
    setStatusFilter(savedState.statusFilter);
    setPaymentFilter(savedState.paymentFilter);
    setSortField(savedState.sortField);
    setSortOrder(savedState.sortOrder);
    setActiveStatsFilter(savedState.activeStatsFilter);

    // Apply the filters to the orders
    let result = [...orders];

    // Apply search filter
    if (savedState.searchTerm) {
      const search = savedState.searchTerm.toLowerCase();
      result = result.filter(
        order =>
          (order.orderId && order.orderId.toLowerCase().includes(search)) ||
          (order.user?.name && order.user.name.toLowerCase().includes(search)) ||
          (order._id && order._id.toLowerCase().includes(search))
      );
    }

    // Apply status filter
    if (savedState.statusFilter !== 'all') {
      result = result.filter(order => order.status === savedState.statusFilter);
    }

    // Apply payment filter
    if (savedState.paymentFilter === 'paid') {
      result = result.filter(order => order.isPaid);
    } else if (savedState.paymentFilter === 'unpaid') {
      result = result.filter(order => !order.isPaid);
    }

    // Apply active stats filter (pending or processing orders)
    if (savedState.activeStatsFilter === 'active') {
      result = result.filter(order => order.status === 'pending' || order.status === 'processing');
    }

    // Apply sorting
    result.sort((a, b) => {
      let fieldA, fieldB;

      // Handle different field types
      if (savedState.sortField === 'createdAt') {
        fieldA = new Date(a.createdAt).getTime();
        fieldB = new Date(b.createdAt).getTime();
      } else if (savedState.sortField === 'totalPrice') {
        fieldA = a.totalPrice;
        fieldB = b.totalPrice;
      } else if (savedState.sortField === 'user') {
        fieldA = a.user?.name?.toLowerCase() || '';
        fieldB = b.user?.name?.toLowerCase() || '';
      } else {
        fieldA = a[savedState.sortField];
        fieldB = b[savedState.sortField];

        // Handle string fields
        if (typeof fieldA === 'string') {
          fieldA = fieldA.toLowerCase();
          fieldB = fieldB.toLowerCase();
        }
      }

      if (savedState.sortOrder === 'asc') {
        return fieldA > fieldB ? 1 : -1;
      } else {
        return fieldA < fieldB ? 1 : -1;
      }
    });

    // Calculate total pages
    setTotalPages(Math.ceil(result.length / itemsPerPage));

    // Apply pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedResult = result.slice(startIndex, startIndex + itemsPerPage);

    setFilteredOrders(paginatedResult);
  };

  // Get status badge with icon
  const getStatusBadge = (status) => {
    let icon, bg;

    switch (status) {
      case 'pending':
        icon = <FaCalendarAlt className="me-1" />;
        bg = 'warning';
        break;
      case 'processing':
        icon = <FaBox className="me-1" />;
        bg = 'primary';
        break;
      case 'shipped':
        icon = <FaTruck className="me-1" />;
        bg = 'info';
        break;
      case 'delivered':
        icon = <FaCheckCircle className="me-1" />;
        bg = 'success';
        break;
      default:
        icon = <FaCalendarAlt className="me-1" />;
        bg = 'secondary';
    }

    return (
      <Badge bg={bg} className="d-inline-flex align-items-center py-1 px-2 order-status-badge">
        {icon} {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  // Get payment badge with icon
  const getPaymentBadge = (isPaid, paymentMethod) => {
    return (
      <>
        <Badge
          bg={isPaid ? 'success' : 'danger'}
          className="d-inline-flex align-items-center py-1 px-2 order-status-badge"
        >
          {isPaid ? <FaCreditCard className="me-1" /> : <FaMoneyBillWave className="me-1" />}
          {isPaid ? 'Paid' : 'Not Paid'}
        </Badge>
        {paymentMethod && (
          <div className="small text-muted mt-1">
            {paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1)}
          </div>
        )}
      </>
    );
  };

  return (
    <div className="admin-panel">
      <Row className="align-items-center mb-4">
        <Col>
          <div className="d-flex flex-column">
            <h1 className="mb-2">Orders Management</h1>
            <p className="text-muted mb-0">
              {loading ? 'Loading orders...' : `${orders.length} orders found`}
              {activeStatsFilter !== 'all' && (
                <span className="ms-2 badge bg-primary">
                  {activeStatsFilter === 'active' && 'Showing Active Orders'}
                  {activeStatsFilter === 'delivered' && 'Showing Delivered Orders'}
                  {activeStatsFilter === 'paid' && 'Showing Paid Orders'}
                </span>
              )}
            </p>
          </div>
        </Col>
      </Row>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : orders.length === 0 ? (
        <Message>No orders found</Message>
      ) : (
        <>
          {/* Order Statistics */}
          <Row className="mb-4">
            <Col md={3} sm={6} className="mb-3">
              <Card
                className={`h-100 order-stats-card ${activeStatsFilter === 'all' ? 'active-stats-card' : ''}`}
                onClick={() => handleStatsFilterChange('all')}
                role="button"
              >
                <Card.Body className="d-flex flex-column align-items-center justify-content-center text-center">
                  <h3 className="mb-0">{orderStats.total}</h3>
                  <p className="text-muted mb-0">Total Orders</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6} className="mb-3">
              <Card
                className={`h-100 order-stats-card ${activeStatsFilter === 'active' ? 'active-stats-card' : ''}`}
                onClick={() => handleStatsFilterChange('active')}
                role="button"
              >
                <Card.Body className="d-flex flex-column align-items-center justify-content-center text-center">
                  <h3 className="mb-0">{orderStats.pending + orderStats.processing}</h3>
                  <p className="text-muted mb-0">Active Orders</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6} className="mb-3">
              <Card
                className={`h-100 order-stats-card ${activeStatsFilter === 'delivered' ? 'active-stats-card' : ''}`}
                onClick={() => handleStatsFilterChange('delivered')}
                role="button"
              >
                <Card.Body className="d-flex flex-column align-items-center justify-content-center text-center">
                  <h3 className="mb-0">{orderStats.delivered}</h3>
                  <p className="text-muted mb-0">Delivered Orders</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6} className="mb-3">
              <Card
                className={`h-100 order-stats-card ${activeStatsFilter === 'paid' ? 'active-stats-card' : ''}`}
                onClick={() => handleStatsFilterChange('paid')}
                role="button"
              >
                <Card.Body className="d-flex flex-column align-items-center justify-content-center text-center">
                  <h3 className="mb-0">{orderStats.paid}</h3>
                  <p className="text-muted mb-0">Paid Orders</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Filters and Search Section */}
          <Card className="mb-4 shadow-sm filter-card">
            <Card.Body>
              <Row className="align-items-center">
                <Col md={3}>
                  <div className="d-flex align-items-center">
                    <InputGroup className="mb-md-0 mb-3 search-bar-container">
                      <InputGroup.Text>
                        <FaSearch />
                      </InputGroup.Text>
                      <Form.Control
                        placeholder="Search orders..."
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          if (e.target.value) {
                            setActiveStatsFilter('all'); // Reset stats filter when searching
                          }
                          setCurrentPage(1); // Reset to first page on search
                        }}
                      />
                    </InputGroup>
                  </div>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-md-0 mb-3">
                    <Form.Select
                      value={statusFilter}
                      onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setActiveStatsFilter('all'); // Reset stats filter when manually changing status
                        setCurrentPage(1); // Reset to first page on filter change
                      }}
                    >
                      <option value="all">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-md-0 mb-3">
                    <Form.Select
                      value={paymentFilter}
                      onChange={(e) => {
                        setPaymentFilter(e.target.value);
                        setActiveStatsFilter('all'); // Reset stats filter when manually changing payment status
                        setCurrentPage(1); // Reset to first page on filter change
                      }}
                    >
                      <option value="all">All Payments</option>
                      <option value="paid">Paid</option>
                      <option value="unpaid">Unpaid</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-0">
                    <Form.Select
                      value={sortField}
                      onChange={(e) => {
                        setSortField(e.target.value);
                      }}
                    >
                      <option value="createdAt">Sort by Date</option>
                      <option value="totalPrice">Sort by Amount</option>
                      <option value="status">Sort by Status</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Orders Table */}
          <Card className="shadow-sm">
            <Card.Body className="p-0">
              <Table responsive hover className="mb-0">
                <thead className="bg-light">
                  <tr>
                    <th
                      style={{ cursor: 'pointer', width: '120px' }}
                      onClick={() => handleSortChange('orderId')}
                      className="px-3"
                    >
                      ORDER ID {sortField === 'orderId' && (
                        sortOrder === 'asc' ? <FaSortAmountUp size={12} /> : <FaSortAmountDown size={12} />
                      )}
                    </th>
                    <th
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleSortChange('user')}
                      className="px-3"
                    >
                      CUSTOMER {sortField === 'user' && (
                        sortOrder === 'asc' ? <FaSortAmountUp size={12} /> : <FaSortAmountDown size={12} />
                      )}
                    </th>
                    <th
                      style={{ cursor: 'pointer', width: '120px' }}
                      onClick={() => handleSortChange('createdAt')}
                      className="px-3"
                    >
                      DATE {sortField === 'createdAt' && (
                        sortOrder === 'asc' ? <FaSortAmountUp size={12} /> : <FaSortAmountDown size={12} />
                      )}
                    </th>
                    <th
                      style={{ cursor: 'pointer', width: '120px' }}
                      onClick={() => handleSortChange('totalPrice')}
                      className="px-3"
                    >
                      TOTAL {sortField === 'totalPrice' && (
                        sortOrder === 'asc' ? <FaSortAmountUp size={12} /> : <FaSortAmountDown size={12} />
                      )}
                    </th>
                    <th className="px-3" style={{ width: '150px' }}>PAYMENT</th>
                    <th
                      style={{ cursor: 'pointer', width: '150px' }}
                      onClick={() => handleSortChange('status')}
                      className="px-3"
                    >
                      STATUS {sortField === 'status' && (
                        sortOrder === 'asc' ? <FaSortAmountUp size={12} /> : <FaSortAmountDown size={12} />
                      )}
                    </th>
                    <th className="px-3" style={{ width: '220px' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order._id}>
                      <td className="px-3">
                        <div className="d-flex flex-column">
                          <strong>{order.orderId}</strong>
                          <small className="text-muted">ID: {order._id.substring(0, 8)}...</small>
                        </div>
                      </td>
                      <td className="px-3">{order.user?.name || 'Unknown User'}</td>
                      <td className="px-3">
                        <div className="d-flex flex-column">
                          <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                          <small className="text-muted">
                            {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </small>
                        </div>
                      </td>
                      <td className="px-3">₹{order.totalPrice.toLocaleString('en-IN')}</td>
                      <td className="px-3">
                        {getPaymentBadge(order.isPaid, order.paymentMethod)}
                        {order.isPaid && (
                          <div className="small text-muted mt-1">
                            {new Date(order.paidAt).toLocaleDateString()}
                          </div>
                        )}
                      </td>
                      <td className="px-3">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="px-3">
                        <div className="d-flex flex-wrap order-actions">
                          {/* View Details Button */}
                          <LinkContainer to={`/order/${order._id}`}>
                            <Button variant="outline-secondary" size="sm" className="me-1 mb-1" title="View Details">
                              <FaEye /> View
                            </Button>
                          </LinkContainer>

                          {/* Order Status Buttons */}
                          {order.status === 'pending' && (
                            <Button
                              variant="outline-primary"
                              size="sm"
                              className="me-1 mb-1"
                              onClick={() => updateOrderStatus(order._id, 'processing')}
                              title="Process Order"
                            >
                              <FaBox /> Process
                            </Button>
                          )}
                          {order.status === 'processing' && (
                            <Button
                              variant="outline-info"
                              size="sm"
                              className="me-1 mb-1"
                              onClick={() => updateOrderStatus(order._id, 'shipped')}
                              title="Ship Order"
                            >
                              <FaShippingFast /> Ship
                            </Button>
                          )}
                          {order.status === 'shipped' && (
                            <Button
                              variant="outline-success"
                              size="sm"
                              className="me-1 mb-1"
                              onClick={() => updateOrderStatus(order._id, 'delivered')}
                              title="Mark as Delivered"
                            >
                              <FaCheckCircle /> Deliver
                            </Button>
                          )}

                          {/* Payment Status Button */}
                          {!order.isPaid ? (
                            <Button
                              variant="outline-success"
                              size="sm"
                              className="mb-1"
                              onClick={() => updatePaymentStatus(order._id, true)}
                              title="Mark as Paid"
                            >
                              <FaCreditCard /> Mark Paid
                            </Button>
                          ) : (
                            <Button
                              variant="outline-warning"
                              size="sm"
                              className="mb-1"
                              onClick={() => updatePaymentStatus(order._id, false)}
                              title="Mark as Unpaid"
                            >
                              <FaMoneyBillWave /> Mark Unpaid
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>

          {/* Pagination */}
          <div className="d-flex justify-content-between align-items-center mt-4">
            <div>
              <Form.Select
                style={{ width: 'auto' }}
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
              >
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
                <option value={50}>50 per page</option>
                <option value={100}>100 per page</option>
              </Form.Select>
            </div>

            <Pagination>
              <Pagination.First
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
              />
              <Pagination.Prev
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              />

              {[...Array(totalPages).keys()].map(x => {
                // Show 5 pages around current page
                if (
                  x + 1 === 1 ||
                  x + 1 === totalPages ||
                  (x + 1 >= currentPage - 2 && x + 1 <= currentPage + 2)
                ) {
                  return (
                    <Pagination.Item
                      key={x + 1}
                      active={x + 1 === currentPage}
                      onClick={() => handlePageChange(x + 1)}
                    >
                      {x + 1}
                    </Pagination.Item>
                  );
                } else if (
                  x + 1 === currentPage - 3 ||
                  x + 1 === currentPage + 3
                ) {
                  return <Pagination.Ellipsis key={x + 1} />;
                }
                return null;
              })}

              <Pagination.Next
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              />
              <Pagination.Last
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
              />
            </Pagination>
          </div>
        </>
      )}
    </div>
  );
};

export default OrderListScreen;
