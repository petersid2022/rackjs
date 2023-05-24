import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavBar from './NavBar.js';

function UpdateProductInfo() {
    const [product, setProduct] = useState({
        name: '',
        quantity: '',
    });
    const { id } = useParams();
    const navigate = useNavigate();

    const fetchProductPrice = async () => {
        try {
            const res = await axios.get(`http://localhost:8082/api/products/${id}`);
            setProduct({
                name: res.data.name,
                quantity: res.data.quantity,
            });
        } catch (error) {
            console.error('Error fetching product price:', error);
        }
    };

    useEffect(() => {
        fetchProductPrice();
    }, [id]);

    const onChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const data = {
            name: product.name,
            quantity: product.quantity,
        };
        axios
            .put(`http://localhost:8082/api/products/${id}`, data)
            .then((res) => {
                if (res.status === 200) {
                    navigate(`/show-product/${id}`);
                } else {
                    console.log('ERROR STATUS: ', res.status);
                }
            })
            .catch((err) => {
                console.log('Error in UpdateProductInfo!', err);
            });
        event.target.reset();
    };

    return (
        <div>
            <NavBar />
            <div className='UpdateProductInfo'>
                <div className='container py-32'>
                    <nav className="flex" aria-label="Breadcrumb">
                        <ol className="inline-flex items-center space-x-1 md:space-x-3">
                            <li className="inline-flex items-center">
                                <a href="/products" className="inline-flex items-center text-xl font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
                                    <svg aria-hidden="true" className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
                                    Products
                                </a>
                            </li>
                            <li>
                                <div className="flex items-center">
                                    <svg aria-hidden="true" className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                                    <a href="#" onClick={() => window.history.back()} className="ml-1 text-xl font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-white">Product Details</a>
                                </div>
                            </li>
                            <li>
                                <div className="flex items-center">
                                    <svg aria-hidden="true" className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                                    <a href="#" onClick={() => window.location.reload()} className="ml-1 text-xl font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-white">Update product info</a>
                                </div>
                            </li>
                        </ol>
                    </nav>
                    <br />
                    <div className="max-w-md p-8 mx-auto bg-white rounded-lg overflow-hidden shadow-lg">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-6">
                                <label htmlFor="base-input" className="block mb-2 text-xl font-medium text-gray-900 dark:text-white">Product name</label>
                                <input type="text" name='name' value={product.name} onChange={onChange} id="base-input" className="bg-gray-50 border border-gray-300 text-gray-900 text-xl rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                            </div>
                            <div className="mb-6">
                                <label htmlFor="base-input" className="block mb-2 text-xl font-medium text-gray-900 dark:text-white">Quantity</label>
                                <input type="text" name='quantity' value={product.quantity} onChange={onChange} id="base-input" className="bg-gray-50 border border-gray-300 text-gray-900 text-xl rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                            </div>
                            <div>
                                <button type="submit" className="block mb-2 text-xl  bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                    Update
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateProductInfo;
