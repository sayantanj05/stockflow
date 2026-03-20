import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiPhone, FiMail } from 'react-icons/fi';

function Suppliers() {
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentSupplier, setCurrentSupplier] = useState({ id: '', name: '', phone: '', email: '', address: '' });
    const [formLoading, setFormLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const fetchSuppliers = async () => {
        try {
            const response = await api.get('/suppliers');
            setSuppliers(response.data);
        } catch (error) {
            console.error("Failed to fetch suppliers", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (supplier = null) => {
        setError('');
        if (supplier) {
            setIsEditing(true);
            setCurrentSupplier(supplier);
        } else {
            setIsEditing(false);
            setCurrentSupplier({ id: '', name: '', phone: '', email: '', address: '' });
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
                await api.put(`/suppliers/${currentSupplier.id}`, currentSupplier);
            } else {
                await api.post('/suppliers', currentSupplier);
            }
            fetchSuppliers();
            handleCloseModal();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save supplier');
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this supplier?")) {
            try {
                await api.delete(`/suppliers/${id}`);
                fetchSuppliers();
            } catch (error) {
                console.error("Failed to delete", error);
                alert("Could not delete. It might be linked to existing products.");
            }
        }
    };

    const filteredSuppliers = suppliers.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.email && s.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold m-0">Supplier Contacts</h4>
                <button className="btn btn-primary d-flex align-items-center gap-2 px-4" onClick={() => handleOpenModal()}>
                    <FiPlus /> Add Supplier
                </button>
            </div>

            <div className="custom-table-container">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="input-group" style={{maxWidth: '300px'}}>
                        <span className="input-group-text bg-white"><FiSearch /></span>
                        <input 
                            type="text" 
                            className="form-control border-start-0 ps-0" 
                            placeholder="Search suppliers..." 
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
                                    <th>Supplier Name</th>
                                    <th>Contact Info</th>
                                    <th>Address</th>
                                    <th className="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSuppliers.map(supplier => (
                                    <tr key={supplier.id}>
                                        <td className="fw-bold text-dark">{supplier.name}</td>
                                        <td>
                                            {supplier.email && <div className="text-muted small"><FiMail className="me-1" /> {supplier.email}</div>}
                                            {supplier.phone && <div className="text-muted small mt-1"><FiPhone className="me-1" /> {supplier.phone}</div>}
                                            {(!supplier.email && !supplier.phone) && '-'}
                                        </td>
                                        <td className="text-muted">{supplier.address || '-'}</td>
                                        <td className="text-end">
                                            <button className="btn btn-sm btn-light me-2 text-primary" onClick={() => handleOpenModal(supplier)}>
                                                <FiEdit2 />
                                            </button>
                                            <button className="btn btn-sm btn-light text-danger" onClick={() => handleDelete(supplier.id)}>
                                                <FiTrash2 />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredSuppliers.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="text-center py-4 text-muted">No suppliers found.</td>
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
                                    <div className="modal-header border-bottom-0 pb-0">
                                        <h5 className="modal-title fw-bold">{isEditing ? 'Edit Supplier' : 'Add New Supplier'}</h5>
                                        <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                                    </div>
                                    <div className="modal-body">
                                        {error && <div className="alert alert-danger py-2">{error}</div>}
                                        <div className="mb-3">
                                            <label className="form-label text-muted fw-semibold">Company Name *</label>
                                            <input 
                                                type="text" className="form-control" required
                                                value={currentSupplier.name}
                                                onChange={(e) => setCurrentSupplier({...currentSupplier, name: e.target.value})}
                                            />
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label text-muted fw-semibold">Email Address</label>
                                                <input 
                                                    type="email" className="form-control"
                                                    value={currentSupplier.email}
                                                    onChange={(e) => setCurrentSupplier({...currentSupplier, email: e.target.value})}
                                                />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label text-muted fw-semibold">Phone Number</label>
                                                <input 
                                                    type="text" className="form-control"
                                                    value={currentSupplier.phone}
                                                    onChange={(e) => setCurrentSupplier({...currentSupplier, phone: e.target.value})}
                                                />
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label text-muted fw-semibold">Physical Address</label>
                                            <textarea 
                                                className="form-control" rows="2"
                                                value={currentSupplier.address}
                                                onChange={(e) => setCurrentSupplier({...currentSupplier, address: e.target.value})}
                                            ></textarea>
                                        </div>
                                    </div>
                                    <div className="modal-footer border-top-0 pt-0">
                                        <button type="button" className="btn btn-light px-4" onClick={handleCloseModal}>Cancel</button>
                                        <button type="submit" className="btn btn-primary px-4" disabled={formLoading}>
                                            {formLoading ? 'Saving...' : 'Save Supplier'}
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

export default Suppliers;
