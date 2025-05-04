import React, { useState, useEffect, useContext } from 'react';
import { Form, Button, Row, Col, Card, Badge } from 'react-bootstrap';
import { FaFilter, FaSort, FaTags, FaPalette, FaStar, FaPercentage, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { categories } from '../data/categories';
import { ThemeContext } from '../context/ThemeContext';
import './ProductFilter.css';

const ProductFilter = ({
  selectedCategory,
  setSelectedCategory,
  sortOrder,
  setSortOrder,
  priceRange,
  setPriceRange,
  applyFilters
}) => {
  // Get dark mode state from context
  const { darkMode } = useContext(ThemeContext);

  // Default price range
  const defaultPriceRange = { min: 0, max: 1000000 };

  // Additional filter states
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [discountFilter, setDiscountFilter] = useState(0);
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [expandedFilters, setExpandedFilters] = useState(false);
  const [categoryLevel, setCategoryLevel] = useState(0);
  const [selectedMainCategory, setSelectedMainCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);

  // Available colors for filter
  const availableColors = [
    { name: 'Black', code: '#000000' },
    { name: 'White', code: '#FFFFFF' },
    { name: 'Red', code: '#FF0000' },
    { name: 'Blue', code: '#0000FF' },
    { name: 'Green', code: '#00FF00' },
    { name: 'Yellow', code: '#FFFF00' },
    { name: 'Purple', code: '#800080' },
    { name: 'Pink', code: '#FFC0CB' },
    { name: 'Gray', code: '#808080' },
    { name: 'Brown', code: '#A52A2A' }
  ];

  // Available ratings for filter
  const availableRatings = [4, 3, 2, 1];

  // Available brands for filter
  const availableBrands = [
    'Apple', 'Samsung', 'Nike', 'Adidas', 'Puma', 'Sony',
    'LG', 'Lenovo', 'HP', 'Dell', 'Asus', 'Xiaomi',
    'OnePlus', 'Levi\'s', 'H&M', 'Zara', 'Titan', 'Casio'
  ];

  // Available materials for filter
  const availableMaterials = [
    'Cotton', 'Polyester', 'Leather', 'Denim', 'Wool',
    'Silk', 'Nylon', 'Linen', 'Canvas', 'Suede',
    'Metal', 'Plastic', 'Glass', 'Wood', 'Ceramic'
  ];

  // Initialize filtered categories
  useEffect(() => {
    setFilteredCategories(categories);
  }, []);

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

  // Handle sort order change
  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  // Handle price range change
  const handlePriceRangeChange = (value, type) => {
    // Ensure min is not greater than max
    if (type === 'min' && value > priceRange.max) {
      value = priceRange.max;
    }
    // Ensure max is not less than min
    if (type === 'max' && value < priceRange.min) {
      value = priceRange.min;
    }

    // Ensure values are not negative
    if (value < 0) {
      value = 0;
    }

    // Update price range
    setPriceRange({
      ...priceRange,
      [type]: value
    });

    console.log(`Price range updated: ${type} = ${value}`);
  };

  // Handle price range change directly
  // No slider range component is being used

  // Handle color selection
  const handleColorChange = (color) => {
    if (selectedColors.includes(color)) {
      setSelectedColors(selectedColors.filter(c => c !== color));
    } else {
      setSelectedColors([...selectedColors, color]);
    }
  };

  // Handle rating selection
  const handleRatingChange = (rating) => {
    if (selectedRatings.includes(rating)) {
      setSelectedRatings(selectedRatings.filter(r => r !== rating));
    } else {
      setSelectedRatings([...selectedRatings, rating]);
    }
  };

  // Handle discount filter change
  const handleDiscountChange = (value) => {
    setDiscountFilter(value);
  };

  // Handle availability filter change
  const handleAvailabilityChange = (e) => {
    setAvailabilityFilter(e.target.value);
  };

  // Handle brand selection
  const handleBrandChange = (brand) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter(b => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  // Handle material selection
  const handleMaterialChange = (material) => {
    if (selectedMaterials.includes(material)) {
      setSelectedMaterials(selectedMaterials.filter(m => m !== material));
    } else {
      setSelectedMaterials([...selectedMaterials, material]);
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedCategory('');
    setSelectedMainCategory('');
    setSelectedSubCategory('');
    setCategoryLevel(0);
    setFilteredCategories(categories);
    setSortOrder('');
    setPriceRange(defaultPriceRange);
    setSelectedColors([]);
    setSelectedRatings([]);
    setDiscountFilter(0);
    setAvailabilityFilter('all');
    setSelectedBrands([]);
    setSelectedMaterials([]);
    applyFilters();
  };

  // Toggle expanded filters
  const toggleExpandedFilters = () => {
    setExpandedFilters(!expandedFilters);
  };

  return (
    <Card className="mb-4 shadow-sm filter-card">
      <Card.Header className={`${darkMode ? 'bg-dark' : 'bg-light'} d-flex justify-content-between align-items-center`}>
        <h5 className="mb-0 d-flex align-items-center" style={{ color: darkMode ? 'var(--white)' : 'inherit' }}>
          <FaFilter className="me-2" /> Filter Products
        </h5>
        <Button
          variant="link"
          className={`p-0 ${darkMode ? 'text-white' : 'text-dark'}`}
          onClick={toggleExpandedFilters}
          aria-label="Toggle advanced filters"
        >
          {expandedFilters ? <FaChevronUp /> : <FaChevronDown />}
        </Button>
      </Card.Header>
      <Card.Body>
        <Form>
          {/* Category Filter */}
          <Form.Group className="mb-3">
            <Form.Label className="d-flex align-items-center fw-semibold" style={{ color: darkMode ? 'var(--white)' : 'inherit' }}>
              <FaTags className="me-2" /> Category
            </Form.Label>

            {/* Main Category */}
            <Form.Select
              value={selectedMainCategory}
              onChange={handleMainCategoryChange}
              aria-label="Select Main Category"
              className="border-0 shadow-sm mb-2"
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
                className="border-0 shadow-sm mb-2"
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
                className="border-0 shadow-sm"
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
              <div className="mt-2">
                <Badge bg="primary" className="p-2">
                  {selectedCategory} <span onClick={resetFilters} style={{ cursor: 'pointer' }}>×</span>
                </Badge>
              </div>
            )}
          </Form.Group>

          {/* Sort Order */}
          <Form.Group className="mb-3">
            <Form.Label className="d-flex align-items-center fw-semibold" style={{ color: darkMode ? 'var(--white)' : 'inherit' }}>
              <FaSort className="me-2" /> Sort By
            </Form.Label>
            <Form.Select
              value={sortOrder}
              onChange={handleSortChange}
              aria-label="Sort Order"
              className="border-0 shadow-sm"
            >
              <option value="">Default</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="newest">Newest First</option>
            </Form.Select>
          </Form.Group>

          {/* Price Range Slider */}
          <Form.Group className="mb-4">
            <Form.Label className="d-flex align-items-center fw-semibold" style={{ color: darkMode ? 'var(--white)' : 'inherit' }}>
              Price Range (₹)
            </Form.Label>
            <div className="px-2">
              <div className="d-flex justify-content-between mb-2 price-range-values">
                <span className={darkMode ? 'text-light' : 'text-muted'}>₹{priceRange.min.toLocaleString()}</span>
                <span className={darkMode ? 'text-light' : 'text-muted'}>₹{priceRange.max.toLocaleString()}</span>
              </div>

              {/* Min Price Slider */}
              <div className="mb-2">
                <small className={darkMode ? 'text-light' : 'text-muted'}>Min Price</small>
                <Form.Range
                  min={0}
                  max={1000000}
                  step={5000}
                  value={priceRange.min}
                  onChange={(e) => handlePriceRangeChange(Number(e.target.value), 'min')}
                  className="mb-2"
                />
              </div>

              {/* Max Price Slider */}
              <div className="mb-3">
                <small className={darkMode ? 'text-light' : 'text-muted'}>Max Price</small>
                <Form.Range
                  min={0}
                  max={1000000}
                  step={5000}
                  value={priceRange.max}
                  onChange={(e) => handlePriceRangeChange(Number(e.target.value), 'max')}
                  className="mb-2"
                />
              </div>

              <Row>
                <Col>
                  <Form.Control
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => handlePriceRangeChange(Number(e.target.value), 'min')}
                    min="0"
                    max={priceRange.max}
                    className="border-0 shadow-sm"
                    size="sm"
                  />
                </Col>
                <Col>
                  <Form.Control
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => handlePriceRangeChange(Number(e.target.value), 'max')}
                    min={priceRange.min}
                    className="border-0 shadow-sm"
                    size="sm"
                  />
                </Col>
              </Row>
            </div>
          </Form.Group>

          {/* Advanced Filters - Only show when expanded */}
          {expandedFilters && (
            <>
              {/* Color Filter */}
              <Form.Group className="mb-4">
                <Form.Label className="d-flex align-items-center fw-semibold">
                  <FaPalette className="me-2" /> Color
                </Form.Label>
                <div className="d-flex flex-wrap">
                  {availableColors.map((color, index) => (
                    <div
                      key={index}
                      onClick={() => handleColorChange(color.name)}
                      className={`color-option me-2 mb-2 ${selectedColors.includes(color.name) ? 'selected' : ''}`}
                      style={{
                        backgroundColor: color.code,
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        border: color.name === 'White' ? '1px solid #ddd' : 'none',
                        position: 'relative',
                        boxShadow: selectedColors.includes(color.name)
                          ? '0 0 0 2px var(--primary)'
                          : '0 0 0 1px rgba(0,0,0,0.1)'
                      }}
                      title={color.name}
                    >
                      {selectedColors.includes(color.name) && (
                        <span
                          style={{
                            position: 'absolute',
                            top: '-5px',
                            right: '-5px',
                            backgroundColor: 'var(--primary)',
                            color: 'white',
                            borderRadius: '50%',
                            width: '16px',
                            height: '16px',
                            fontSize: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          ✓
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                {selectedColors.length > 0 && (
                  <div className="mt-2">
                    <small className="text-muted">Selected: </small>
                    {selectedColors.map((color, index) => (
                      <Badge
                        key={index}
                        bg="light"
                        text="dark"
                        className="me-1 mb-1"
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleColorChange(color)}
                      >
                        {color} ×
                      </Badge>
                    ))}
                  </div>
                )}
              </Form.Group>

              {/* Rating Filter */}
              <Form.Group className="mb-4">
                <Form.Label className="d-flex align-items-center fw-semibold">
                  <FaStar className="me-2" /> Rating
                </Form.Label>
                {availableRatings.map((rating) => (
                  <Form.Check
                    key={rating}
                    type="checkbox"
                    id={`rating-${rating}`}
                    label={
                      <div className="d-flex align-items-center">
                        {[...Array(rating)].map((_, i) => (
                          <FaStar key={i} className="text-warning me-1" />
                        ))}
                        {[...Array(5 - rating)].map((_, i) => (
                          <FaStar key={i} className="text-muted me-1" style={{ opacity: 0.3 }} />
                        ))}
                        <span className="ms-1">& Up</span>
                      </div>
                    }
                    checked={selectedRatings.includes(rating)}
                    onChange={() => handleRatingChange(rating)}
                    className="mb-2"
                  />
                ))}
              </Form.Group>

              {/* Discount Filter */}
              <Form.Group className="mb-4">
                <Form.Label className="d-flex align-items-center fw-semibold">
                  <FaPercentage className="me-2" /> Discount
                </Form.Label>
                <Form.Range
                  min={0}
                  max={80}
                  step={10}
                  value={discountFilter}
                  onChange={(e) => handleDiscountChange(Number(e.target.value))}
                  className="mb-2"
                />
                <div className="d-flex justify-content-between">
                  <small className="text-muted">0%</small>
                  <small className="text-primary fw-bold">{discountFilter}% & Above</small>
                  <small className="text-muted">80%</small>
                </div>
              </Form.Group>

              {/* Brand Filter */}
              <Form.Group className="mb-4">
                <Form.Label className="d-flex align-items-center fw-semibold">
                  <i className="fas fa-tag me-2"></i> Brand
                </Form.Label>
                <div className="brand-filter-container" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                  {availableBrands.map((brand, index) => (
                    <Form.Check
                      key={index}
                      type="checkbox"
                      id={`brand-${index}`}
                      label={brand}
                      checked={selectedBrands.includes(brand)}
                      onChange={() => handleBrandChange(brand)}
                      className="mb-2"
                    />
                  ))}
                </div>
                {selectedBrands.length > 0 && (
                  <div className="mt-2">
                    <small className="text-muted">Selected: </small>
                    {selectedBrands.map((brand, index) => (
                      <Badge
                        key={index}
                        bg="light"
                        text="dark"
                        className="me-1 mb-1"
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleBrandChange(brand)}
                      >
                        {brand} ×
                      </Badge>
                    ))}
                  </div>
                )}
              </Form.Group>

              {/* Material Filter */}
              <Form.Group className="mb-4">
                <Form.Label className="d-flex align-items-center fw-semibold">
                  <i className="fas fa-tshirt me-2"></i> Material
                </Form.Label>
                <div className="material-filter-container" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                  {availableMaterials.map((material, index) => (
                    <Form.Check
                      key={index}
                      type="checkbox"
                      id={`material-${index}`}
                      label={material}
                      checked={selectedMaterials.includes(material)}
                      onChange={() => handleMaterialChange(material)}
                      className="mb-2"
                    />
                  ))}
                </div>
                {selectedMaterials.length > 0 && (
                  <div className="mt-2">
                    <small className="text-muted">Selected: </small>
                    {selectedMaterials.map((material, index) => (
                      <Badge
                        key={index}
                        bg="light"
                        text="dark"
                        className="me-1 mb-1"
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleMaterialChange(material)}
                      >
                        {material} ×
                      </Badge>
                    ))}
                  </div>
                )}
              </Form.Group>

              {/* Availability Filter */}
              <Form.Group className="mb-4">
                <Form.Label className="fw-semibold">Availability</Form.Label>
                <div>
                  <Form.Check
                    type="radio"
                    id="availability-all"
                    name="availability"
                    label="All Items"
                    value="all"
                    checked={availabilityFilter === 'all'}
                    onChange={handleAvailabilityChange}
                    className="mb-2"
                  />
                  <Form.Check
                    type="radio"
                    id="availability-in-stock"
                    name="availability"
                    label="In Stock Only"
                    value="in-stock"
                    checked={availabilityFilter === 'in-stock'}
                    onChange={handleAvailabilityChange}
                    className="mb-2"
                  />
                </div>
              </Form.Group>
            </>
          )}

          {/* Show More/Less Filters Button */}
          <Button
            variant="link"
            className="text-decoration-none p-0 mb-3 d-block w-100 text-center"
            onClick={toggleExpandedFilters}
          >
            {expandedFilters ? (
              <>Show Less Filters <FaChevronUp className="ms-1" /></>
            ) : (
              <>Show More Filters <FaChevronDown className="ms-1" /></>
            )}
          </Button>

          {/* Action Buttons */}
          <div className="d-grid gap-2">
            <Button
              variant="primary"
              onClick={applyFilters}
              className="mt-2 filter-action-btn"
              style={{
                background: 'linear-gradient(to right, #FF6B00, #FF8C00)',
                border: 'none',
                padding: '0.6rem 1rem'
              }}
            >
              <FaFilter className="me-2" /> Apply Filters
            </Button>
            <Button
              variant="outline-secondary"
              onClick={resetFilters}
              className="mt-2 filter-action-btn"
            >
              Reset All Filters
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default ProductFilter;
