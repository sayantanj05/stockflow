import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <div className="d-flex w-100">
      <Sidebar />
      <div className="main-content flex-grow-1 bg-light">
        <Navbar />
        <div className="p-4">
            <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
