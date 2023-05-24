import { useParams, useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import '../App.css';
import axios from 'axios';
import NavBar from './NavBar.js';

export default function ShowProductDetails() {
    const [product, setProduct] = useState({});
    const [showPopup, setShowPopup] = useState(false); // State to control the visibility of the popup
    const { id } = useParams();
    const navigate = useNavigate();
    const popupRef = useRef(null);
    const [userType, setUserType] = useState(false);
    const [quantity, setQuantity] = useState("");

    useEffect(() => {
        axios
            .get(`http://localhost:8082/api/products/${id}`)
            .then((res) => {
                setProduct(res.data);
            })
            .catch((err) => {
                console.log('Error from ShowProductsDetails', err);
            });
    }, [id]);

    useEffect(() => {
        fetch("http://localhost:8082/userdata", {
            method: "POST",
            crossDomain: true,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
                token: window.localStorage.getItem("token"),
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.data.userType === "Admin") {
                    setUserType(true);
                }
            });
    }, []);

    const editProduct = () => {
        window.location.href = `/edit-product/${id}`;
    };

    const addnewprice = () => {
        window.location.href = `/add-new-price/${id}`;
    };

    const onDeleteClick = (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            axios
                .delete(`http://localhost:8082/api/products/${id}`)
                .then((res) => {
                    if (res.status === 200) {
                        navigate('/products');
                    }
                })
                .catch((err) => {
                    console.log('Error form ShowProductDetails_deleteClick', err);
                });
        } else {
            console.log('Not deleted');
        }
    };

    const renderPrices = () => {
        const alltheprices = product.alltheprices || [];
        const lastPrice = alltheprices.length > 0 ? alltheprices[alltheprices.length - 1] : null; // Get the price at the last index or set to null if array is empty

        return (
            <div>
                {lastPrice ? (
                    <p>Last updated: {lastPrice.date}</p>
                ) : (
                    <p>Original price shown. Click the 'Add new price' button to update it!</p>
                )}
            </div>
        );
    };

    const ProductItem = (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg bg-gradient-to-r from-gray-100 to-gray-300">
            <table className="w-full text-sm text-left">
                <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th scope="col" className="px-6 py-3 bg-gray-100 text-gray-800 text-2xl font-medium border-r">
                            1)
                        </th>
                        <th scope="col" className="px-6 py-3 bg-gray-100 text-gray-800 text-2xl font-medium border-r">
                            Name
                        </th>
                        <th scope="col" className="px-6 py-3 bg-gray-100 text-gray-800 text-2xl font-medium">
                            {product.name}
                        </th>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th scope="col" className="px-6 py-3 bg-gray-100 text-gray-800 text-2xl font-medium border-r">
                            2)
                        </th>
                        <th scope="col" className="px-6 py-3 bg-gray-100 text-gray-800 text-2xl font-medium border-r">
                            Quantity
                        </th>
                        <th scope="col" className="px-6 py-3 bg-gray-100 text-gray-800 text-2xl font-medium">
                            {product.quantity}
                        </th>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th scope="col" className="px-6 py-3 bg-gray-100 text-gray-800 text-2xl font-medium border-r">
                            3)
                        </th>
                        <th scope="col" className="px-6 py-3 bg-gray-100 text-gray-800 text-2xl font-medium border-r">
                            Price
                        </th>
                        <th scope="col" className="px-6 py-3 bg-gray-100 text-gray-800 text-2xl font-medium">
                            {product.price}&nbsp;&euro; {renderPrices()}
                        </th>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th scope="col" className="px-6 py-3 bg-gray-100 text-gray-800 text-2xl font-medium border-r">
                            4)
                        </th>
                        <th scope="col" className="px-6 py-3 bg-gray-100 text-gray-800 text-2xl font-medium border-r">
                            Expiration Date
                        </th>
                        <th scope="col" className="px-6 py-3 bg-gray-100 text-gray-800 text-2xl font-medium">
                            {product.expdate}
                        </th>
                    </tr>
                </thead>
            </table>
        </div>
    );

    const openPopup = () => {
        setShowPopup(true);
    };

    const closePopup = () => {
        setShowPopup(false);
    };

    const handleSubmit = () => {

        const num1 = parseInt(product.quantity);
        const num2 = parseInt(quantity);
        const sum = num1 + num2;
        const spaceIndex = product.quantity.indexOf(" ");
        const strpart = product.quantity.substring(spaceIndex + 1);
        const newquantity = sum.toString() + strpart;

        const cartData = {
            productId: product._id,
            price: product.price,
            quantity: newquantity,
            name: product.name,
        };

        axios
            .post('http://localhost:8082/addtocart', cartData)
            .then((res) => {
                console.log('Cart data added successfully:', res.data);
                // Handle the response data here
                // res.data contains the JSON response from the server
                // You can access specific data using res.data.propertyName
                closePopup();
            })
            .catch((err) => {
                console.log('Error adding cart data:', err);
                closePopup();
            });
    };


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                closePopup();
            }
        };

        window.addEventListener('mousedown', handleClickOutside);

        return () => {
            window.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div>
            <NavBar />
            <div className='ShowProductList'>
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
                                    <a href={`/show-product/${product._id}`} className="ml-1 text-xl font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-white">Product Details</a>
                                </div>
                            </li>
                        </ol>
                    </nav>
                    <div className='col-md-10 m-auto py-16'>{ProductItem}
                        {userType === true ? (
                            <button
                                onClick={() => onDeleteClick(product._id)}
                                className="my-4 float-left hover:animate-pulse  bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded font-bold text-xl"
                            >
                                Delete Product
                            </button>
                        ) : (
                            <div></div>
                        )}
                        {userType === true ? (
                            <button onClick={addnewprice} className="my-4 hover:animate-pulse  float-right bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-xl">
                                Add new price
                            </button>
                        ) : (
                            <div></div>
                        )}
                        <div className="flex justify-center text-xl mt-4 ">
                            <button
                                onClick={openPopup}
                                className="mr-4 hover:animate-pulse bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Order now
                            </button>
                            <button
                                onClick={editProduct}
                                className="bg-blue-500 hover:animate-pulse hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Edit Product
                            </button>
                        </div>
                    </div>
                </div>
                {showPopup && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                        <div ref={popupRef} className="bg-white rounded-lg p-4">
                            <h2 className="text-2xl text-black">Add to Cart</h2>
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="quantity" className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">Quantity</label>
                                    <input
                                        type="number"
                                        id="quantity"
                                        className="bg-gray-50 p-1.5 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder=""
                                        required
                                        value={quantity}
                                        onChange={(e) => setQuantity(e.target.value)}
                                    />
                                </div>
                            </form>
                            <button
                                onClick={handleSubmit}
                                className="mr-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Add to cart
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
};
