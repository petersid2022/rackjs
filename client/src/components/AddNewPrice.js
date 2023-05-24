import NavBar from './NavBar.js';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

const AddNewPrice = () => {
    const [prices, setPrices] = useState([]);
    const { id } = useParams();
    const [priceError, setPriceError] = useState(false);


    const handleAddPrice = (price, date) => {
        setPrices((prevPrices) => {
            const updatedPrices = [...prevPrices, { price, date }];
            return updatedPrices;
        });
    };

    const fetchProductPrice = async () => {
        try {
            const response = await axios.get(`http://localhost:8082/api/products/${id}`);
            const { price, date, alltheprices } = response.data;
            handleAddPrice(price, date); // Add the original price fetched from the API
            if (alltheprices) {
                // If additional prices exist, add them to the state
                setPrices([...prices, ...alltheprices]);
            }
        } catch (error) {
            console.error('Error fetching product price:', error);
        }
    };

    useEffect(() => {
        fetchProductPrice();
    }, [id]);

    const renderPrices = () => {
        return prices.map((price, index) => (
            <div key={index} className="my-2">
                <p className="text-xl font-medium text-gray-800">Price: {price.price}</p>
                <p className="text-gray-600">Date: {price.date}</p>
            </div>
        ));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const { price, date } = event.target.elements;

        const formattedDate = new Date(date.value).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
        });

        const updatedPrices = [...prices, { price: price.value, date: formattedDate }];

        axios
            .put(`http://localhost:8082/api/products/${id}`, {
                price: price.value,
                alltheprices: updatedPrices,
            })
            .then((res) => {
                console.log(res.status);
                //navigate(`/show-product/${id}`);
            })
            .catch((err) => {
                console.log('Error in UpdateProductInfo!', err);
            });

        setPrices(updatedPrices); // Update the local state with the new price
        event.target.reset();
    };

    const onChange = (e) => {
        const { name, value } = e.target;

        if (name === 'price') {
            if (!/^\d+(\.\d+)?$/.test(value) || value < 0 || value > 5000) {
                setPriceError(true);
            } else {
                setPriceError(false);
            }
        }
    };

    return (
        <div>
            <NavBar />
            <div className="ShowProductList">
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
                                    <a href="#" onClick={() => window.history.back()} className="ml-1 text-xl font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-white">Product Details</a>
                                </div>
                            </li>
                            <li>
                                <div className="flex items-center">
                                    <svg aria-hidden="true" className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                                    <a href="#" onClick={() => window.location.reload()} className="ml-1 text-xl font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-white">Add new price</a>
                                </div>
                            </li>
                        </ol>
                    </nav>
                    <div className="pt-8 flex justify-center items-center">
                        <div className="grid grid-cols-1 max-w-lg mx-auto">
                            <form onSubmit={handleSubmit} className="rounded-lg shadow-lg text-xl bg-white text-black border border-gray-300 p-4">
                                <div className="flex flex-wrap items-center">
                                    <div className="w-full md:w-auto md:flex-grow md:mr-2 mb-2">
                                        <label className="w-full">
                                            Price:
                                            <input
                                                type="text"
                                                name="price"
                                                onChange={onChange}
                                                className="w-full bg-white border border-gray-300 focus:bg-white focus:outline-none focus:border-blue-500 rounded py-2 px-4 text-black"
                                                required
                                            />
                                            {priceError && <p className="text-red-500">Please enter a valid price.</p>}
                                        </label>
                                    </div>
                                    <div className="w-full -mb-3 md:w-auto md:flex-shrink-0">
                                        <button
                                            type="submit"
                                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                                        >
                                            Add Price
                                        </button>
                                    </div>
                                </div>
                                <label className="mb-2 w-full">
                                    Date (month/day/year):
                                    <input
                                        type="date"
                                        name="date"
                                        className="w-full bg-white border border-gray-300 focus:bg-white focus:outline-none focus:border-blue-500 rounded py-2 px-4 text-black"
                                        required
                                    />
                                </label>
                            </form>
                        </div>
                        <div className="w-1/2 pl-2 bg-white rounded-lg overflow-y-scroll max-h-80 shadow-lg">
                            {renderPrices()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddNewPrice;
