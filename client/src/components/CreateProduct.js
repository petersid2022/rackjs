import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from './NavBar.js';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

const CreateProduct = () => {
    const navigate = useNavigate();
    const [product, setProduct] = useState({
        name: '',
        price: '',
        date: new Date().toLocaleDateString('en-GB'), // Updated line
        quantity: '',
        expdate: '',
        tags: '',
    });

    const [priceError, setPriceError] = useState(false);
    const [quantityError, setQuantityError] = useState(false);

    const onChange = (e) => {
        const { name, value } = e.target;

        if (name === 'quantity') {
            setProduct({ ...product, [name]: value });
        } else if (name === 'unit') {
            setProduct({ ...product, unit: value });
        } else {
            setProduct({ ...product, [name]: value });
        }

        if (name === 'price') {
            if (!/^\d+(\.\d+)?$/.test(value) || value < 0 || value > 5000) {
                setPriceError(true);
            } else {
                setPriceError(false);
            }
        }

        if (name === 'quantity') {
            if (!/^\d+(\.\d+)?$/.test(value) || value < 0 || value > 100) {
                setQuantityError(true);
            } else {
                setQuantityError(false);
            }
        }
    };

    const onSubmit = (e) => {
        e.preventDefault();

        const combinedQuantity = `${product.quantity} ${product.unit}`;

        if (!product.name || !product.price || !combinedQuantity || !product.tags || !product.expdate) {
            alert('Please fill in all the required fields.');
            return;
        }

        // Format the expiration date
        const formattedExpdate = moment(product.expdate).format('DD/MM/YYYY');

        axios
            .post('http://localhost:8082/api/products', { ...product, quantity: combinedQuantity, expdate: formattedExpdate })
            .then((res) => {
                if (res.status === 200) {
                    setProduct({
                        name: '',
                        price: '',
                        date: new Date().toLocaleDateString('en-GB'),
                        quantity: '',
                        expdate: '',
                        tags: '',
                    });
                    navigate('/products');
                } else {
                    console.log('ERROR STATUS: ', res.status);
                }
            })
            .catch((err) => {
                console.log('Error in CreateProduct!', err);
            });
    };

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'visible';
        };
    }, []);

    return (
        <div>
            <NavBar />
            <div className="CreateProduct">
                <div className="container py-32">
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
                                    <a href="/create-product" className="ml-1 text-xl font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-white">New Product</a>
                                </div>
                            </li>
                        </ol>
                    </nav>
                    <div className="max-w-md p-6 mx-auto bg-white rounded-lg overflow-hidden shadow-lg">
                        <form onSubmit={onSubmit}>
                            <div className="mb-6">
                                <label htmlFor="base-input" className="block mb-2 text-2xl font-medium text-gray-900 dark:text-white">
                                    Product name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={product.name}
                                    onChange={onChange}
                                    id="base-input"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-2xl rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div className="mb-6">
                                <label htmlFor="base-input" className="block mb-2 text-2xl font-medium text-gray-900 dark:text-white">
                                    Price (for 1 unit)
                                </label>
                                <input
                                    type="text"
                                    name="price"
                                    value={product.price}
                                    onChange={onChange}
                                    className={`bg-gray-50 border border-gray-300 text-gray-900 text-2xl rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${priceError ? 'border-red-500' : ''
                                        }`}
                                    required
                                />
                                {priceError && <p className="text-red-500">Please enter a valid price.</p>}
                            </div>
                            <div className="flex mb-6">
                                <div className="w-3/4 mr-4">
                                    <label htmlFor="base-input" className="block mb-2 text-2xl font-medium text-gray-900 dark:text-white">
                                        Quantity
                                    </label>
                                    <input
                                        type="text"
                                        name="quantity"
                                        value={product.quantity}
                                        onChange={onChange}
                                        id="base-input"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-2xl rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        required
                                    />
                                </div>
                                <div className="w-1/4">
                                    <label htmlFor="unit-select" className="block text-2xl font-medium text-gray-900 dark:text-white">Unit</label>
                                    <select
                                        id="unit-select"
                                        placeholder="Unit"
                                        name="unit"
                                        onChange={onChange}
                                        className="text-xl p-2.5 text-gray-500 bg-white border rounded-md shadow-sm outline-none appearance-none w-full focus:border-indigo-600"
                                        required
                                    >
                                        <option> </option>
                                        <option>kg</option>
                                        <option>τεμ</option>
                                        <option>ml</option>
                                    </select>
                                </div>
                                {quantityError && <p className="text-red-500">Please enter a valid value.</p>}
                            </div>
                            <div className="mb-6">
                                <label htmlFor="base-input" className="block mb-2 text-2xl font-medium text-gray-900 dark:text-white">
                                    Expiration Date
                                </label>
                                <input
                                    type="Date"
                                    name="expdate"
                                    value={product.expdate}
                                    onChange={onChange}
                                    id="base-input"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-2xl rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div className="mb-6 flex">
                                <div className="w-full">
                                    <label htmlFor="base-input" className="block text-2xl font-medium text-gray-900 dark:text-white">
                                        Tags
                                    </label>
                                    <select
                                        placeholder="Tags"
                                        name="tags"
                                        value={product.tags}
                                        onChange={onChange}
                                        className="text-xl p-2.5 text-gray-500 bg-white border rounded-md shadow-sm outline-none appearance-none w-full focus:border-indigo-600"
                                        required
                                    >
                                        <option> </option>
                                        <option>Grains/Cereals</option>
                                        <option>Sauces</option>
                                        <option>Fruits</option>
                                        <option>Vegetables</option>
                                        <option>Meat</option>
                                        <option>Seafood</option>
                                        <option>Dairy</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <button type="submit" className="block text-2xl bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                    Add
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateProduct;
