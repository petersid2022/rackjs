import React, { useState, useEffect } from 'react';
import "../App.css";

export default function NavBar() {
    const [activeLink, setActiveLink] = useState('');

    useEffect(() => {
        const currentPath = window.location.pathname;
        const link = currentPath === '/' ? 'home' : currentPath.substring(1);
        setActiveLink(link);
    }, []);

    const handleClick = (link) => {
        setActiveLink(link);
    };

    const logout = () => {
        window.localStorage.clear();
        window.location.href = '/login';
    };

    return (
        <header className="z-50 bg-white shadow-lg h-24 hidden md:flex top-0 fixed w-full">
            <a href="/" style={{ textDecoration: "none" }} className="flex-shrink-0 flex items-center justify-center px-4 lg:px-6 xl:px-8">
                <h2 className="bg-gradient-to-r from-purple-800 via-violet-900 to-purple-800 bg-clip-text text-7xl font-extrabold text-transparent">Rack</h2>
            </a>
            <nav className="header-links contents font-semibold text-base lg:text-lg">
                <ul className="flex items-center ml-2 xl:ml-8 mr-auto text-2xl">
                    <li className={`p-3 xl:p-6 ${activeLink === 'home' ? 'active' : ''}`}>
                        <a href="/" onClick={() => handleClick('home')} className="relative">
                            <span>Dashboard</span>
                            {activeLink === 'home' && <div className="absolute bottom-0 left-0 w-full h-1 bg-purple-800" />}
                        </a>
                    </li>
                    <li className={`p-3 xl:p-6 ${activeLink === 'products' ? 'active' : ''}`}>
                        <a href="/products" onClick={() => handleClick('products')} className="relative">
                            <span>Products</span>
                            {activeLink === 'products' && <div className="absolute bottom-0 left-0 w-full h-1 bg-purple-800" />}
                        </a>
                    </li>
                    <li className={`p-3 xl:p-6 ${activeLink === 'price-history' ? 'active' : ''}`}>
                        <a href="/price-history" onClick={() => handleClick('price-history')} className="relative">
                            <span>Pricing</span>
                            {activeLink === 'price-history' && <div className="absolute bottom-0 left-0 w-full h-1 bg-purple-800" />}
                        </a>
                    </li>
                    <li className={`p-3 xl:p-6 ${activeLink === 'cart' ? 'active' : ''}`}>
                        <a href="/cart" onClick={() => handleClick('cart')} className="relative">
                            <span>Cart</span>
                            {activeLink === 'cart' && <div className="absolute bottom-0 left-0 w-full h-1 bg-purple-800" />}
                        </a>
                    </li>
                    <li className={`p-3 xl:p-6 ${activeLink === 'team' ? 'active' : ''}`}>
                        <a href="/team" onClick={() => handleClick('team')} className="relative">
                            <span>Your Team</span>
                            {activeLink === 'team' && <div className="absolute bottom-0 left-0 w-full h-1 bg-purple-800" />}
                        </a>
                    </li>
                </ul>
            </nav>
            <div className="flex items-center px-4 lg:px-6 xl:px-8">
                <button onClick={logout} className="bg-red-500 hover:bg-red-700 text-white font-bold px-4 xl:px-6 py-2 xl:py-3 rounded text-2xl">Logout</button>
            </div>
        </header>
    );
}
