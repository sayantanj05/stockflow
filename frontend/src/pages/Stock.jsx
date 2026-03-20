import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FiPlus, FiMinus, FiSearch, FiDatabase } from 'react-icons/fi';

function Stock() {
    const [transactions, setTransactions] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [actionType, setActionType] = useState('add');
    const [formData, setFormData] = useState({ product_id: '', quantity: '' });
    const [formLoading, setFormLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [trxRes, prodRes] = await Promise.all([
                api.get('/stock'),
                api.get('/products')
            ]);
            setTransactions(trxRes.data);
            setProducts(prodRes.data);
        } catch (error) {
            console.error("Failed to fetch stock data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (type) => {
        setError('');
        setActionType(type);
        setFormData({ product_id: '', quantity: '' });
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
            await api.post(`/stock/${actionType}`, {
                product_id: parseInt(formData.product_id),
                quantity: parseInt(formData.quantity)
            });
            fetchData();
            handleCloseModal();
        } catch (err) {
            setError(err.response?.data?.message || `Failed to ${actionType} stock`);
        } finally {
            setFormLoading(false);
        }
    };

    const filteredTransactions = transactions.filter(t => 
        t.product_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold m-0"><FiDatabase className="me-2 text-primary" /> Stock Manager</h4>
                <div className="d-flex gap-2">
                    <button className="btn btn-outline-danger d-flex align-items-center gap-2 px-3" onClick={() => handleOpenModal('remove')}>
                        <FiMinus /> Remove Stock
                    </button>
                    <button className="btn btn-success d-flex align-items-center gap-2 px-3 text-white" onClick={() => handleOpenModal('add')}>
                        <FiPlus /> Add Stock
                    </button>
                </div>
            </div>

            <div className="custom-table-container">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="fw-bold m-0">Recent Stock Transactions</h5>
                    <div className="input-group" style={{maxWidth: '300px'}}>
                        <span className="input-group-text bg-white"><FiSearch /></span>
                        <input 
                            type="text" 
                            className="form-control border-start-0 ps-0" 
                            placeholder="Search by product..." 
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
                                    <th>Date & Time</th>
                                    <th>Product Name</th>
                                    <th>Transaction Type</th>
                                    <th>Quantity Adjusted</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTransactions.map(trx => (
                                    <tr key={trx.id}>
                                        <td className="text-muted">{new Date(trx.date).toLocaleString()}</td>
                                        <td className="fw-semibold text-dark">{trx.product_name}</td>
                                        <td>
                                            <span className={`badge ${trx.type === 'add' ? 'bg-success' : 'bg-danger'}`}>
                                                {trx.type.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className={`fw-bold ${trx.type === 'add' ? 'text-success' : 'text-danger'}`}>
                                            {trx.type === 'add' ? '+' : '-'}{trx.quantity}
                                        </td>
                                    </tr>
                                ))}
                                {filteredTransactions.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="text-center py-4 text-muted">No transactions found.</td>
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
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content border-0 shadow">
                                <form onSubmit={handleSubmit}>
                                    <div className={`modal-header border-bottom-0 pb-0 ${actionType === 'add' ? 'text-success' : 'text-danger'}`}>
                                        <h5 className="modal-title fw-bold">
                                            <FiDatabase className="me-2" />
                                            {actionType === 'add' ? 'Add Stock to Inventory' : 'Remove Stock from Inventory'}
                                        </h5>
                                        <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                                    </div>
                                    <div className="modal-body">
                                        {error && <div className="alert alert-danger py-2">{error}</div>}
                                        
                                        <div className="mb-4 text-center">
                                            <span className={`display-1 ${actionType === 'add' ? 'text-success' : 'text-danger'}`} style={{opacity: 0.2}}>
                                                {actionType === 'add' ? <FiPlus /> : <FiMinus />}
                                            </span>
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label text-muted fw-semibold">Select Product *</label>
                                            <select className="form-select" required
                                                value={formData.product_id}
                                                onChange={(e) => setFormData({...formData, product_id: e.target.value})}
                                            >
                                                <option value="">-- Choose Product --</option>
                                                {products.map(p => (
                                                    <option key={p.id} value={p.id}>{p.name} (Current: {p.quantity})</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label text-muted fw-semibold">Quantity to {actionType} *</label>
                                            <input 
                                                type="number" className="form-control" required min="1"
                                                value={formData.quantity}
                                                onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                    <div className="modal-footer border-top-0 pt-0">
                                        <button type="button" className="btn btn-light px-4" onClick={handleCloseModal}>Cancel</button>
                                        <button type="submit" className={`btn ${actionType === 'add' ? 'btn-success text-white' : 'btn-danger'} px-4`} disabled={formLoading}>
                                            {formLoading ? 'Processing...' : 'Confirm Transaction'}
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

export default Stock;
