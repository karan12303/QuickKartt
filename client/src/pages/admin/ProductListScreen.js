import React, { useState, useEffect, useContext } from 'react';
import { Table, Button, Row, Col, Form, Card, Badge, InputGroup, Pagination, Image, Nav, Tab } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaFilter, FaSortAmountDown, FaSortAmountUp, FaEye, FaList, FaTh } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { categories } from '../../data/categories';

const ProductListScreen = () => {
  const navigate = useNavigate();
  const { userInfo } = useContext(AuthContext);

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Filtering and sorting states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [stockFilter, setStockFilter] = useState('all');
  const [viewMode, setViewMode] = useState('table');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!userInfo || userInfo.role !== 'admin') {
      navigate('/login');
    } else {
      fetchProducts();
    }
  }, [navigate, userInfo, success]);

  // Check for returning from edit screen and restore state if needed
  const locationState = useLocation().state;

  useEffect(() => {
    // Check if we're returning from the edit screen with saved state
    if (locationState?.returnToSavedState) {
      const savedStateString = localStorage.getItem('productListState');
      if (savedStateString) {
        try {
          const savedState = JSON.parse(savedStateString);

          // Restore all saved state values
          setCurrentPage(savedState.currentPage || 1);
          setItemsPerPage(savedState.itemsPerPage || 10);
          setSearchTerm(savedState.searchTerm || '');
          setSelectedCategory(savedState.selectedCategory || '');
          setSortField(savedState.sortField || 'createdAt');
          setSortOrder(savedState.sortOrder || 'desc');
          setStockFilter(savedState.stockFilter || 'all');
          setViewMode(savedState.viewMode || 'table');

          // Clear the location state to prevent re-applying on refresh
          window.history.replaceState({}, document.title);
        } catch (error) {
          console.error('Error restoring saved state:', error);
        }
      }
    }
  }, [locationState]);

  // Apply filters and sorting whenever relevant states change
  useEffect(() => {
    if (products.length > 0) {
      applyFiltersAndSort();
    }
  }, [products, searchTerm, selectedCategory, sortField, sortOrder, stockFilter, currentPage]);

  // Apply all filters and sorting
  const applyFiltersAndSort = () => {
    let result = [...products];

    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(
        product =>
          product.name.toLowerCase().includes(search) ||
          product.category.toLowerCase().includes(search) ||
          product._id.toLowerCase().includes(search)
      );
    }

    // Apply category filter
    if (selectedCategory) {
      result = result.filter(product =>
        product.category === selectedCategory ||
        product.category.startsWith(`${selectedCategory} >`)
      );
    }

    // Apply stock filter
    if (stockFilter === 'outOfStock') {
      result = result.filter(product => product.countInStock === 0);
    } else if (stockFilter === 'lowStock') {
      result = result.filter(product => product.countInStock > 0 && product.countInStock <= 10);
    } else if (stockFilter === 'inStock') {
      result = result.filter(product => product.countInStock > 10);
    }

    // Apply sorting
    result.sort((a, b) => {
      let fieldA = a[sortField];
      let fieldB = b[sortField];

      // Handle string fields
      if (typeof fieldA === 'string') {
        fieldA = fieldA.toLowerCase();
        fieldB = fieldB.toLowerCase();
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

    setFilteredProducts(paginatedResult);
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);

      // Fetch all products with a high limit to ensure all products are returned
      const { data } = await axios.get('/api/products', {
        params: {
          limit: 1000, // Set a high limit to get all products
          page: 1,
          sort: 'createdAt',
          order: 'desc'
        },
        timeout: 15000 // Increased timeout for larger data load
      });

      // Check if data has products property (new API format)
      const productList = data.products || data;

      // Ensure products is always an array
      if (Array.isArray(productList)) {
        console.log(`Loaded ${productList.length} products for admin panel`);
        setProducts(productList);
        setFilteredProducts(productList.slice(0, itemsPerPage));
        setTotalPages(Math.ceil(productList.length / itemsPerPage));
      } else {
        console.error('Products data is not an array:', productList);
        setProducts([]);
        setFilteredProducts([]);
        setError('Error loading products: Invalid data format');
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
      setLoading(false);
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };

        await axios.delete(`/api/products/${id}`, config);
        setSuccess(!success); // Toggle to trigger useEffect
        setLoading(false);
      } catch (error) {
        setError(
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        );
        setLoading(false);
      }
    }
  };

  const createProductHandler = () => {
    // Save current state before navigating
    saveCurrentState();
    navigate('/admin/product/new/edit');
  };

  // Save the current state to localStorage
  const saveCurrentState = () => {
    const state = {
      currentPage,
      itemsPerPage,
      searchTerm,
      selectedCategory,
      sortField,
      sortOrder,
      stockFilter,
      viewMode
    };
    localStorage.setItem('productListState', JSON.stringify(state));
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

  // Get stock status badge
  const getStockBadge = (countInStock) => {
    if (countInStock === 0) {
      return <Badge bg="danger">Out of Stock</Badge>;
    } else if (countInStock <= 10) {
      return <Badge bg="warning" text="dark">Low Stock ({countInStock})</Badge>;
    } else {
      return <Badge bg="success">In Stock ({countInStock})</Badge>;
    }
  };

  // Get category display with proper formatting
  const getCategoryDisplay = (category) => {
    if (!category) return 'Uncategorized';

    const parts = category.split('>').map(part => part.trim());

    if (parts.length === 1) {
      return <Badge bg="primary">{parts[0]}</Badge>;
    } else {
      return (
        <div className="d-flex flex-column">
          <Badge bg="primary" className="mb-1">{parts[0]}</Badge>
          {parts.slice(1).map((part, index) => (
            <Badge key={index} bg="info" className="mb-1">{part}</Badge>
          ))}
        </div>
      );
    }
  };



  return (
    <div className="admin-panel">
      <Row className="align-items-center mb-3">
        <Col md={6}>
          <h1>Products Management</h1>
          <p className="text-muted">
            {loading ? 'Loading products...' : `${products.length} products found`}
          </p>
        </Col>
        <Col md={6} className="text-end">
          <Button className="my-3" onClick={createProductHandler}>
            <FaPlus /> Create Product
          </Button>
        </Col>
      </Row>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : products.length === 0 ? (
        <Message>No products found.</Message>
      ) : (
        <>
          {/* Filters and Search Section */}
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <Row>
                <Col md={4}>
                  <InputGroup className="mb-3">
                    <InputGroup.Text>
                      <FaSearch />
                    </InputGroup.Text>
                    <Form.Control
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1); // Reset to first page on search
                      }}
                    />
                  </InputGroup>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Select
                      value={selectedCategory}
                      onChange={(e) => {
                        setSelectedCategory(e.target.value);
                        setCurrentPage(1); // Reset to first page on category change
                      }}
                    >
                      <option value="">All Categories</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Select
                      value={stockFilter}
                      onChange={(e) => {
                        setStockFilter(e.target.value);
                        setCurrentPage(1); // Reset to first page on stock filter change
                      }}
                    >
                      <option value="all">All Stock Levels</option>
                      <option value="inStock">In Stock (>10)</option>
                      <option value="lowStock">Low Stock (1-10)</option>
                      <option value="outOfStock">Out of Stock</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <div className="d-flex justify-content-end">
                    <Button
                      variant={viewMode === 'table' ? 'primary' : 'outline-primary'}
                      className="me-2"
                      onClick={() => setViewMode('table')}
                    >
                      <FaList />
                    </Button>
                    <Button
                      variant={viewMode === 'grid' ? 'primary' : 'outline-primary'}
                      onClick={() => setViewMode('grid')}
                    >
                      <FaTh />
                    </Button>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Table/Grid View Toggle */}
          <Tab.Container activeKey={viewMode}>
            <Tab.Content>
              {/* Table View */}
              <Tab.Pane eventKey="table">
                <Card className="shadow-sm">
                  <Card.Body className="p-0">
                    <Table responsive hover className="mb-0">
                      <thead className="bg-light">
                        <tr>
                          <th style={{ width: '60px' }}></th>
                          <th
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleSortChange('name')}
                            className="px-3"
                          >
                            NAME {sortField === 'name' && (
                              sortOrder === 'asc' ? <FaSortAmountUp size={12} /> : <FaSortAmountDown size={12} />
                            )}
                          </th>
                          <th
                            style={{ cursor: 'pointer', width: '120px' }}
                            onClick={() => handleSortChange('price')}
                            className="px-3"
                          >
                            PRICE {sortField === 'price' && (
                              sortOrder === 'asc' ? <FaSortAmountUp size={12} /> : <FaSortAmountDown size={12} />
                            )}
                          </th>
                          <th className="px-3" style={{ width: '150px' }}>CATEGORY</th>
                          <th
                            style={{ cursor: 'pointer', width: '120px' }}
                            onClick={() => handleSortChange('countInStock')}
                            className="px-3"
                          >
                            STOCK {sortField === 'countInStock' && (
                              sortOrder === 'asc' ? <FaSortAmountUp size={12} /> : <FaSortAmountDown size={12} />
                            )}
                          </th>
                          <th className="px-3" style={{ width: '120px' }}>ACTIONS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProducts.map((product) => (
                          <tr key={product._id}>
                            <td className="text-center">
                              <Image
                                src={product.imageUrl}
                                alt={product.name}
                                style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                thumbnail
                              />
                            </td>
                            <td className="px-3">
                              <div className="d-flex flex-column">
                                <strong>{product.name}</strong>
                                <small className="text-muted">ID: {product._id.substring(0, 8)}...</small>
                              </div>
                            </td>
                            <td className="px-3 product-price">₹{product.price.toLocaleString('en-IN')}</td>
                            <td className="px-3">{getCategoryDisplay(product.category)}</td>
                            <td className="px-3">{getStockBadge(product.countInStock)}</td>
                            <td className="px-3">
                              <div className="d-flex">
                                <LinkContainer to={`/product/${product._id}`}>
                                  <Button variant="outline-secondary" size="sm" className="me-1" title="View Product">
                                    <FaEye />
                                  </Button>
                                </LinkContainer>
                                <Button
                                  variant="outline-primary"
                                  size="sm"
                                  className="me-1"
                                  title="Edit Product"
                                  onClick={() => {
                                    saveCurrentState();
                                    navigate(`/admin/product/${product._id}/edit`);
                                  }}
                                >
                                  <FaEdit />
                                </Button>
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => deleteHandler(product._id)}
                                  title="Delete Product"
                                >
                                  <FaTrash />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Tab.Pane>

              {/* Grid View */}
              <Tab.Pane eventKey="grid">
                <Row>
                  {filteredProducts.map((product) => (
                    <Col key={product._id} sm={6} md={4} lg={3} className="mb-4">
                      <Card className="h-100 shadow-sm product-card admin-product-card">
                        <div className="position-relative">
                          <Card.Img
                            variant="top"
                            src={product.imageUrl}
                            style={{ height: '180px', objectFit: 'cover' }}
                          />
                          {product.countInStock === 0 && (
                            <div
                              className="position-absolute top-0 end-0 m-2"
                              style={{ zIndex: 1 }}
                            >
                              <Badge bg="danger">Out of Stock</Badge>
                            </div>
                          )}
                        </div>
                        <Card.Body className="d-flex flex-column">
                          <Card.Title className="mb-1" style={{ fontSize: '1rem' }}>
                            {product.name.length > 40
                              ? `${product.name.substring(0, 40)}...`
                              : product.name
                            }
                          </Card.Title>
                          <div className="mb-2">
                            {getCategoryDisplay(product.category)}
                          </div>
                          <Card.Text className="mb-2 product-price">
                            ₹{product.price.toLocaleString('en-IN')}
                          </Card.Text>
                          <Card.Text className="mb-2">
                            {getStockBadge(product.countInStock)}
                          </Card.Text>
                          <div className="mt-auto pt-2 border-top">
                            {/* View Product Button */}
                            <div className="d-grid gap-2 mb-2">
                              <LinkContainer to={`/product/${product._id}`}>
                                <Button variant="outline-secondary" size="sm">
                                  <FaEye className="me-1" /> View Product
                                </Button>
                              </LinkContainer>
                            </div>

                            {/* Edit and Delete Buttons */}
                            <div className="d-flex justify-content-between">
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => {
                                  saveCurrentState();
                                  navigate(`/admin/product/${product._id}/edit`);
                                }}
                              >
                                <FaEdit /> Edit
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => deleteHandler(product._id)}
                              >
                                <FaTrash /> Delete
                              </Button>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>

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

export default ProductListScreen;
