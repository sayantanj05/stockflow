import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FiPlus, FiShoppingCart, FiSearch } from 'react-icons/fi';

function Purchases() {
    const [purchases, setPurchases] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Form Modal State
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ supplier_id: '', items: [] });
    // Temporary item state before adding to purchase list
    const [tempItem, setTempItem] = useState({ product_id: '', quantity: '', price: '' });
    const [formLoading, setFormLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [purRes, supRes, prodRes] = await Promise.all([
                api.get('/purchases'),
                api.get('/suppliers'),
                api.get('/products')
            ]);
            setPurchases(purRes.data);
            setSuppliers(supRes.data);
            setProducts(prodRes.data);
        } catch (error) {
            console.error("Failed to fetch purchases data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = () => {
        setError('');
        setFormData({ supplier_id: '', items: [] });
        setTempItem({ product_id: '', quantity: '', price: '' });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const addItemToPurchase = () => {
        if(!tempItem.product_id || !tempItem.quantity || !tempItem.price) {
            setError('Please fill all item fields');
            return;
        }
        setError('');
        
        const selectedProduct = products.find(p => p.id == tempItem.product_id);
        
        setFormData(prev => ({
            ...prev,
            items: [...prev.items, {
                ...tempItem,
                name: selectedProduct?.name,
                quantity: parseInt(tempItem.quantity),
                price: parseFloat(tempItem.price)
            }]
        }));
        
        // Reset temp item
        setTempItem({ product_id: '', quantity: '', price: '' });
    };

    const removeItem = (index) => {
        setFormData(prev => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(formData.items.length === 0) {
            setError('Please add at least one item to purchase');
            return;
        }
        setFormLoading(true);
        setError('');

        try {
            await api.post('/purchases', {
                supplier_id: parseInt(formData.supplier_id),
                items: formData.items.map(item => ({
                    product_id: parseInt(item.product_id),
                    quantity: parseInt(item.quantity),
                    price: parseFloat(item.price)
                }))
            });
            fetchData();
            handleCloseModal();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to record purchase');
        } finally {
            setFormLoading(false);
        }
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold m-0"><FiShoppingCart className="me-2 text-primary" /> Purchase Orders</h4>
                <button className="btn btn-primary d-flex align-items-center gap-2 px-4" onClick={() => handleOpenModal()}>
                    <FiPlus /> Record Purchase
                </button>
            </div>

            <div className="custom-table-container">
                {loading ? (
                    <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Supplier</th>
                                    <th>Total Amount</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {purchases.map(purchase => (
                                    <tr key={purchase.id}>
                                        <td className="text-muted">{new Date(purchase.date).toLocaleString()}</td>
                                        <td className="fw-bold text-dark">{purchase.supplier_name || 'Unknown'}</td>
                                        <td className="fw-semibold text-primary">₹{parseFloat(purchase.total_amount).toFixed(2)}</td>
                                        <td><span className="badge badge-soft-success">Completed</span></td>
                                    </tr>
                                ))}
                                {purchases.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="text-center py-4 text-muted">No purchases recorded.</td>
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
                                        <h5 className="modal-title fw-bold">Record New Purchase</h5>
                                        <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                                    </div>
                                    <div className="modal-body pb-0">
                                        {error && <div className="alert alert-danger py-2">{error}</div>}
                                        
                                        <div className="mb-4">
                                            <label className="form-label text-muted fw-semibold">Supplier *</label>
                                            <select className="form-select" required
                                                value={formData.supplier_id}
                                                onChange={(e) => setFormData({...formData, supplier_id: e.target.value})}
                                            >
                                                <option value="">Select Supplier</option>
                                                {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                            </select>
                                        </div>

                                        <div className="card shadow-sm border-0 mb-4 bg-light">
                                            <div className="card-body">
                                                <h6 className="fw-bold mb-3">Add Items</h6>
                                                <div className="row g-2 align-items-end">
                                                    <div className="col-md-5">
                                                        <label className="form-label small text-muted mb-1">Product</label>
                                                        <select className="form-select form-select-sm" 
                                                            value={tempItem.product_id}
                                                            onChange={(e) => {
                                                                const pid = e.target.value;
                                                                const prod = products.find(p => p.id == pid);
                                                                // auto fill basic price as suggestion
                                                                setTempItem({...tempItem, product_id: pid, price: prod ? prod.price : ''});
                                                            }}
                                                        >
                                                            <option value="">Select Product</option>
                                                            {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                                        </select>
                                                    </div>
                                                    <div className="col-md-3">
                                                        <label className="form-label small text-muted mb-1">Cost / Unit (₹)</label>
                                                        <input type="number" step="0.01" min="0" className="form-control form-control-sm" 
                                                            value={tempItem.price} onChange={(e) => setTempItem({...tempItem, price: e.target.value})} 
                                                        />
                                                    </div>
                                                    <div className="col-md-2">
                                                        <label className="form-label small text-muted mb-1">Qty</label>
                                                        <input type="number" min="1" className="form-control form-control-sm" 
                                                            value={tempItem.quantity} onChange={(e) => setTempItem({...tempItem, quantity: e.target.value})}
                                                        />
                                                    </div>
                                                    <div className="col-md-2">
                                                        <button type="button" className="btn btn-sm btn-secondary w-100" onClick={addItemToPurchase}>Add</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="table-responsive" style={{maxHeight: '200px', overflowY: 'auto'}}>
                                            <table className="table table-sm">
                                                <thead className="table-light">
                                                    <tr>
                                                        <th>Product</th>
                                                        <th>Price</th>
                                                        <th>Qty</th>
                                                        <th>Total</th>
                                                        <th></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {formData.items.map((item, idx) => (
                                                        <tr key={idx}>
                                                            <td>{item.name}</td>
                                                            <td>₹{item.price.toFixed(2)}</td>
                                                            <td>{item.quantity}</td>
                                                            <td className="fw-bold">₹{(item.price * item.quantity).toFixed(2)}</td>
                                                            <td className="text-end">
                                                                <button type="button" className="btn btn-sm text-danger p-0" onClick={() => removeItem(idx)}>Remove</button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    {formData.items.length === 0 && (
                                                        <tr><td colSpan="5" className="text-center text-muted small py-3">No items added yet.</td></tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <div className="modal-footer border-top-0 bg-light rounded-bottom d-flex justify-content-between">
                                        <div>
                                            <strong className="text-muted text-uppercase small tracking-wide d-block">Total Purchase Cost</strong>
                                            <h4 className="m-0 text-primary fw-bold">
                                                ₹{formData.items.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0).toFixed(2)}
                                            </h4>
                                        </div>
                                        <div>
                                            <button type="button" className="btn btn-light px-4 me-2 border" onClick={handleCloseModal}>Cancel</button>
                                            <button type="submit" className="btn btn-primary px-4" disabled={formLoading || formData.items.length === 0}>
                                                {formLoading ? 'Recording...' : 'Record Purchase'}
                                            </button>
                                        </div>
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

export default Purchases;
