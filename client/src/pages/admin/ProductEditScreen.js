import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import FormContainer from '../../components/FormContainer';
import { categories, flatCategories } from '../../data/categories';

const ProductEditScreen = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { userInfo } = useContext(AuthContext);

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [imageUrl, setImageUrl] = useState('');
  const [additionalImages, setAdditionalImages] = useState([]);
  const [additionalImageInput, setAdditionalImageInput] = useState('');

  // Category state management
  const [category, setCategory] = useState(''); // Final combined category path
  const [mainCategory, setMainCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [subSubCategory, setSubSubCategory] = useState('');
  const [availableSubcategories, setAvailableSubcategories] = useState([]);
  const [availableSubSubcategories, setAvailableSubSubcategories] = useState([]);

  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Variation states
  const [hasVariations, setHasVariations] = useState(false);
  const [footwearSizes, setFootwearSizes] = useState([]);
  const [smartphoneSpecs, setSmartphoneSpecs] = useState([]);

  // New footwear size input states
  const [newFootwearUkSize, setNewFootwearUkSize] = useState('');
  const [newFootwearUsSize, setNewFootwearUsSize] = useState('');
  const [newFootwearSizeStock, setNewFootwearSizeStock] = useState(0);

  // New smartphone spec input states
  const [newSmartphoneModel, setNewSmartphoneModel] = useState('');
  const [newSmartphoneStorage, setNewSmartphoneStorage] = useState('');
  const [newSmartphoneRam, setNewSmartphoneRam] = useState('');
  const [newSmartphoneSpecStock, setNewSmartphoneSpecStock] = useState(0);

  const isNewProduct = id === 'new';

  useEffect(() => {
    if (!userInfo || userInfo.role !== 'admin') {
      navigate('/login');
    } else if (!isNewProduct) {
      const fetchProduct = async () => {
        try {
          setLoading(true);
          const { data } = await axios.get(`/api/products/${id}`);
          setName(data.name);
          setPrice(data.price);
          setImageUrl(data.imageUrl);
          setAdditionalImages(data.additionalImages || []);

          // Parse category path
          setCategory(data.category);

          // Split category path into parts if it contains '>'
          if (data.category && data.category.includes('>')) {
            const categoryParts = data.category.split('>').map(part => part.trim());

            // Set main category
            setMainCategory(categoryParts[0]);

            // Find the main category object
            const mainCat = categories.find(cat => cat.name === categoryParts[0]);
            if (mainCat && mainCat.subcategories) {
              setAvailableSubcategories(mainCat.subcategories);

              // Set subcategory if it exists
              if (categoryParts.length > 1) {
                setSubCategory(categoryParts[1]);

                // Find subcategory object
                const subCat = mainCat.subcategories.find(sub => sub.name === categoryParts[1]);
                if (subCat && subCat.subcategories) {
                  setAvailableSubSubcategories(subCat.subcategories);

                  // Set sub-subcategory if it exists
                  if (categoryParts.length > 2) {
                    setSubSubCategory(categoryParts[2]);
                  }
                }
              }
            }
          } else {
            // Single category
            setMainCategory(data.category);

            // Find the main category object
            const mainCat = categories.find(cat => cat.name === data.category);
            if (mainCat && mainCat.subcategories) {
              setAvailableSubcategories(mainCat.subcategories);
            }
          }

          setCountInStock(data.countInStock);
          setDescription(data.description);

          // Load variations if they exist
          if (data.hasVariations) {
            setHasVariations(true);

            if (data.footwearSizes && data.footwearSizes.length > 0) {
              setFootwearSizes(data.footwearSizes);
            }

            if (data.smartphoneSpecs && data.smartphoneSpecs.length > 0) {
              setSmartphoneSpecs(data.smartphoneSpecs);
            }
          }

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

      fetchProduct();
    }
  }, [navigate, userInfo, id, isNewProduct]);

  // Add an additional image
  const addAdditionalImage = () => {
    if (additionalImageInput.trim() !== '') {
      setAdditionalImages([...additionalImages, additionalImageInput.trim()]);
      setAdditionalImageInput('');
    }
  };

  // Remove an additional image
  const removeAdditionalImage = (index) => {
    const updatedImages = [...additionalImages];
    updatedImages.splice(index, 1);
    setAdditionalImages(updatedImages);
  };

  // Add a new footwear size
  const addFootwearSize = () => {
    if (newFootwearUkSize.trim() !== '' && newFootwearUsSize.trim() !== '') {
      const newSize = {
        ukSize: newFootwearUkSize.trim(),
        usSize: newFootwearUsSize.trim(),
        countInStock: Number(newFootwearSizeStock)
      };

      setFootwearSizes([...footwearSizes, newSize]);
      setNewFootwearUkSize('');
      setNewFootwearUsSize('');
      setNewFootwearSizeStock(0);
    }
  };

  // Remove a footwear size
  const removeFootwearSize = (index) => {
    const updatedSizes = [...footwearSizes];
    updatedSizes.splice(index, 1);
    setFootwearSizes(updatedSizes);
  };

  // Add a new smartphone spec
  const addSmartphoneSpec = () => {
    if (newSmartphoneModel.trim() !== '' && newSmartphoneStorage.trim() !== '' && newSmartphoneRam.trim() !== '') {
      // Ensure stock is a valid number
      const stockValue = Number(newSmartphoneSpecStock) || 0;

      const newSpec = {
        model: newSmartphoneModel.trim(),
        storage: newSmartphoneStorage.trim(),
        ram: newSmartphoneRam.trim(),
        countInStock: stockValue
      };

      console.log('Adding new smartphone spec:', newSpec);

      // Update the state with the new spec
      const updatedSpecs = [...smartphoneSpecs, newSpec];
      setSmartphoneSpecs(updatedSpecs);

      // Reset input fields
      setNewSmartphoneModel('');
      setNewSmartphoneStorage('');
      setNewSmartphoneRam('');
      setNewSmartphoneSpecStock(0);

      console.log('Updated smartphone specs:', updatedSpecs);
    }
  };

  // Remove a smartphone spec
  const removeSmartphoneSpec = (index) => {
    const updatedSpecs = [...smartphoneSpecs];
    updatedSpecs.splice(index, 1);
    setSmartphoneSpecs(updatedSpecs);
  };

  // Handle main category change
  const handleMainCategoryChange = (e) => {
    const selectedMainCategory = e.target.value;
    setMainCategory(selectedMainCategory);

    // Reset subcategory and sub-subcategory
    setSubCategory('');
    setSubSubCategory('');
    setAvailableSubSubcategories([]);

    // Find the selected main category object
    const mainCat = categories.find(cat => cat.name === selectedMainCategory);

    // Update available subcategories
    if (mainCat && mainCat.subcategories) {
      setAvailableSubcategories(mainCat.subcategories);
    } else {
      setAvailableSubcategories([]);
    }

    // Update the full category path
    updateCategoryPath(selectedMainCategory, '', '');

    // Check for special variation categories
    checkForVariations(selectedMainCategory);
  };

  // Handle subcategory change
  const handleSubCategoryChange = (e) => {
    const selectedSubCategory = e.target.value;
    setSubCategory(selectedSubCategory);

    // Reset sub-subcategory
    setSubSubCategory('');

    // Find the selected subcategory object
    const mainCat = categories.find(cat => cat.name === mainCategory);
    if (mainCat && mainCat.subcategories) {
      const subCat = mainCat.subcategories.find(sub => sub.name === selectedSubCategory);

      // Update available sub-subcategories
      if (subCat && subCat.subcategories) {
        setAvailableSubSubcategories(subCat.subcategories);
      } else {
        setAvailableSubSubcategories([]);
      }
    }

    // Update the full category path
    updateCategoryPath(mainCategory, selectedSubCategory, '');

    // Check for special variation categories
    checkForVariations(mainCategory, selectedSubCategory);
  };

  // Handle sub-subcategory change
  const handleSubSubCategoryChange = (e) => {
    const selectedSubSubCategory = e.target.value;
    setSubSubCategory(selectedSubSubCategory);

    // Update the full category path
    updateCategoryPath(mainCategory, subCategory, selectedSubSubCategory);

    // Check for special variation categories
    checkForVariations(mainCategory, subCategory, selectedSubSubCategory);
  };

  // Update the full category path
  const updateCategoryPath = (main, sub, subSub) => {
    let fullPath = main;

    if (sub) {
      fullPath += ` > ${sub}`;

      if (subSub) {
        fullPath += ` > ${subSub}`;
      }
    }

    setCategory(fullPath);
  };

  // Check if the selected category should enable variations
  const checkForVariations = (main, sub = '', subSub = '') => {
    // Build the full path for checking
    let fullPath = main;
    if (sub) fullPath += ` > ${sub}`;
    if (subSub) fullPath += ` > ${subSub}`;

    console.log('Checking variations for category path:', fullPath);

    // Check if the path contains special variation categories
    const hasFootwear =
      main === 'Footwear' ||
      sub === 'Footwear' ||
      subSub === 'Footwear' ||
      fullPath.includes('Footwear');

    const hasSmartphone =
      main === 'Smartphone' ||
      sub === 'Smartphone' ||
      subSub === 'Smartphone' ||
      fullPath.includes('Smartphone') ||
      main === 'Electronics' || // Add Electronics as it might contain smartphones
      fullPath.includes('Mobile');

    console.log('Has Footwear:', hasFootwear);
    console.log('Has Smartphone:', hasSmartphone);

    // Enable variations for Footwear and Smartphone categories
    if (hasFootwear || hasSmartphone) {
      setHasVariations(true);
      console.log('Setting hasVariations to true');

      // Reset the other variation type
      if (hasFootwear) {
        setSmartphoneSpecs([]);
        console.log('Resetting smartphone specs');
      } else if (hasSmartphone) {
        setFootwearSizes([]);
        console.log('Resetting footwear sizes');
      }
    } else {
      setHasVariations(false);
      setFootwearSizes([]);
      setSmartphoneSpecs([]);
      console.log('Setting hasVariations to false and resetting all variations');
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      // Calculate total stock from variations if they exist
      let totalStock = countInStock;

      // Determine if this is a smartphone product
      const isSmartphoneProduct =
        category === 'Smartphone' ||
        category.includes('Smartphone') ||
        mainCategory === 'Electronics' ||
        category.includes('Mobile');

      // Determine if this is a footwear product
      const isFootwearProduct =
        category === 'Footwear' ||
        category.includes('Footwear');

      if (hasVariations) {
        if (isFootwearProduct && footwearSizes.length > 0) {
          totalStock = footwearSizes.reduce((total, size) => total + Number(size.countInStock), 0);
          console.log('Calculated footwear total stock:', totalStock);
        } else if (isSmartphoneProduct && smartphoneSpecs.length > 0) {
          totalStock = smartphoneSpecs.reduce((total, spec) => total + Number(spec.countInStock), 0);
          console.log('Calculated smartphone total stock:', totalStock);
        }
      }

      console.log('Is smartphone product:', isSmartphoneProduct);
      console.log('Is footwear product:', isFootwearProduct);
      console.log('Smartphone specs to save:', isSmartphoneProduct ? smartphoneSpecs : []);

      const productData = {
        name,
        price,
        imageUrl,
        additionalImages,
        category,
        countInStock: totalStock,
        description,
        hasVariations,
        footwearSizes: isFootwearProduct ? footwearSizes : [],
        smartphoneSpecs: isSmartphoneProduct ? smartphoneSpecs : [],
      };

      if (isNewProduct) {
        await axios.post('/api/products', productData, config);
      } else {
        await axios.put(`/api/products/${id}`, productData, config);
      }

      setSuccess(true);
      setLoading(false);

      // Get the current page and filters from localStorage if they exist
      const savedState = localStorage.getItem('productListState');

      setTimeout(() => {
        if (savedState) {
          // Navigate back to product list with the saved state
          navigate('/admin/productlist', { state: { returnToSavedState: true } });
        } else {
          // Navigate back to product list without state
          navigate('/admin/productlist');
        }
      }, 2000);
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
      setLoading(false);
    }
  };

  return (
    <>
      <Link to="/admin/productlist" className="btn btn-light my-3">
        Go Back
      </Link>
      <FormContainer>
        <h1>{isNewProduct ? 'Create Product' : 'Edit Product'}</h1>
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : success ? (
          <Message variant="success">
            Product {isNewProduct ? 'created' : 'updated'} successfully!
          </Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name" className="my-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="price" className="my-3">
              <Form.Label>Price (₹)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="imageUrl" className="my-3">
              <Form.Label>Main Image URL</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter main image URL"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                required
              />
              {imageUrl && (
                <div className="mt-2">
                  <img
                    src={imageUrl}
                    alt="Product preview"
                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                    className="border"
                  />
                </div>
              )}
            </Form.Group>

            <Form.Group controlId="additionalImages" className="my-3">
              <Form.Label>Additional Images</Form.Label>
              <div className="d-flex">
                <Form.Control
                  type="text"
                  placeholder="Enter additional image URL"
                  value={additionalImageInput}
                  onChange={(e) => setAdditionalImageInput(e.target.value)}
                  className="me-2"
                />
                <Button
                  variant="outline-secondary"
                  onClick={addAdditionalImage}
                  disabled={!additionalImageInput.trim()}
                >
                  Add
                </Button>
              </div>

              {additionalImages.length > 0 && (
                <div className="mt-3">
                  <p>Additional Images:</p>
                  <div className="d-flex flex-wrap">
                    {additionalImages.map((img, index) => (
                      <div key={index} className="position-relative me-2 mb-2">
                        <img
                          src={img}
                          alt={`Additional ${index + 1}`}
                          style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                          className="border"
                        />
                        <Button
                          variant="danger"
                          size="sm"
                          className="position-absolute top-0 end-0"
                          onClick={() => removeAdditionalImage(index)}
                          style={{ fontSize: '0.7rem', padding: '0.1rem 0.3rem' }}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Form.Group>

            <div className="border p-3 rounded mb-4">
              <h5 className="mb-3">Product Category</h5>

              {/* Main Category Selection */}
              <Form.Group controlId="mainCategory" className="mb-3">
                <Form.Label>Main Category</Form.Label>
                <Form.Select
                  value={mainCategory}
                  onChange={handleMainCategoryChange}
                  required
                >
                  <option value="">Select Main Category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              {/* Subcategory Selection - Only show if main category is selected */}
              {availableSubcategories.length > 0 && (
                <Form.Group controlId="subCategory" className="mb-3">
                  <Form.Label>Subcategory</Form.Label>
                  <Form.Select
                    value={subCategory}
                    onChange={handleSubCategoryChange}
                  >
                    <option value="">Select Subcategory</option>
                    {availableSubcategories.map(subcat => (
                      <option key={subcat.id} value={subcat.name}>
                        {subcat.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              )}

              {/* Sub-subcategory Selection - Only show if subcategory is selected */}
              {availableSubSubcategories.length > 0 && (
                <Form.Group controlId="subSubCategory" className="mb-3">
                  <Form.Label>Detailed Category</Form.Label>
                  <Form.Select
                    value={subSubCategory}
                    onChange={handleSubSubCategoryChange}
                  >
                    <option value="">Select Detailed Category</option>
                    {availableSubSubcategories.map(subsubcat => (
                      <option key={subsubcat.id} value={subsubcat.name}>
                        {subsubcat.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              )}

              {/* Display the full category path */}
              {category && (
                <div className="mt-3">
                  <Form.Label>Selected Category Path:</Form.Label>
                  <div className="p-2 bg-light rounded">
                    <strong>{category}</strong>
                  </div>
                </div>
              )}
            </div>

            {/* Show stock input only for non-variation products */}
            {!hasVariations && (
              <Form.Group controlId="countInStock" className="my-3">
                <Form.Label>Count In Stock</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter count in stock"
                  value={countInStock}
                  onChange={(e) => setCountInStock(e.target.value)}
                  required={!hasVariations}
                ></Form.Control>
              </Form.Group>
            )}

            {/* Footwear Size Variations */}
            {hasVariations &&
              (mainCategory === 'Footwear' ||
              subCategory === 'Footwear' ||
              subSubCategory === 'Footwear' ||
              category.includes('Footwear')) && (
              <Form.Group className="my-4">
                <Form.Label className="fw-bold">Footwear Sizes for {category}</Form.Label>
                <div className="border p-3 rounded mb-3">
                  <div className="row mb-2">
                    <div className="col">
                      <Form.Label>UK Size</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="UK Size (e.g., 8)"
                        value={newFootwearUkSize}
                        onChange={(e) => setNewFootwearUkSize(e.target.value)}
                      />
                    </div>
                    <div className="col">
                      <Form.Label>US Size</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="US Size (e.g., 9)"
                        value={newFootwearUsSize}
                        onChange={(e) => setNewFootwearUsSize(e.target.value)}
                      />
                    </div>
                    <div className="col">
                      <Form.Label>Stock</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Stock"
                        value={newFootwearSizeStock}
                        onChange={(e) => setNewFootwearSizeStock(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button
                    variant="outline-primary"
                    onClick={addFootwearSize}
                    disabled={!newFootwearUkSize.trim() || !newFootwearUsSize.trim()}
                  >
                    Add Size
                  </Button>
                </div>

                {footwearSizes.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-bordered table-sm">
                      <thead className="table-light">
                        <tr>
                          <th>UK Size</th>
                          <th>US Size</th>
                          <th>Stock</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {footwearSizes.map((size, index) => (
                          <tr key={index}>
                            <td>{size.ukSize}</td>
                            <td>{size.usSize}</td>
                            <td>{size.countInStock}</td>
                            <td>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => removeFootwearSize(index)}
                              >
                                Remove
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-muted">No sizes added yet. Add sizes above.</p>
                )}
              </Form.Group>
            )}

            {/* Smartphone Specifications */}
            {hasVariations &&
              (mainCategory === 'Smartphone' ||
              subCategory === 'Smartphone' ||
              subSubCategory === 'Smartphone' ||
              category.includes('Smartphone') ||
              mainCategory === 'Electronics' ||
              category.includes('Mobile')) && (
              <Form.Group className="my-4">
                <Form.Label className="fw-bold">Smartphone Specifications for {category}</Form.Label>
                <div className="border p-3 rounded mb-3">
                  <div className="row mb-2">
                    <div className="col">
                      <Form.Label>Model</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Model (e.g., iPhone 14 Pro)"
                        value={newSmartphoneModel}
                        onChange={(e) => setNewSmartphoneModel(e.target.value)}
                      />
                    </div>
                    <div className="col">
                      <Form.Label>Storage</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Storage (e.g., 128GB)"
                        value={newSmartphoneStorage}
                        onChange={(e) => setNewSmartphoneStorage(e.target.value)}
                      />
                    </div>
                    <div className="col">
                      <Form.Label>RAM</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="RAM (e.g., 8GB)"
                        value={newSmartphoneRam}
                        onChange={(e) => setNewSmartphoneRam(e.target.value)}
                      />
                    </div>
                    <div className="col">
                      <Form.Label>Stock</Form.Label>
                      <Form.Control
                        type="number"
                        min="0"
                        placeholder="Stock"
                        value={newSmartphoneSpecStock}
                        onChange={(e) => setNewSmartphoneSpecStock(parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                  <Button
                    variant="outline-primary"
                    onClick={addSmartphoneSpec}
                    className="mt-2"
                    disabled={!newSmartphoneModel.trim() || !newSmartphoneStorage.trim() || !newSmartphoneRam.trim()}
                  >
                    Add Specification
                  </Button>
                </div>

                {smartphoneSpecs.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-bordered table-sm">
                      <thead className="table-light">
                        <tr>
                          <th>Model</th>
                          <th>Storage</th>
                          <th>RAM</th>
                          <th>Stock</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {smartphoneSpecs.map((spec, index) => (
                          <tr key={index}>
                            <td>{spec.model}</td>
                            <td>{spec.storage}</td>
                            <td>{spec.ram}</td>
                            <td>{spec.countInStock}</td>
                            <td>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => removeSmartphoneSpec(index)}
                              >
                                Remove
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-muted">No specifications added yet. Add specifications above.</p>
                )}
              </Form.Group>
            )}

            <Form.Group controlId="description" className="my-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></Form.Control>
            </Form.Group>

            <Button type="submit" variant="primary" className="my-3">
              {isNewProduct ? 'Create' : 'Update'}
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default ProductEditScreen;
