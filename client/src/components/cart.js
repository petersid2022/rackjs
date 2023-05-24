import React, { useState, useEffect } from 'react';
import '../App.css';
import NavBar from './NavBar.js';

export default function Cart() {
    const [products, setProducts] = useState([]);

    const fetchCart = () => {
        fetch("http://localhost:8082/getcart", {
            method: "GET",
        })
            .then((res) => res.json())
            .then((data) => {
                const mergedProducts = {};

                // Merge and accumulate quantities
                data.data.forEach((product) => {
                    const productId = product.productId;
                    if (mergedProducts[productId]) {
                        mergedProducts[productId].quantity += parseInt(product.quantity, 10);
                    } else {
                        mergedProducts[productId] = { ...product, quantity: parseInt(product.quantity, 10) };
                    }
                });

                const mergedProductsArray = Object.values(mergedProducts);
                setProducts(mergedProductsArray);
            });
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const removeProduct = (productid) => {
        const updatedProducts = products.filter((product) => product.productId !== productid);
        setProducts(updatedProducts);

        // Send delete request to the server
        fetch("http://localhost:8082/deletecart", {
            method: "DELETE",
            crossDomain: true,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
                productId: productid,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                setProducts(updatedProducts);
                window.location.reload();
                console.log(data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const table = products.map((product) => (
        <tbody key={product.productId}>
            <tr className="text-xl bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <td className="px-6 py-4 border-r font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {product.name}
                </td>
                <td className="px-6 py-4 border-r">{product.quantity}</td>
                <td className="px-6 py-4 border-r">{product.price}</td>
                <td className="px-6 py-4">  <button
                    onClick={() => removeProduct(product.productId)}
                    className="text-red-500 hover:text-red-700"
                >
                    Remove
                </button></td>
            </tr>
        </tbody>
    ));

    return (
        <div>
            <NavBar />
            <div className="ShowProductList" >
                <div className="container py-32" >
                    <div className="pt-2 relative overflow-x-auto shadow-md sm:rounded-lg">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-2xl text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3 border-r">
                                        Product name
                                    </th>
                                    <th scope="col" className="px-6 py-3 border-r">
                                        Quantity
                                    </th>
                                    <th scope="col" className="px-6 py-3 border-r">
                                        Price
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            {table}
                        </table>
                    </div>
                    <br />
                    <button
                        type="submit"
                        className="float-right text-2xl bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                    >
                        Checkout
                    </button>
                </div>
            </div>
        </div>
    );
}
