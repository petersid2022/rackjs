import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const ProductCard = (props) => {
    const product = props.product;

    return (
        <div className="hover:animate-pulse bg-white text-gray-800 max-w-sm rounded-lg overflow-hidden shadow-xl">
            <Link
                to={`/show-product/${product._id}`}
                className="text-gray-800 hover:text-indigo-500 transition-colors duration-300"
                style={{ textDecoration: "none" }}
            >
                <img
                    src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
                    alt="Products"
                    height="200"
                />

                <div className="px-6 pt-3">
                    <div className="font-bold text-2xl">
                        <h1 className="text-gray-800 hover:text-indigo-500 transition-colors duration-300">
                            {product.name}
                        </h1>
                    </div>
                </div>
                <div className="px-6 pb-3">
                    <p className="text-gray-900 text-2xl">Τιμή: {product.price}&nbsp;&euro;</p>
                    <p className="text-gray-900 text-2xl">Ποσότητα: {product.quantity}</p>
                    <p className="text-gray-900 text-2xl">Ημερομηνία Λήξης: {product.expdate}</p>
                    <br />
                    <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">{product.tags}</span>
                </div>
            </Link>
        </div>
    );
};

export default ProductCard;
