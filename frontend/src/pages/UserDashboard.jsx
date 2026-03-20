import React, { useEffect, useState } from 'react';
import api from '../services/api';
import authService from '../services/auth';
import { FiBox, FiSearch, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

function UserDashboard() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const user = authService.getCurrentUser();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get('/products');
                setProducts(response.data);
            } catch (error) {
                console.error("Failed to fetch products", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (p.category_name && p.category_name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold m-0">Welcome, {user?.name}</h4>
                <div className="text-muted small">Staff Dashboard</div>
            </div>

            {/* Overview Cards */}
            {!loading && (
                <div className="row g-4 mb-4">
                    <div className="col-md-4">
                        <div className="dash-card">
                            <div className="card-info">
                                <p>Total Products</p>
                                <h3>{products.length}</h3>
                            </div>
                            <div className="icon-box icon-blue"><FiBox /></div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="dash-card">
                            <div className="card-info">
                                <p>In Stock Items</p>
                                <h3>{products.filter(p => p.quantity > 0).length}</h3>
                            </div>
                            <div className="icon-box icon-green"><FiCheckCircle /></div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="dash-card border-warning">
                            <div className="card-info">
                                <p>Low/Out of Stock</p>
                                <h3 className="text-warning">{products.filter(p => p.quantity <= 10).length}</h3>
                            </div>
                            <div className="icon-box icon-orange"><FiAlertCircle /></div>
                        </div>
                    </div>
                </div>
            )}

            <div className="custom-table-container">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="fw-bold m-0"><FiBox className="me-2 text-primary" /> Product Availability</h5>
                    <div className="input-group" style={{maxWidth: '300px'}}>
                        <span className="input-group-text bg-white"><FiSearch /></span>
                        <input 
                            type="text" 
                            className="form-control border-start-0 ps-0" 
                            placeholder="Search products or categories..." 
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
                                    <th>In Stock</th>
                                    <th>Price/Unit</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map(product => (
                                    <tr key={product.id}>
                                        <td className="fw-semibold text-dark">{product.name}</td>
                                        <td><span className="badge bg-light text-dark border">{product.category_name || 'Uncategorized'}</span></td>
                                        <td className="fw-bold">{product.quantity}</td>
                                        <td>₹{parseFloat(product.price).toFixed(2)}</td>
                                        <td>
                                            {product.quantity > 10 ? (
                                                <span className="badge badge-soft-success">In Stock</span>
                                            ) : product.quantity > 0 ? (
                                                <span className="badge badge-soft-warning">Low Stock</span>
                                            ) : (
                                                <span className="badge badge-soft-danger">Out of Stock</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {filteredProducts.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="text-center py-4 text-muted">No products found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default UserDashboard;
