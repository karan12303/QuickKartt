import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Button, Card, Badge } from 'react-bootstrap';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { FaSearch, FaFilter, FaSort, FaTags } from 'react-icons/fa';
import { categories } from '../data/categories';

const SearchScreen = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('query') || '';
  const categoryParam = searchParams.get('category') || '';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000000 });
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [categoryLevel, setCategoryLevel] = useState(0);
  const [selectedMainCategory, setSelectedMainCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [filteredCategories, setFilteredCategories] = useState([]);

  // Fetch products based on search query or all products if no query
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let endpoint = query
          ? `/api/products/search?query=${query}`
          : '/api/products';

        const { data } = await axios.get(endpoint);

        // Check if data has products property (new API format)
        const productList = data.products || data;

        // Ensure products is always an array
        if (Array.isArray(productList)) {
          setProducts(productList);
          setFilteredProducts(productList);
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

    fetchProducts();
  }, [query]);

  // Initialize filtered categories
  useEffect(() => {
    setFilteredCategories(categories);

    // If category param exists, set up the category filters
    if (categoryParam) {
      // Check if it's a hierarchical category path
      if (categoryParam.includes('>')) {
        const categoryParts = categoryParam.split('>').map(part => part.trim());
        const mainCategoryName = categoryParts[0];

        // Find the main category
        const mainCategory = categories.find(cat => cat.name === mainCategoryName);
        if (mainCategory) {
          setSelectedMainCategory(mainCategory.id);
          setFilteredCategories(mainCategory.subcategories);
          setCategoryLevel(1);

          // If there's a subcategory
          if (categoryParts.length > 1) {
            const subCategoryName = categoryParts[1];
            const subCategory = mainCategory.subcategories.find(
              subcat => subcat.name === subCategoryName
            );

            if (subCategory) {
              setSelectedSubCategory(subCategory.id);
              if (subCategory.subcategories) {
                setFilteredCategories(subCategory.subcategories);
                setCategoryLevel(2);
              }
            }
          }
        }
      } else {
        // It's a simple category name
        const mainCategory = categories.find(cat => cat.name === categoryParam);
        if (mainCategory) {
          setSelectedMainCategory(mainCategory.id);
          setFilteredCategories(mainCategory.subcategories);
          setCategoryLevel(1);
        }
      }
    }
  }, [categoryParam]);

  // Apply filters and sorting
  useEffect(() => {
    if (products.length === 0) return;

    let filtered = [...products];

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(product => {
        // Check if product category contains the selected category at any level
        if (product.category.includes(selectedCategory)) {
          return true;
        }

        // Check if the selected category is a path
        if (selectedCategory.includes('>')) {
          const categoryParts = selectedCategory.split('>').map(part => part.trim());

          // Check if product category matches any part of the path
          for (const part of categoryParts) {
            if (product.category.includes(part)) {
              return true;
            }
          }

          // Check if product category is a more specific version of the selected category
          const mostSpecificCategory = categoryParts[categoryParts.length - 1];
          if (product.category.includes(mostSpecificCategory)) {
            return true;
          }
        }

        return false;
      });
    }

    // Apply price range filter
    filtered = filtered.filter(product =>
      product.price >= priceRange.min &&
      product.price <= priceRange.max
    );

    // Apply sorting
    if (sortOrder) {
      switch (sortOrder) {
        case 'price_asc':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price_desc':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'newest':
          filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        default:
          break;
      }
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, sortOrder, priceRange.min, priceRange.max]);

  // Handle price range change
  const handlePriceRangeChange = (e, type) => {
    const value = e.target.value;
    setPriceRange({
      ...priceRange,
      [type]: value === '' ? '' : Number(value)
    });
  };

  // Handle main category change
  const handleMainCategoryChange = (e) => {
    const value = e.target.value;
    setSelectedMainCategory(value);

    if (value) {
      const mainCategory = categories.find(cat => cat.id === value);
      if (mainCategory && mainCategory.subcategories) {
        setFilteredCategories(mainCategory.subcategories);
        setCategoryLevel(1);
        setSelectedSubCategory('');
        setSelectedCategory(mainCategory.name);
      }
    } else {
      setFilteredCategories(categories);
      setCategoryLevel(0);
      setSelectedSubCategory('');
      setSelectedCategory('');
    }
  };

  // Handle subcategory change
  const handleSubCategoryChange = (e) => {
    const value = e.target.value;
    setSelectedSubCategory(value);

    if (value) {
      const mainCategory = categories.find(cat => cat.id === selectedMainCategory);
      if (mainCategory) {
        const subCategory = mainCategory.subcategories.find(subcat => subcat.id === value);
        if (subCategory) {
          setSelectedCategory(`${mainCategory.name} > ${subCategory.name}`);
          if (subCategory.subcategories) {
            setFilteredCategories(subCategory.subcategories);
            setCategoryLevel(2);
          }
        }
      }
    } else {
      const mainCategory = categories.find(cat => cat.id === selectedMainCategory);
      if (mainCategory) {
        setSelectedCategory(mainCategory.name);
        setFilteredCategories(mainCategory.subcategories);
        setCategoryLevel(1);
      }
    }
  };

  // Handle sub-subcategory change
  const handleSubSubCategoryChange = (e) => {
    const value = e.target.value;

    if (value) {
      const mainCategory = categories.find(cat => cat.id === selectedMainCategory);
      if (mainCategory) {
        const subCategory = mainCategory.subcategories.find(subcat => subcat.id === selectedSubCategory);
        if (subCategory) {
          const subSubCategory = subCategory.subcategories.find(subsubcat => subsubcat.id === value);
          if (subSubCategory) {
            setSelectedCategory(`${mainCategory.name} > ${subCategory.name} > ${subSubCategory.name}`);
          }
        }
      }
    }
  };

  // Reset filters
  const resetFilters = () => {
    setSelectedCategory('');
    setSelectedMainCategory('');
    setSelectedSubCategory('');
    setCategoryLevel(0);
    setFilteredCategories(categories);
    setSortOrder('');
    setPriceRange({ min: 0, max: 1000000 });
  };

  return (
    <>
      <h1 className="mb-4">
        <FaSearch className="me-2" />
        {query ? `Search Results for "${query}"` : 'All Products'}
      </h1>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Row className="mb-4">
            <Col md={3}>
              <Card className="mb-4 shadow-sm">
                <Card.Header className="bg-light">
                  <h5 className="mb-0 d-flex align-items-center">
                    <FaFilter className="me-2" /> Filter Results
                  </h5>
                </Card.Header>
                <Card.Body>
                  <Form>
                    {/* Category Filter */}
                    <Form.Group className="mb-3">
                      <Form.Label className="d-flex align-items-center fw-semibold">
                        <FaTags className="me-2" /> Category
                      </Form.Label>

                      {/* Main Category */}
                      <Form.Select
                        value={selectedMainCategory}
                        onChange={handleMainCategoryChange}
                        aria-label="Select Main Category"
                        className="mb-2"
                      >
                        <option value="">All Categories</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </Form.Select>

                      {/* Subcategory - only show if a main category is selected */}
                      {categoryLevel >= 1 && (
                        <Form.Select
                          value={selectedSubCategory}
                          onChange={handleSubCategoryChange}
                          aria-label="Select Subcategory"
                          className="mb-2"
                        >
                          <option value="">All {categories.find(c => c.id === selectedMainCategory)?.name}</option>
                          {filteredCategories.map((subcat) => (
                            <option key={subcat.id} value={subcat.id}>
                              {subcat.name}
                            </option>
                          ))}
                        </Form.Select>
                      )}

                      {/* Sub-subcategory - only show if a subcategory is selected and it has sub-subcategories */}
                      {categoryLevel >= 2 && filteredCategories.length > 0 && (
                        <Form.Select
                          onChange={handleSubSubCategoryChange}
                          aria-label="Select Sub-subcategory"
                          className="mb-2"
                        >
                          <option value="">All {categories.find(c => c.id === selectedMainCategory)?.subcategories.find(s => s.id === selectedSubCategory)?.name}</option>
                          {filteredCategories.map((subsubcat) => (
                            <option key={subsubcat.id} value={subsubcat.id}>
                              {subsubcat.name}
                            </option>
                          ))}
                        </Form.Select>
                      )}

                      {/* Show selected category path */}
                      {selectedCategory && (
                        <div className="mt-2 mb-3">
                          <Badge bg="primary" className="p-2">
                            {selectedCategory} <span onClick={() => setSelectedCategory('')} style={{ cursor: 'pointer' }}>×</span>
                          </Badge>
                        </div>
                      )}
                    </Form.Group>

                    {/* Price Range */}
                    <Form.Group className="mb-3">
                      <Form.Label>Price Range (₹)</Form.Label>
                      <Row>
                        <Col>
                          <Form.Control
                            type="number"
                            placeholder="Min"
                            value={priceRange.min}
                            onChange={(e) => handlePriceRangeChange(e, 'min')}
                            min="0"
                          />
                        </Col>
                        <Col>
                          <Form.Control
                            type="number"
                            placeholder="Max"
                            value={priceRange.max}
                            onChange={(e) => handlePriceRangeChange(e, 'max')}
                            min="0"
                          />
                        </Col>
                      </Row>
                    </Form.Group>

                    {/* Sort Order */}
                    <Form.Group className="mb-3">
                      <Form.Label className="d-flex align-items-center">
                        <FaSort className="me-2" /> Sort By
                      </Form.Label>
                      <Form.Select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        aria-label="Sort Order"
                      >
                        <option value="">Default</option>
                        <option value="price_asc">Price: Low to High</option>
                        <option value="price_desc">Price: High to Low</option>
                        <option value="newest">Newest First</option>
                      </Form.Select>
                    </Form.Group>

                    {/* Reset Button */}
                    <Button
                      variant="outline-secondary"
                      onClick={resetFilters}
                      className="w-100 mt-2"
                    >
                      Reset Filters
                    </Button>
                  </Form>
                </Card.Body>
              </Card>

              {/* Back to Home */}
              <Link to="/" className="btn btn-outline-primary w-100">
                Back to Home
              </Link>
            </Col>

            <Col md={9}>
              {filteredProducts.length === 0 ? (
                <Message>
                  {query
                    ? `No products found matching "${query}". Try a different search term or check your filters.`
                    : 'No products found. Please check your filters or try again later.'}
                </Message>
              ) : (
                <>
                  <Row className="mb-3">
                    <Col>
                      <h5>
                        {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'} Found
                      </h5>
                    </Col>
                  </Row>

                  <Row className="g-4">
                    {filteredProducts.map((product) => (
                      <Col key={product._id} sm={12} md={6} lg={4} xl={4} className="mb-4">
                        <Product product={product} />
                      </Col>
                    ))}
                  </Row>
                </>
              )}
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default SearchScreen;
