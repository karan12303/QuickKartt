import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Table, Form, Alert, Modal, Badge, Image } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaArrowUp, FaArrowDown, FaEye, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import Loader from '../../components/Loader';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const BannerManagementScreen = () => {
  const { userInfo } = useContext(AuthContext);
  const [bannerSettings, setBannerSettings] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(null);
  
  // Form states
  const [selectedProductId, setSelectedProductId] = useState('');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [color, setColor] = useState('primary');
  const [isActive, setIsActive] = useState(true);
  
  // Fetch banner settings and products
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Check if user is admin
        if (!userInfo || userInfo.role !== 'admin') {
          setError('You do not have permission to view this page');
          setLoading(false);
          return;
        }
        
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        
        // Fetch banner settings
        const { data: bannerData } = await axios.get('/api/banner/admin', config);
        setBannerSettings(bannerData);
        
        // Fetch products for dropdown
        const { data: productsData } = await axios.get('/api/products', {
          params: {
            limit: 100,
            page: 1,
          },
        });
        
        setProducts(productsData.products || []);
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
    
    fetchData();
  }, [userInfo]);
  
  // Handle add banner product
  const handleAddBanner = async () => {
    try {
      if (!selectedProductId) {
        setError('Please select a product');
        return;
      }
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      
      const { data } = await axios.post(
        '/api/banner',
        {
          productId: selectedProductId,
          title,
          subtitle,
          color,
          displayOrder: bannerSettings.length,
        },
        config
      );
      
      setBannerSettings([...bannerSettings, data]);
      setSuccess('Product added to banner successfully');
      setShowAddModal(false);
      resetForm();
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  };
  
  // Handle edit banner product
  const handleEditBanner = async () => {
    try {
      if (!currentBanner) {
        return;
      }
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      
      const { data } = await axios.put(
        `/api/banner/${currentBanner._id}`,
        {
          title,
          subtitle,
          color,
          isActive,
        },
        config
      );
      
      // Update banner settings
      const updatedBannerSettings = bannerSettings.map((banner) =>
        banner._id === data._id ? data : banner
      );
      
      setBannerSettings(updatedBannerSettings);
      setSuccess('Banner updated successfully');
      setShowEditModal(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  };
  
  // Handle delete banner product
  const handleDeleteBanner = async (id) => {
    if (window.confirm('Are you sure you want to remove this product from the banner?')) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        
        await axios.delete(`/api/banner/${id}`, config);
        
        // Update banner settings
        const updatedBannerSettings = bannerSettings.filter((banner) => banner._id !== id);
        setBannerSettings(updatedBannerSettings);
        setSuccess('Product removed from banner successfully');
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccess('');
        }, 3000);
      } catch (error) {
        setError(
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        );
      }
    }
  };
  
  // Handle toggle banner active status
  const handleToggleActive = async (id, currentStatus) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      
      const { data } = await axios.put(
        `/api/banner/${id}`,
        {
          isActive: !currentStatus,
        },
        config
      );
      
      // Update banner settings
      const updatedBannerSettings = bannerSettings.map((banner) =>
        banner._id === data._id ? data : banner
      );
      
      setBannerSettings(updatedBannerSettings);
      setSuccess(`Banner ${data.isActive ? 'activated' : 'deactivated'} successfully`);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  };
  
  // Handle reorder banner products
  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    
    const items = Array.from(bannerSettings);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    // Update display order
    const updatedItems = items.map((item, index) => ({
      ...item,
      displayOrder: index,
    }));
    
    setBannerSettings(updatedItems);
    
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      
      // Prepare data for API
      const bannerOrder = updatedItems.map((item, index) => ({
        id: item._id,
        displayOrder: index,
      }));
      
      await axios.put('/api/banner/reorder', { bannerOrder }, config);
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  };
  
  // Open edit modal
  const openEditModal = (banner) => {
    setCurrentBanner(banner);
    setTitle(banner.title);
    setSubtitle(banner.subtitle);
    setColor(banner.color);
    setIsActive(banner.isActive);
    setShowEditModal(true);
  };
  
  // Reset form
  const resetForm = () => {
    setSelectedProductId('');
    setTitle('Featured Product');
    setSubtitle('Discover our premium selection.');
    setColor('primary');
    setIsActive(true);
  };
  
  return (
    <Container fluid className="py-4">
      <Row className="mb-4 align-items-center">
        <Col>
          <h1 className="mb-0">Banner Management</h1>
          <p className="text-muted">Manage products displayed in the homepage banner</p>
        </Col>
        <Col xs="auto">
          <Button 
            variant="primary" 
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
          >
            <FaPlus className="me-2" /> Add Product to Banner
          </Button>
        </Col>
      </Row>
      
      {loading ? (
        <Loader />
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <>
          {success && <Alert variant="success">{success}</Alert>}
          
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-light">
              <h5 className="mb-0">Banner Products</h5>
              <small className="text-muted">Drag and drop to reorder</small>
            </Card.Header>
            <Card.Body>
              {bannerSettings.length === 0 ? (
                <Alert variant="info">
                  No products added to banner yet. Click "Add Product to Banner" to get started.
                </Alert>
              ) : (
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="banner-products">
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                      >
                        <Table responsive hover className="align-middle">
                          <thead>
                            <tr>
                              <th style={{ width: '50px' }}>#</th>
                              <th style={{ width: '80px' }}>Image</th>
                              <th>Product</th>
                              <th>Title</th>
                              <th>Subtitle</th>
                              <th style={{ width: '100px' }}>Status</th>
                              <th style={{ width: '180px' }}>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {bannerSettings.map((banner, index) => (
                              <Draggable
                                key={banner._id}
                                draggableId={banner._id}
                                index={index}
                              >
                                {(provided) => (
                                  <tr
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    <td>{index + 1}</td>
                                    <td>
                                      <Image
                                        src={banner.productId.imageUrl}
                                        alt={banner.productId.name}
                                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                        thumbnail
                                      />
                                    </td>
                                    <td>
                                      <div className="d-flex flex-column">
                                        <strong>{banner.productId.name}</strong>
                                        <small className="text-muted">₹{banner.productId.price.toLocaleString('en-IN')}</small>
                                      </div>
                                    </td>
                                    <td>{banner.title}</td>
                                    <td>{banner.subtitle}</td>
                                    <td>
                                      {banner.isActive ? (
                                        <Badge bg="success">Active</Badge>
                                      ) : (
                                        <Badge bg="secondary">Inactive</Badge>
                                      )}
                                    </td>
                                    <td>
                                      <div className="d-flex">
                                        <Link to={`/product/${banner.productId._id}`} target="_blank">
                                          <Button variant="outline-secondary" size="sm" className="me-1" title="View Product">
                                            <FaEye />
                                          </Button>
                                        </Link>
                                        <Button
                                          variant="outline-primary"
                                          size="sm"
                                          className="me-1"
                                          title="Edit Banner"
                                          onClick={() => openEditModal(banner)}
                                        >
                                          <FaEdit />
                                        </Button>
                                        <Button
                                          variant="outline-danger"
                                          size="sm"
                                          className="me-1"
                                          title="Remove from Banner"
                                          onClick={() => handleDeleteBanner(banner._id)}
                                        >
                                          <FaTrash />
                                        </Button>
                                        <Button
                                          variant={banner.isActive ? 'outline-warning' : 'outline-success'}
                                          size="sm"
                                          title={banner.isActive ? 'Deactivate' : 'Activate'}
                                          onClick={() => handleToggleActive(banner._id, banner.isActive)}
                                        >
                                          {banner.isActive ? <FaToggleOff /> : <FaToggleOn />}
                                        </Button>
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </tbody>
                        </Table>
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              )}
            </Card.Body>
          </Card>
          
          <Card className="shadow-sm">
            <Card.Header className="bg-light">
              <h5 className="mb-0">Banner Preview</h5>
            </Card.Header>
            <Card.Body>
              <p>
                The banner will display the active products in the order shown above. 
                Changes made here will be reflected on the homepage banner.
              </p>
              <Link to="/" target="_blank">
                <Button variant="outline-primary">
                  View Homepage Banner
                </Button>
              </Link>
            </Card.Body>
          </Card>
        </>
      )}
      
      {/* Add Banner Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Product to Banner</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Select Product</Form.Label>
              <Form.Control
                as="select"
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                required
              >
                <option value="">-- Select Product --</option>
                {products.map((product) => (
                  <option key={product._id} value={product._id}>
                    {product.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Banner Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Featured Product"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <Form.Text className="text-muted">
                Main heading displayed on the banner
              </Form.Text>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Banner Subtitle</Form.Label>
              <Form.Control
                type="text"
                placeholder="Discover our premium selection."
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                required
              />
              <Form.Text className="text-muted">
                Subheading displayed on the banner
              </Form.Text>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Color Theme</Form.Label>
              <Form.Control
                as="select"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              >
                <option value="primary">Primary (Blue)</option>
                <option value="secondary">Secondary (Gray)</option>
                <option value="success">Success (Green)</option>
                <option value="danger">Danger (Red)</option>
                <option value="warning">Warning (Yellow)</option>
                <option value="info">Info (Light Blue)</option>
                <option value="dark">Dark (Black)</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddBanner}>
            Add to Banner
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Edit Banner Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Banner</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Product</Form.Label>
              <Form.Control
                type="text"
                value={currentBanner?.productId?.name || ''}
                disabled
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Banner Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Featured Product"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Banner Subtitle</Form.Label>
              <Form.Control
                type="text"
                placeholder="Discover our premium selection."
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Color Theme</Form.Label>
              <Form.Control
                as="select"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              >
                <option value="primary">Primary (Blue)</option>
                <option value="secondary">Secondary (Gray)</option>
                <option value="success">Success (Green)</option>
                <option value="danger">Danger (Red)</option>
                <option value="warning">Warning (Yellow)</option>
                <option value="info">Info (Light Blue)</option>
                <option value="dark">Dark (Black)</option>
              </Form.Control>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                id="active-switch"
                label="Active"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
              />
              <Form.Text className="text-muted">
                Only active banners will be displayed on the homepage
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleEditBanner}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default BannerManagementScreen;
