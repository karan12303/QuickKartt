import React, { useState, useEffect, useContext } from 'react';
import { Table, Button, Badge } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Message from '../components/Message';
import Loader from '../components/Loader';
import OrderProductImages from '../components/OrderProductImages';
import OrderReviewButton from '../components/OrderReviewButton';
import { FaShoppingBag, FaBoxOpen } from 'react-icons/fa';
import './OrderHistoryScreen.css';

const OrderHistoryScreen = () => {
  const navigate = useNavigate();
  const { userInfo } = useContext(AuthContext);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
      const fetchOrders = async () => {
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          };

          const { data } = await axios.get('/api/orders/myorders', config);
          setOrders(data);
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

      fetchOrders();
    }
  }, [navigate, userInfo]);

  return (
    <div className="order-history-container">
      <h1 className="order-history-title">
        <FaShoppingBag className="me-2" />
        My Orders
      </h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : orders.length === 0 ? (
        <Message>You have no orders yet.</Message>
      ) : (
        <Table striped bordered hover responsive className="align-middle order-history-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
              <th>Products</th>
              <th>Review</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="order-id-column">
                  {order.orderId}
                </td>
                <td className="order-date-column">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="order-total-column">
                  ₹{order.totalPrice.toLocaleString('en-IN')}
                </td>
                <td>
                  <Badge
                    bg={
                      order.status === 'delivered'
                        ? 'success'
                        : order.status === 'shipped'
                        ? 'info'
                        : 'warning'
                    }
                    className="order-status-badge"
                  >
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </Badge>
                </td>
                <td className="order-images-cell">
                  <OrderProductImages orderItems={order.orderItems} />
                </td>
                <td className="order-review-cell">
                  {order.status === 'delivered' && order.orderItems.map((item, index) => (
                    <div key={index} className="mb-2">
                      <OrderReviewButton
                        product={item.product}
                        userToken={userInfo.token}
                        orderId={order._id}
                      />
                    </div>
                  ))}
                  {order.status !== 'delivered' && (
                    <Badge bg="secondary" className="py-2 px-3">
                      Available after delivery
                    </Badge>
                  )}
                </td>
                <td className="order-actions-column">
                  <LinkContainer to={`/order/${order._id}`}>
                    <Button className="order-detail-btn" variant="primary" size="sm">
                      View Details
                    </Button>
                  </LinkContainer>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default OrderHistoryScreen;
