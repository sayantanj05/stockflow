import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FiPieChart, FiDownload } from 'react-icons/fi';

function Reports() {
    const [reportType, setReportType] = useState('inventory');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchReport(reportType);
    }, [reportType]);

    const fetchReport = async (type) => {
        setLoading(true);
        try {
            const response = await api.get(`/reports/${type}`);
            setData(response.data);
        } catch (error) {
            console.error("Failed to fetch report", error);
        } finally {
            setLoading(false);
        }
    };

    const handleExportCSV = () => {
        if (!data || data.length === 0) return;

        // Extract headers
        const headers = Object.keys(data[0]);
        
        // Build CSV string
        const csvRows = [
            headers.join(','), // Header row
            ...data.map(row => 
                headers.map(header => {
                    let cell = row[header] === null ? '' : row[header];
                    // Escape quotes and commas
                    cell = cell.toString().replace(/"/g, '""');
                    return `"${cell}"`;
                }).join(',')
            )
        ];

        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `${reportType}_report_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold m-0"><FiPieChart className="me-2 text-primary" /> System Reports</h4>
                
                <div className="d-flex gap-2">
                    <select 
                        className="form-select w-auto" 
                        value={reportType} 
                        onChange={(e) => setReportType(e.target.value)}
                    >
                        <option value="inventory">Inventory Valuation Report</option>
                        <option value="low-stock">Low Stock Alert Report</option>
                        <option value="purchases">Purchase History Report</option>
                    </select>
                    
                    <button className="btn btn-outline-primary d-flex align-items-center gap-2" onClick={handleExportCSV} disabled={data.length === 0}>
                        <FiDownload /> Export CSV
                    </button>
                </div>
            </div>

            <div className="custom-table-container">
                {loading ? (
                    <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
                ) : (
                    <div className="table-responsive">
                        {reportType === 'inventory' && (
                            <table className="table table-hover align-middle flex-grow-1">
                                <thead>
                                    <tr>
                                        <th>Product Name</th>
                                        <th>Category</th>
                                        <th>Supplier</th>
                                        <th>Unit Price</th>
                                        <th>In Stock Qty</th>
                                        <th className="text-end">Total Value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((item, i) => (
                                        <tr key={i}>
                                            <td className="fw-semibold text-dark">{item.name}</td>
                                            <td>{item.category || '-'}</td>
                                            <td>{item.supplier || '-'}</td>
                                            <td>₹{parseFloat(item.price).toFixed(2)}</td>
                                            <td>{item.quantity}</td>
                                            <td className="text-end fw-bold">₹{parseFloat(item.total_value).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        {reportType === 'low-stock' && (
                            <table className="table table-hover align-middle flex-grow-1">
                                <thead>
                                    <tr>
                                        <th>Product Name</th>
                                        <th>Current Stock</th>
                                        <th>Primary Supplier</th>
                                        <th>Supplier Phone</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((item, i) => (
                                        <tr key={i}>
                                            <td className="fw-semibold text-dark">{item.name}</td>
                                            <td><span className="badge badge-soft-danger fs-6">{item.quantity}</span></td>
                                            <td>{item.supplier || 'No Supplier Assigned'}</td>
                                            <td>{item.phone || '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        {reportType === 'purchases' && (
                            <table className="table table-hover align-middle flex-grow-1">
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Date</th>
                                        <th>Supplier</th>
                                        <th>Item Types Count</th>
                                        <th className="text-end">Total Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((item, i) => (
                                        <tr key={i}>
                                            <td className="text-muted">#{item.id}</td>
                                            <td>{new Date(item.date).toLocaleDateString()}</td>
                                            <td className="fw-semibold text-dark">{item.supplier}</td>
                                            <td>{item.total_items} items</td>
                                            <td className="text-end fw-bold text-primary">₹{parseFloat(item.total_amount).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        {data.length === 0 && (
                            <div className="text-center py-4 text-muted">No data available for this report.</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Reports;
