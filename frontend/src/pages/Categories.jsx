import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';

function Categories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Form Modal State
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentCategory, setCurrentCategory] = useState({ id: '', name: '', description: '' });
    const [formLoading, setFormLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await api.get('/categories');
            setCategories(response.data);
        } catch (error) {
            console.error("Failed to fetch categories", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (category = null) => {
        setError('');
        if (category) {
            setIsEditing(true);
            setCurrentCategory(category);
        } else {
            setIsEditing(false);
            setCurrentCategory({ id: '', name: '', description: '' });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setCurrentCategory({ id: '', name: '', description: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        setError('');

        try {
            if (isEditing) {
                await api.put(`/categories/${currentCategory.id}`, currentCategory);
            } else {
                await api.post('/categories', currentCategory);
            }
            fetchCategories();
            handleCloseModal();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save category');
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this category?")) {
            try {
                await api.delete(`/categories/${id}`);
                fetchCategories();
            } catch (error) {
                console.error("Failed to delete category", error);
                alert("Could not delete. It might be in use by products.");
            }
        }
    };

    const filteredCategories = categories.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold m-0">Categories</h4>
                <button className="btn btn-primary d-flex align-items-center gap-2 px-4" onClick={() => handleOpenModal()}>
                    <FiPlus /> Add Category
                </button>
            </div>

            <div className="custom-table-container">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="input-group" style={{maxWidth: '300px'}}>
                        <span className="input-group-text bg-white"><FiSearch /></span>
                        <input 
                            type="text" 
                            className="form-control border-start-0 ps-0" 
                            placeholder="Search categories..." 
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
                                    <th>ID</th>
                                    <th>Category Name</th>
                                    <th>Description</th>
                                    <th className="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCategories.map(category => (
                                    <tr key={category.id}>
                                        <td className="text-muted">#{category.id}</td>
                                        <td className="fw-semibold text-dark">{category.name}</td>
                                        <td className="text-muted text-truncate" style={{maxWidth: '300px'}}>{category.description || '-'}</td>
                                        <td className="text-end">
                                            <button className="btn btn-sm btn-light me-2 text-primary" onClick={() => handleOpenModal(category)}>
                                                <FiEdit2 />
                                            </button>
                                            <button className="btn btn-sm btn-light text-danger" onClick={() => handleDelete(category.id)}>
                                                <FiTrash2 />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredCategories.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="text-center py-4 text-muted">No categories found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Custom Modal overlay using Bootstrap classes but custom state */}
            {showModal && (
                <>
                    <div className="modal-backdrop fade show"></div>
                    <div className="modal fade show d-block" tabIndex="-1">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content border-0 shadow">
                                <form onSubmit={handleSubmit}>
                                    <div className="modal-header border-bottom-0 pb-0">
                                        <h5 className="modal-title fw-bold">{isEditing ? 'Edit Category' : 'Add New Category'}</h5>
                                        <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                                    </div>
                                    <div className="modal-body">
                                        {error && <div className="alert alert-danger py-2">{error}</div>}
                                        <div className="mb-3">
                                            <label className="form-label text-muted fw-semibold">Category Name *</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                required
                                                value={currentCategory.name}
                                                onChange={(e) => setCurrentCategory({...currentCategory, name: e.target.value})}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label text-muted fw-semibold">Description</label>
                                            <textarea 
                                                className="form-control" 
                                                rows="3"
                                                value={currentCategory.description}
                                                onChange={(e) => setCurrentCategory({...currentCategory, description: e.target.value})}
                                            ></textarea>
                                        </div>
                                    </div>
                                    <div className="modal-footer border-top-0 pt-0">
                                        <button type="button" className="btn btn-light px-4" onClick={handleCloseModal}>Cancel</button>
                                        <button type="submit" className="btn btn-primary px-4" disabled={formLoading}>
                                            {formLoading ? 'Saving...' : 'Save Category'}
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

export default Categories;
