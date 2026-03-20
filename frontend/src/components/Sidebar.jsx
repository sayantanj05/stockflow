import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import authService from '../services/auth';
import { 
    FiHome, FiBox, FiList, FiTruck, 
    FiDatabase, FiShoppingCart, FiUsers, FiPieChart, FiUser, FiMail
} from 'react-icons/fi';

const Sidebar = () => {
    const user = authService.getCurrentUser();
    const isAdmin = user?.role === 'admin';

    return (
        <div className="sidebar d-flex flex-column">
            <div className="sidebar-header">
                <h3>StockFlow</h3>
            </div>
            <ul className="flex-grow-1 mt-3">
                {isAdmin ? (
                    <>
                        <li><NavLink to="/admin/dashboard"><FiHome /> Dashboard</NavLink></li>
                        <li><NavLink to="/admin/products"><FiBox /> Products</NavLink></li>
                        <li><NavLink to="/admin/categories"><FiList /> Categories</NavLink></li>
                        <li><NavLink to="/admin/suppliers"><FiTruck /> Suppliers</NavLink></li>
                        <li><NavLink to="/admin/stock"><FiDatabase /> Stock Manager</NavLink></li>
                        <li><NavLink to="/admin/purchases"><FiShoppingCart /> Purchases</NavLink></li>
                        <li><NavLink to="/admin/users"><FiUsers /> Users</NavLink></li>
                        <li><NavLink to="/admin/reports"><FiPieChart /> Reports</NavLink></li>
                        <li><NavLink to="/admin/messages"><FiMail /> Messages</NavLink></li>
                        <li className="mt-4"><NavLink to="/profile"><FiUser /> My Profile</NavLink></li>
                    </>
                ) : (
                    <>
                        <li><NavLink to="/user/dashboard"><FiHome /> Dashboard</NavLink></li>
                        <li><NavLink to="/user/products"><FiBox /> Browse Products</NavLink></li>
                        <li className="mt-4"><NavLink to="/profile"><FiUser /> My Profile</NavLink></li>
                    </>
                )}
            </ul>
        </div>
    );
};

export default Sidebar;
