import React, { useState, useEffect } from 'react';
import api from '../services/api';
import authService from '../services/auth';
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';

function Products() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    
    const user = authService.getCurrentUser();
    const isAdmin = user?.role === 'admin';
    
    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProduct, setCurrentProduct] = useState({ 
        id: '', name: '', category_id: '', supplier_id: '', price: '', quantity: '' 
    });
    const [formLoading, setFormLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [prodRes, catRes, supRes] = await Promise.all([
                api.get('/products'),
                api.get('/categories'),
                api.get('/suppliers')
            ]);
            setProducts(prodRes.data);
            setCategories(catRes.data);
            setSuppliers(supRes.data);
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (product = null) => {
        setError('');
        if (product) {
            setIsEditing(true);
            setCurrentProduct({
                ...product,
                category_id: product.category_id || '',
                supplier_id: product.supplier_id || ''
            });
        } else {
            setIsEditing(false);
            setCurrentProduct({ id: '', name: '', category_id: '', supplier_id: '', price: '', quantity: '0' });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        setError('');

        try {
            if (isEditing) {
                await api.put(`/products/${currentProduct.id}`, currentProduct);
            } else {
                await api.post('/products', currentProduct);
            }
            fetchData();
            handleCloseModal();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save product');
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this product definitively? Stock history will be removed.")) {
            try {
                await api.delete(`/products/${id}`);
                fetchData();
            } catch (error) {
                console.error("Failed to delete", error);
                alert("Could not delete product.");
            }
        }
    };

    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (p.category_name && p.category_name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold m-0">Products Manager</h4>
                {isAdmin && (
                    <button className="btn btn-primary d-flex align-items-center gap-2 px-4" onClick={() => handleOpenModal()}>
                        <FiPlus /> Add Product
                    </button>
                )}
            </div>

            <div className="custom-table-container">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="input-group" style={{maxWidth: '300px'}}>
                        <span className="input-group-text bg-white"><FiSearch /></span>
                        <input 
                            type="text" 
                            className="form-control border-start-0 ps-0" 
                            placeholder="Search products..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead>
                                <tr>
                                    <th>Product Name</th>
                                    <th>Category</th>
                                    <th>Supplier</th>
                                    <th>Price/Unit</th>
                                    <th>In Stock</th>
                                    {isAdmin && <th className="text-end">Actions</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map(product => (
                                    <tr key={product.id}>
                                        <td className="fw-semibold text-dark">{product.name}</td>
                                        <td>{product.category_name || '-'}</td>
                                        <td>{product.supplier_name || '-'}</td>
                                        <td>₹{parseFloat(product.price).toFixed(2)}</td>
                                        <td><span className={`badge ${product.quantity > 10 ? 'badge-soft-success' : 'badge-soft-danger'} fs-6`}>{product.quantity}</span></td>
                                        {isAdmin && (
                                            <td className="text-end">
                                                <button className="btn btn-sm btn-light me-2 text-primary" onClick={() => handleOpenModal(product)}>
                                                    <FiEdit2 />
                                                </button>
                                                <button className="btn btn-sm btn-light text-danger" onClick={() => handleDelete(product.id)}>
                                                    <FiTrash2 />
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                                {filteredProducts.length === 0 && (
                                    <tr>
                                        <td colSpan={isAdmin ? "6" : "5"} className="text-center py-4 text-muted">No products found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <>
                    <div className="modal-backdrop fade show"></div>
                    <div className="modal fade show d-block" tabIndex="-1">
                        <div className="modal-dialog modal-dialog-centered modal-lg">
                            <div className="modal-content border-0 shadow">
                                <form onSubmit={handleSubmit}>
                                    <div className="modal-header border-bottom-0 pb-0">
                                        <h5 className="modal-title fw-bold">{isEditing ? 'Edit Product' : 'Add New Product'}</h5>
                                        <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                                    </div>
                                    <div className="modal-body pb-0">
                                        {error && <div className="alert alert-danger py-2">{error}</div>}
                                        
                                        <div className="row g-3">
                                            <div className="col-md-12">
                                                <label className="form-label text-muted fw-semibold">Product Name *</label>
                                                <input 
                                                    type="text" className="form-control" required
                                                    value={currentProduct.name}
                                                    onChange={(e) => setCurrentProduct({...currentProduct, name: e.target.value})}
                                                />
                                            </div>
                                            
                                            <div className="col-md-6">
                                                <label className="form-label text-muted fw-semibold">Category</label>
                                                <select className="form-select" 
                                                    value={currentProduct.category_id}
                                                    onChange={(e) => setCurrentProduct({...currentProduct, category_id: e.target.value})}
                                                >
                                                    <option value="">Select Category</option>
                                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                                </select>
                                            </div>

                                            <div className="col-md-6">
                                                <label className="form-label text-muted fw-semibold">Supplier</label>
                                                <select className="form-select" 
                                                    value={currentProduct.supplier_id}
                                                    onChange={(e) => setCurrentProduct({...currentProduct, supplier_id: e.target.value})}
                                                >
                                                    <option value="">Select Supplier</option>
                                                    {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                                </select>
                                            </div>

                                            <div className="col-md-6 mb-3">
                                                <label className="form-label text-muted fw-semibold">Price per Unit (₹) *</label>
                                                <input 
                                                    type="number" step="0.01" min="0" className="form-control" required
                                                    value={currentProduct.price}
                                                    onChange={(e) => setCurrentProduct({...currentProduct, price: e.target.value})}
                                                />
                                            </div>
                                            
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label text-muted fw-semibold">Initial Quantity</label>
                                                <input 
                                                    type="number" className="form-control" min="0"
                                                    value={currentProduct.quantity}
                                                    disabled={isEditing} // usually stock is managed via Stock Manager after creation
                                                    onChange={(e) => setCurrentProduct({...currentProduct, quantity: e.target.value})}
                                                />
                                                {isEditing && <small className="text-muted d-block mt-1">Use Stock Manager to adjust quantity</small>}
                                            </div>
                                        </div>

                                    </div>
                                    <div className="modal-footer border-top-0">
                                        <button type="button" className="btn btn-light px-4" onClick={handleCloseModal}>Cancel</button>
                                        <button type="submit" className="btn btn-primary px-4" disabled={formLoading}>
                                            {formLoading ? 'Saving...' : 'Save Product'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default Products;
