import React, { useState, useEffect, useContext } from 'react';
import { Table, Button, Badge, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { FaCheck, FaTimes, FaEdit, FaTrash, FaBan, FaUserSlash } from 'react-icons/fa';

const UserListScreen = () => {
  const navigate = useNavigate();
  const { userInfo } = useContext(AuthContext);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [userStatus, setUserStatus] = useState('');
  const [statusReason, setStatusReason] = useState('');

  useEffect(() => {
    if (!userInfo || userInfo.role !== 'admin') {
      navigate('/login');
    } else {
      fetchUsers();
    }
  }, [navigate, userInfo]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.get('/api/users', config);
      setUsers(data);
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

  const openModal = (action, user) => {
    setSelectedUser(user);
    setModalAction(action);
    setUserStatus(user.status || 'active');
    setStatusReason('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    setModalAction('');
    setUserStatus('');
    setStatusReason('');
  };

  const updateUserStatus = async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.put(
        `/api/users/${selectedUser._id}/status`,
        { status: userStatus, reason: statusReason },
        config
      );

      setSuccess(`User ${data.name} status updated to ${data.status}`);
      closeModal();
      fetchUsers();
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
      setLoading(false);
    }
  };

  const deleteUser = async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await axios.delete(`/api/users/${selectedUser._id}`, config);
      setSuccess(`User deleted successfully`);
      closeModal();
      fetchUsers();
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (modalAction === 'delete') {
      deleteUser();
    } else {
      updateUserStatus();
    }
  };

  const getUserStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge bg="success">Active</Badge>;
      case 'blocked':
        return <Badge bg="warning">Blocked</Badge>;
      case 'blacklisted':
        return <Badge bg="danger">Blacklisted</Badge>;
      default:
        return <Badge bg="success">Active</Badge>;
    }
  };

  return (
    <>
      <h1>Users</h1>
      {success && <Message variant="success">{success}</Message>}
      {error && <Message variant="danger">{error}</Message>}
      {loading ? (
        <Loader />
      ) : users.length === 0 ? (
        <Message>No users found</Message>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>MOBILE</th>
              <th>ADMIN</th>
              <th>STATUS</th>
              <th>REGISTERED</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>
                  {user.email ? (
                    <a href={`mailto:${user.email}`}>{user.email}</a>
                  ) : (
                    <span className="text-muted">N/A</span>
                  )}
                </td>
                <td>
                  {user.mobile ? (
                    <a href={`tel:${user.mobile}`}>{user.mobile}</a>
                  ) : (
                    <span className="text-muted">N/A</span>
                  )}
                </td>
                <td>
                  {user.role === 'admin' ? (
                    <FaCheck style={{ color: 'green' }} />
                  ) : (
                    <FaTimes style={{ color: 'red' }} />
                  )}
                </td>
                <td>{getUserStatusBadge(user.status)}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="d-flex">
                    {user._id !== userInfo._id && (
                      <>
                        <Button
                          variant="warning"
                          className="btn-sm mx-1"
                          onClick={() => openModal('block', user)}
                          title="Block/Unblock User"
                        >
                          <FaBan />
                        </Button>
                        <Button
                          variant="danger"
                          className="btn-sm mx-1"
                          onClick={() => openModal('blacklist', user)}
                          title="Blacklist User"
                        >
                          <FaUserSlash />
                        </Button>
                        <Button
                          variant="dark"
                          className="btn-sm mx-1"
                          onClick={() => openModal('delete', user)}
                          title="Delete User"
                        >
                          <FaTrash />
                        </Button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* User Action Modal */}
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalAction === 'delete'
              ? 'Delete User'
              : modalAction === 'block'
              ? 'Block/Unblock User'
              : 'Blacklist User'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <>
              <p>
                <strong>Name:</strong> {selectedUser.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedUser.email || 'N/A'}
              </p>
              <p>
                <strong>Mobile:</strong> {selectedUser.mobile || 'N/A'}
              </p>

              {modalAction === 'delete' ? (
                <p className="text-danger">
                  Are you sure you want to delete this user? This action cannot be undone.
                </p>
              ) : (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      value={userStatus}
                      onChange={(e) => setUserStatus(e.target.value)}
                    >
                      <option value="active">Active</option>
                      <option value="blocked">Blocked</option>
                      <option value="blacklisted">Blacklisted</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Reason</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={statusReason}
                      onChange={(e) => setStatusReason(e.target.value)}
                      placeholder="Enter reason for status change"
                    />
                  </Form.Group>
                </>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Cancel
          </Button>
          <Button
            variant={modalAction === 'delete' ? 'danger' : 'primary'}
            onClick={handleSubmit}
          >
            {modalAction === 'delete' ? 'Delete' : 'Update Status'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UserListScreen;
