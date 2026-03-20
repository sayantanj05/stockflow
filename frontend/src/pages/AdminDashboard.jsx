import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    FiBox, FiList, FiTruck, FiUsers, FiAlertCircle, 
    FiUser, FiMail, FiPhone
} from 'react-icons/fi';
import api from '../services/api';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

function AdminDashboard() {
    const [data, setData] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await api.get('/dashboard');
                setData(response.data);
                
                // Fetch profile details
                const profileResponse = await api.get('/staff/profile');
                setProfile(profileResponse.data);
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;
    if (!data) return <div className="alert alert-danger mb-4">Error loading dashboard</div>;

    const chartData = data.inventory_chart?.map(item => ({
        name: item.category,
        Stock: parseInt(item.total_stock || 0)
    })) || [];

    const COLORS = ['#4361ee', '#3a0ca3', '#f72585', '#4cc9f0', '#10b981', '#f59e0b'];

    return (
        <div>
            {profile && (
                <div className="card border-0 shadow-sm rounded-4 mb-4" style={{ background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)', color: 'white' }}>
                    <div className="card-body p-4 d-flex flex-column flex-md-row align-items-center">
                        <div 
                            className="rounded-circle overflow-hidden border border-3 border-white shadow-sm mb-3 mb-md-0 me-md-4 flex-shrink-0 d-flex align-items-center justify-content-center"
                            style={{ width: '80px', height: '80px', backgroundColor: 'rgba(255,255,255,0.2)' }}
                        >
                            {profile.photo ? (
                                <img src={`http://localhost:8000${profile.photo}`} alt="Profile" className="w-100 h-100 object-fit-cover" />
                            ) : (
                                <FiUser size={40} className="text-white" />
                            )}
                        </div>
                        <div className="text-center text-md-start mb-3 mb-md-0">
                            <h3 className="fw-bold mb-1">Welcome back, {profile.name}!</h3>
                            <div className="d-flex align-items-center justify-content-center justify-content-md-start flex-wrap gap-3 mt-2 opacity-75">
                                <span><FiMail className="me-1" /> {profile.email}</span>
                                {profile.phone && <span><FiPhone className="me-1" /> {profile.phone}</span>}
                                {profile.staff_id && <span className="badge bg-white text-primary">ID: {profile.staff_id}</span>}
                                <span className="badge bg-white text-primary text-uppercase">{profile.role}</span>
                            </div>
                        </div>
                        <div className="ms-md-auto mt-3 mt-md-0 d-flex gap-2">
                           <button className="btn btn-outline-light rounded-pill px-4" onClick={() => navigate('/profile')}>
                               Edit Profile
                           </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold m-0">Overview</h4>
            </div>

            {/* Top Cards */}
            <div className="row g-4 mb-4">
                <div className="col-xl-3 col-sm-6">
                    <div className="dash-card clickable" onClick={() => navigate('/admin/products')}>
                        <div className="card-info">
                            <p>Total Products</p>
                            <h3>{data.total_products}</h3>
                        </div>
                        <div className="icon-box icon-blue"><FiBox /></div>
                    </div>
                </div>
                <div className="col-xl-3 col-sm-6">
                    <div className="dash-card clickable" onClick={() => navigate('/admin/categories')}>
                        <div className="card-info">
                            <p>Total Categories</p>
                            <h3>{data.total_categories}</h3>
                        </div>
                        <div className="icon-box icon-green"><FiList /></div>
                    </div>
                </div>
                <div className="col-xl-3 col-sm-6">
                    <div className="dash-card clickable" onClick={() => navigate('/admin/suppliers')}>
                        <div className="card-info">
                            <p>Suppliers</p>
                            <h3>{data.total_suppliers}</h3>
                        </div>
                        <div className="icon-box icon-orange"><FiTruck /></div>
                    </div>
                </div>
                <div className="col-xl-3 col-sm-6">
                    <div className="dash-card clickable" onClick={() => navigate('/admin/users')}>
                        <div className="card-info">
                            <p>Total Users</p>
                            <h3>{data.total_users}</h3>
                        </div>
                        <div className="icon-box icon-blue"><FiUsers /></div>
                    </div>
                </div>
                <div className="col-xl-3 col-sm-6">
                    <div className="dash-card clickable" onClick={() => navigate('/admin/stock')}>
                        <div className="card-info">
                            <p>Total Stock Items</p>
                            <h3>{data.total_stock_quantity}</h3>
                        </div>
                        <div className="icon-box icon-green"><FiBox /></div>
                    </div>
                </div>
                <div className="col-xl-3 col-sm-6">
                    <div className="dash-card border-danger clickable" onClick={() => navigate('/admin/reports')}>
                        <div className="card-info">
                            <p>Low Stock Alerts</p>
                            <h3 className="text-danger">{data.low_stock_count}</h3>
                        </div>
                        <div className="icon-box icon-red"><FiAlertCircle /></div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-xl-8 mb-4">
                    <div className="custom-table-container h-100">
                        <h5 className="fw-bold mb-4 text-dark">Stock by Category Overview</h5>
                        <div style={{ width: '100%', height: 320 }}>
                            <ResponsiveContainer>
                                <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                                    <RechartsTooltip 
                                        cursor={{fill: 'rgba(67, 97, 238, 0.05)'}}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                                    />
                                    <Bar dataKey="Stock" fill="var(--primary-color)" radius={[6, 6, 0, 0]} barSize={45} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
                <div className="col-xl-4 mb-4">
                    <div className="custom-table-container h-100">
                        <h5 className="fw-bold mb-4 text-dark">Stock Distribution</h5>
                        <div style={{ width: '100%', height: 320 }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        cx="50%"
                                        cy="45%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={5}
                                        dataKey="Stock"
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip 
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                                    />
                                    <Legend iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-12 mb-4">
                    <div className="custom-table-container">
                        <h5 className="fw-bold mb-4">Recent Stock Activity</h5>
                        <div className="table-responsive">
                            <table className="table table-borderless align-middle table-hover">
                                <thead>
                                    <tr>
                                        <th>Action</th>
                                        <th>Product</th>
                                        <th className="text-end">Quantity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.recent_activities?.map((activity, i) => (
                                        <tr key={i} className="border-bottom">
                                            <td>
                                                <div className={`badge ${activity.type === 'add' ? 'bg-success bg-opacity-10 text-success' : 'bg-danger bg-opacity-10 text-danger'} px-3 py-2 rounded-pill`}>
                                                    {activity.type.toUpperCase()}
                                                </div>
                                            </td>
                                            <td className="fw-semibold text-dark">{activity.name}</td>
                                            <td className={`text-end fw-bold ${activity.type === 'add' ? 'text-success' : 'text-danger'}`}>
                                                {activity.type === 'add' ? '+' : '-'}{activity.quantity}
                                            </td>
                                        </tr>
                                    ))}
                                    {(!data.recent_activities || data.recent_activities.length === 0) && (
                                        <tr><td colSpan="3" className="text-muted text-center py-4">No recent activities found in the system.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
