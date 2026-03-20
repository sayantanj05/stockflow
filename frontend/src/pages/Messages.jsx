import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FiMail, FiTrash2, FiCheck } from 'react-icons/fi';

function Messages() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const response = await api.get('/contact');
            setMessages(response.data);
        } catch (error) {
            console.error("Failed to fetch messages", error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await api.post('/contact/read', { id });
            fetchMessages();
        } catch (error) {
            console.error("Failed to mark as read", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this message?")) {
            try {
                await api.delete(`/contact/${id}`);
                fetchMessages();
            } catch (error) {
                console.error("Failed to delete message", error);
            }
        }
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold m-0">Contact Inquiries</h4>
            </div>

            <div className="custom-table-container">
                {loading ? (
                    <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead>
                                <tr>
                                    <th>Status</th>
                                    <th>Date</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th style={{width: '40%'}}>Message</th>
                                    <th className="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {messages.map(msg => (
                                    <tr key={msg.id} className={msg.status === 'unread' ? 'table-light fw-semibold' : ''}>
                                        <td>
                                            {msg.status === 'unread' ? (
                                                <span className="badge bg-primary rounded-pill">New</span>
                                            ) : (
                                                <span className="badge bg-secondary rounded-pill">Read</span>
                                            )}
                                        </td>
                                        <td className="text-muted small">
                                            {new Date(msg.created_at).toLocaleString()}
                                        </td>
                                        <td className="text-dark">
                                            {msg.first_name} {msg.last_name}
                                        </td>
                                        <td>
                                            <a href={`mailto:${msg.email}`} className="text-decoration-none">{msg.email}</a>
                                        </td>
                                        <td>
                                            <div className="text-wrap" style={{maxHeight: '100px', overflowY: 'auto'}}>
                                                {msg.message}
                                            </div>
                                        </td>
                                        <td className="text-end">
                                            {msg.status === 'unread' && (
                                                <button 
                                                    className="btn btn-sm btn-light text-success me-2" 
                                                    title="Mark as Read"
                                                    onClick={() => handleMarkAsRead(msg.id)}
                                                >
                                                    <FiCheck />
                                                </button>
                                            )}
                                            <button 
                                                className="btn btn-sm btn-light text-danger" 
                                                title="Delete Message"
                                                onClick={() => handleDelete(msg.id)}
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {messages.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="text-center py-5 text-muted">
                                            <FiMail size={40} className="mb-3 opacity-50" />
                                            <p className="mb-0">No contact messages received yet.</p>
                                        </td>
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

export default Messages;
