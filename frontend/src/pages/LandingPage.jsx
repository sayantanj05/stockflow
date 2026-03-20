import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { 
    FiCheckCircle, FiBox, FiTrendingUp, FiBell, 
    FiUsers, FiPieChart, FiFileText, FiMapPin, 
    FiMail, FiPhone, FiGithub, FiTwitter, FiLinkedin 
} from 'react-icons/fi';

const LandingPage = () => {
    const [contactForm, setContactForm] = useState({ first_name: '', last_name: '', email: '', message: '' });
    const [contactStatus, setContactStatus] = useState('');
    const [contactLoading, setContactLoading] = useState(false);

    const handleContactSubmit = async (e) => {
        e.preventDefault();
        setContactLoading(true);
        setContactStatus('');
        try {
            await api.post('/contact', contactForm);
            setContactStatus('success');
            setContactForm({ first_name: '', last_name: '', email: '', message: '' });
        } catch (err) {
            setContactStatus('error');
        } finally {
            setContactLoading(false);
        }
    };
    return (
        <div className="landing-page">
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-light bg-white sticky-top shadow-sm py-3">
                <div className="container">
                    <Link className="navbar-brand fw-bold text-primary fs-3 d-flex align-items-center" to="/">
                        <img src="/logo.svg" alt="logo" width="35" height="35" className="me-2" />
                        StockFlow
                    </Link>
                    <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto fw-semibold">
                            <li className="nav-item">
                                <a className="nav-link px-3 text-dark hover-primary" href="#home">Home</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link px-3 text-dark hover-primary" href="#about">About</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link px-3 text-dark hover-primary" href="#features">Features</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link px-3 text-dark hover-primary" href="#pricing">Pricing</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link px-3 text-dark hover-primary" href="#contact">Contact Us</a>
                            </li>
                        </ul>
                        <div className="d-flex ms-lg-4 mt-3 mt-lg-0">
                            <Link to="/login" className="btn btn-outline-primary fw-bold px-4 rounded-pill">Login / Sign Up</Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section id="home" className="pt-5 pb-5 position-relative overflow-hidden" style={{backgroundColor: '#fffcfc'}}>
                <div className="container position-relative z-1">
                    <div className="row align-items-center min-vh-75 py-5">
                        <div className="col-lg-6 mb-5 mb-lg-0 pe-lg-5">
                            <span className="badge bg-danger bg-opacity-10 text-danger px-3 py-2 rounded-pill fw-bold mb-3 border border-danger border-opacity-25">
                                <FiTrendingUp className="me-1"/> #1 Billing & Inventory App
                            </span>
                            <h1 className="display-4 fw-bolder text-dark mb-4 lh-sm">
                                Smart Inventory Management & Billing for Modern Businesses
                            </h1>
                            <p className="lead text-secondary mb-5 pe-lg-4">
                                Join thousands of businesses managing their stock, invoices, and accounting effortlessly. Our platform is built for speed, accuracy, and GST-ready compliance.
                            </p>
                            <div className="d-flex flex-column flex-sm-row gap-3">
                                <Link to="/register" className="btn btn-primary btn-lg fw-bold px-5 py-3 rounded-pill shadow transition-transform hover-lift text-white">
                                    <i className="bi bi-laptop me-2"></i> Download for Desktop
                                </Link>
                                <a href="#pricing" className="btn btn-outline-primary btn-lg fw-bold px-5 py-3 rounded-pill bg-white hover-lift">
                                    View Pricing
                                </a>
                            </div>
                        </div>
                        <div className="col-lg-6 position-relative text-center">
                            <div className="hero-blob position-absolute rounded-circle blur-3xl w-75 h-75 top-50 start-50 translate-middle" style={{backgroundColor: 'rgba(209, 18, 67, 0.08)'}}></div>
                            <img 
                                src="/hero-dashboard.png" 
                                alt="Billing and Inventory software showcase" 
                                className="img-fluid rounded-4 position-relative z-2 hover-float transition-all"
                                style={{ transform: 'perspective(1000px) rotateY(-5deg) rotateX(5deg)', maxHeight: '550px', objectFit: 'contain' }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-5 bg-white">
                <div className="container py-5">
                    <div className="text-center mb-5 pb-3">
                        <h6 className="text-primary fw-bold text-uppercase tracking-wider">About The System</h6>
                        <h2 className="display-6 fw-bold text-dark">Simplify Your Workflow</h2>
                        <p className="lead text-muted mx-auto" style={{maxWidth: '700px'}}>
                            StockFlow connects everything in one place, allowing you to focus on growing your business rather than fighting with spreadsheets.
                        </p>
                    </div>
                    
                    <div className="row g-4 justify-content-center">
                        <div className="col-md-6 col-lg-3">
                            <div className="card h-100 border-0 shadow-sm rounded-4 text-center p-4 hover-lift">
                                <div className="icon-box icon-blue mx-auto mb-4" style={{width: '60px', height: '60px', fontSize: '24px'}}>
                                    <FiTrendingUp />
                                </div>
                                <h5 className="fw-bold mb-3">Real-time Management</h5>
                                <p className="text-muted small mb-0">Manage all your inventory globally in real-time, completely eliminating sync errors.</p>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-3">
                            <div className="card h-100 border-0 shadow-sm rounded-4 text-center p-4 hover-lift">
                                <div className="icon-box icon-green mx-auto mb-4" style={{width: '60px', height: '60px', fontSize: '24px'}}>
                                    <FiBox />
                                </div>
                                <h5 className="fw-bold mb-3">Track Stock Easily</h5>
                                <p className="text-muted small mb-0">Precisely monitor stock levels, purchase histories, and incoming shipments.</p>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-3">
                            <div className="card h-100 border-0 shadow-sm rounded-4 text-center p-4 hover-lift">
                                <div className="icon-box icon-purple mx-auto mb-4" style={{width: '60px', height: '60px', fontSize: '24px'}}>
                                    <FiUsers />
                                </div>
                                <h5 className="fw-bold mb-3">Manage Staff</h5>
                                <p className="text-muted small mb-0">Govern internal access protocols. Assign robust staff roles to products securely.</p>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-3">
                            <div className="card h-100 border-0 shadow-sm rounded-4 text-center p-4 hover-lift">
                                <div className="icon-box icon-orange mx-auto mb-4" style={{width: '60px', height: '60px', fontSize: '24px'}}>
                                    <FiPieChart />
                                </div>
                                <h5 className="fw-bold mb-3">Detailed Analytics</h5>
                                <p className="text-muted small mb-0">Generate comprehensive PDF & CSV reports evaluating sales and logistics.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-5 bg-light">
                <div className="container py-5">
                    <div className="row align-items-center mb-5">
                        <div className="col-lg-6 mb-4 mb-lg-0">
                            <h6 className="text-primary fw-bold text-uppercase tracking-wider">Powerful Features</h6>
                            <h2 className="display-6 fw-bold text-dark mb-4">Stock, Accounting & Billing in One Place</h2>
                            <p className="lead text-muted mb-4">
                                Run your entire business smoothly. Handle your GST billing, manage comprehensive inventory pipelines, and track accounts without complex setups.
                            </p>
                            <Link to="/register" className="btn btn-outline-primary fw-bold px-4 py-2 rounded-pill">Start Free Trial <i className="bi bi-arrow-right ms-2"></i></Link>
                        </div>
                        <div className="col-lg-6">
                            <div className="row g-4">
                                <div className="col-sm-6">
                                    <div className="bg-white p-4 rounded-4 shadow-sm h-100 border border-light hover-border-primary transition-all">
                                        <FiBox className="text-primary mb-3 fs-3" />
                                        <h5 className="fw-bold fs-6">Product Management</h5>
                                        <p className="text-muted small mb-0">Easily add, categorize, and organize unlimited internal products.</p>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="bg-white p-4 rounded-4 shadow-sm h-100 border border-light hover-border-primary transition-all mt-sm-4">
                                        <FiTrendingUp className="text-success mb-3 fs-3" />
                                        <h5 className="fw-bold fs-6">Stock Tracking</h5>
                                        <p className="text-muted small mb-0">Keep flawless track of ins and outs systematically over time.</p>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="bg-white p-4 rounded-4 shadow-sm h-100 border border-light hover-border-primary transition-all">
                                        <FiBell className="text-warning mb-3 fs-3" />
                                        <h5 className="fw-bold fs-6">Inventory Alerts</h5>
                                        <p className="text-muted small mb-0">Never run out. Auto thresholds warn you of critical shortages.</p>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="bg-white p-4 rounded-4 shadow-sm h-100 border border-light hover-border-primary transition-all mt-sm-4">
                                        <FiUsers className="text-info mb-3 fs-3" />
                                        <h5 className="fw-bold fs-6">Staff Management</h5>
                                        <p className="text-muted small mb-0">Unique Staff IDs, restricted profile scopes, and admin validations.</p>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="bg-white p-4 rounded-4 shadow-sm h-100 border border-light hover-border-primary transition-all">
                                        <FiPieChart className="text-danger mb-3 fs-3" />
                                        <h5 className="fw-bold fs-6">Dashboard Analytics</h5>
                                        <p className="text-muted small mb-0">Visually engaging business insights at exactly a single glance.</p>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="bg-white p-4 rounded-4 shadow-sm h-100 border border-light hover-border-primary transition-all mt-sm-4">
                                        <FiFileText className="text-purple mb-3 fs-3" style={{color: '#6f42c1'}} />
                                        <h5 className="fw-bold fs-6">Sales & Reports</h5>
                                        <p className="text-muted small mb-0">Export tabular histories directly to standard CSV formats effortlessly.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-5 bg-white">
                <div className="container py-5">
                    <div className="text-center mb-5 pb-3">
                        <h6 className="text-primary fw-bold text-uppercase tracking-wider">Simple Pricing</h6>
                        <h2 className="display-6 fw-bold text-dark">Subscription Plans</h2>
                        <p className="lead text-muted mx-auto" style={{maxWidth: '600px'}}>
                            Transparent pricing formatted entirely in Indian Rupees (₹). Select the tier that matches your business scale.
                        </p>
                    </div>

                    <div className="row g-4 justify-content-center">
                        {/* Basic Plan */}
                        <div className="col-lg-4 col-md-6">
                            <div className="card h-100 border-light shadow-sm rounded-4 overflow-hidden position-relative hover-lift">
                                <div className="card-body p-5">
                                    <h4 className="fw-bold text-dark mb-1">Basic Plan</h4>
                                    <p className="text-muted small mb-4">Perfect for small startups</p>
                                    <div className="display-4 fw-bold text-dark mb-4">
                                        <span className="fs-3 text-muted">₹</span>2999<span className="fs-5 text-muted fw-normal">/yr</span>
                                    </div>
                                    <ul className="list-unstyled mb-5">
                                        <li className="mb-3 d-flex align-items-center">
                                            <FiCheckCircle className="text-success me-3 fs-5" /> <span className="text-secondary fw-semibold">Inventory tracking</span>
                                        </li>
                                        <li className="mb-3 d-flex align-items-center">
                                            <FiCheckCircle className="text-success me-3 fs-5" /> <span className="text-secondary fw-semibold">Product management</span>
                                        </li>
                                        <li className="mb-3 d-flex align-items-center">
                                            <FiCheckCircle className="text-success me-3 fs-5" /> <span className="text-secondary fw-semibold">Basic reporting</span>
                                        </li>
                                        <li className="mb-3 d-flex align-items-center">
                                            <FiCheckCircle className="text-success me-3 fs-5" /> <span className="text-secondary fw-semibold">Email support</span>
                                        </li>
                                    </ul>
                                    <button className="btn btn-outline-primary w-100 py-3 rounded-pill fw-bold">Buy Basic Plan</button>
                                </div>
                            </div>
                        </div>

                        {/* Lifetime Plan */}
                        <div className="col-lg-4 col-md-6">
                            <div className="card h-100 border-primary shadow rounded-4 overflow-hidden position-relative hover-lift">
                                <div className="position-absolute top-0 start-50 translate-middle-x bg-primary text-white px-4 py-1 rounded-bottom fw-bold small">
                                    MOST POPULAR
                                </div>
                                <div className="card-body p-5">
                                    <h4 className="fw-bold text-primary mb-1">Lifetime Plan</h4>
                                    <p className="text-muted small mb-4">Best value for enterprises</p>
                                    <div className="display-4 fw-bold text-dark mb-4">
                                        <span className="fs-3 text-muted">₹</span>9999<span className="fs-5 text-muted fw-normal"> one-time</span>
                                    </div>
                                    <ul className="list-unstyled mb-5">
                                        <li className="mb-3 d-flex align-items-center">
                                            <FiCheckCircle className="text-primary me-3 fs-5" /> <span className="text-secondary fw-bold">Lifetime access</span>
                                        </li>
                                        <li className="mb-3 d-flex align-items-center">
                                            <FiCheckCircle className="text-primary me-3 fs-5" /> <span className="text-secondary fw-semibold">Advanced reporting</span>
                                        </li>
                                        <li className="mb-3 d-flex align-items-center">
                                            <FiCheckCircle className="text-primary me-3 fs-5" /> <span className="text-secondary fw-semibold">Staff management</span>
                                        </li>
                                        <li className="mb-3 d-flex align-items-center">
                                            <FiCheckCircle className="text-primary me-3 fs-5" /> <span className="text-secondary fw-semibold">Priority 24/7 support</span>
                                        </li>
                                    </ul>
                                    <button className="btn btn-primary w-100 py-3 rounded-pill fw-bold shadow-sm">Buy Lifetime Plan</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-5 bg-light">
                <div className="container py-5">
                    <div className="row g-5">
                        <div className="col-lg-5">
                            <h6 className="text-primary fw-bold text-uppercase tracking-wider">Contact Us</h6>
                            <h2 className="display-6 fw-bold text-dark mb-4">Get In Touch</h2>
                            <p className="text-muted mb-5 pe-lg-4">
                                Have questions about our pricing plans, custom integrations, or robust technical logic? We'd love to hear from you. Drop us a line below.
                            </p>
                            
                            <div className="d-flex mb-4">
                                <div className="bg-white rounded-circle d-flex align-items-center justify-content-center shadow-sm text-primary me-4" style={{width: '50px', height: '50px', flexShrink: 0}}>
                                    <FiMail size={20} />
                                </div>
                                <div>
                                    <h6 className="fw-bold text-dark mb-1">Email Us</h6>
                                    <p className="text-muted small mb-0">contact@stockflow.com</p>
                                </div>
                            </div>
                            
                            <div className="d-flex mb-4">
                                <div className="bg-white rounded-circle d-flex align-items-center justify-content-center shadow-sm text-primary me-4" style={{width: '50px', height: '50px', flexShrink: 0}}>
                                    <FiPhone size={20} />
                                </div>
                                <div>
                                    <h6 className="fw-bold text-dark mb-1">Call Us</h6>
                                    <p className="text-muted small mb-0">+91 98765 43210</p>
                                </div>
                            </div>
                            
                            <div className="d-flex">
                                <div className="bg-white rounded-circle d-flex align-items-center justify-content-center shadow-sm text-primary me-4" style={{width: '50px', height: '50px', flexShrink: 0}}>
                                    <FiMapPin size={20} />
                                </div>
                                <div>
                                    <h6 className="fw-bold text-dark mb-1">Business Address</h6>
                                    <p className="text-muted small mb-0">Tech Hub, Cyber City<br/>Gurugram, Haryana 122002, India</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="col-lg-7">
                            <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5">
                                {contactStatus === 'success' && (
                                    <div className="alert alert-success fw-semibold">
                                        <FiCheckCircle className="me-2" /> Thank you for reaching out! We've received your message and will get back to you shortly.
                                    </div>
                                )}
                                {contactStatus === 'error' && (
                                    <div className="alert alert-danger fw-semibold">
                                        Failed to send message. Please try again later.
                                    </div>
                                )}
                                <form onSubmit={handleContactSubmit}>
                                    <div className="row g-3">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label text-muted fw-semibold small">First Name</label>
                                            <input type="text" className="form-control bg-light border-0 py-2" required placeholder="Sourav" 
                                                value={contactForm.first_name} onChange={e => setContactForm({...contactForm, first_name: e.target.value})}
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label text-muted fw-semibold small">Last Name</label>
                                            <input type="text" className="form-control bg-light border-0 py-2" required placeholder="Singh" 
                                                value={contactForm.last_name} onChange={e => setContactForm({...contactForm, last_name: e.target.value})}
                                            />
                                        </div>
                                        <div className="col-12 mb-3">
                                            <label className="form-label text-muted fw-semibold small">Email Address</label>
                                            <input type="email" className="form-control bg-light border-0 py-2" required placeholder="sourav@example.com" 
                                                value={contactForm.email} onChange={e => setContactForm({...contactForm, email: e.target.value})}
                                            />
                                        </div>
                                        <div className="col-12 mb-4">
                                            <label className="form-label text-muted fw-semibold small">Message</label>
                                            <textarea className="form-control bg-light border-0 py-2" rows="4" required placeholder="How can we help?"
                                                value={contactForm.message} onChange={e => setContactForm({...contactForm, message: e.target.value})}
                                            ></textarea>
                                        </div>
                                        <div className="col-12">
                                            <button type="submit" className="btn btn-primary w-100 py-3 fw-bold rounded-pill" disabled={contactLoading}>
                                                {contactLoading ? 'Sending...' : 'Send Message'}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-dark text-white pt-5 pb-4">
                <div className="container pt-4">
                    <div className="row mb-5 pb-3 border-bottom border-secondary border-opacity-50">
                        <div className="col-lg-4 col-md-6 mb-4 mb-lg-0 pe-lg-5">
                            <Link className="navbar-brand fw-bold text-white fs-4 d-flex align-items-center mb-4" to="/">
                                <img src="/logo.svg" alt="logo" width="30" height="30" className="me-2" style={{filter: 'brightness(0) invert(1)'}} />
                                StockFlow
                            </Link>
                            <p className="text-secondary small mb-4">
                                Helping modern businesses seamlessly manage inventory, monitor exact stock analytics, and control product hierarchies efficiently since 2026.
                            </p>
                            <div className="d-flex gap-3">
                                <a href="#" className="text-white hover-primary transition-all"><FiTwitter size={20}/></a>
                                <a href="#" className="text-white hover-primary transition-all"><FiLinkedin size={20}/></a>
                                <a href="#" className="text-white hover-primary transition-all"><FiGithub size={20}/></a>
                            </div>
                        </div>
                        
                        <div className="col-lg-2 col-md-6 mb-4 mb-lg-0">
                            <h6 className="text-white fw-bold mb-4">Quick Links</h6>
                            <ul className="list-unstyled mb-0 list-gap-sm">
                                <li className="mb-2"><a href="#home" className="text-secondary text-decoration-none hover-white transition-all">Home</a></li>
                                <li className="mb-2"><a href="#about" className="text-secondary text-decoration-none hover-white transition-all">About</a></li>
                                <li className="mb-2"><a href="#features" className="text-secondary text-decoration-none hover-white transition-all">Features</a></li>
                                <li className="mb-2"><a href="#pricing" className="text-secondary text-decoration-none hover-white transition-all">Pricing</a></li>
                            </ul>
                        </div>
                        
                        <div className="col-lg-2 col-md-6 mb-4 mb-lg-0">
                            <h6 className="text-white fw-bold mb-4">Support</h6>
                            <ul className="list-unstyled mb-0">
                                <li className="mb-2"><Link to="/login" className="text-secondary text-decoration-none hover-white transition-all">Client Login</Link></li>
                                <li className="mb-2"><Link to="/register" className="text-secondary text-decoration-none hover-white transition-all">Sign Up Free</Link></li>
                                <li className="mb-2"><a href="#contact" className="text-secondary text-decoration-none hover-white transition-all">Contact Helpdesk</a></li>
                                <li className="mb-2"><a href="#" className="text-secondary text-decoration-none hover-white transition-all">Privacy Policy</a></li>
                            </ul>
                        </div>

                        <div className="col-lg-4 col-md-6">
                            <h6 className="text-white fw-bold mb-4">Newsletter</h6>
                            <p className="text-secondary small mb-3">Subscribe to receive system update bulletins.</p>
                            <div className="input-group mb-3">
                                <input type="email" className="form-control bg-secondary bg-opacity-25 border-secondary text-white placeholder-light px-3" placeholder="Email address" />
                                <button className="btn btn-primary px-3 fw-bold" type="button">Subscribe</button>
                            </div>
                        </div>
                    </div>
                    
                    <div className="row align-items-center">
                        <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
                            <p className="text-secondary small mb-0">
                                &copy; {new Date().getFullYear()} StockFlow. All rights reserved.
                            </p>
                        </div>
                        <div className="col-md-6 text-center text-md-end">
                            <span className="text-secondary small">Proudly developed in India</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
