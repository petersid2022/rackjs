import React, { useState, useEffect } from 'react';
import '../App.css';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Link } from 'react-router-dom';
import NavBar from './NavBar.js';

export default function Graphs() {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [checkedItems, setCheckedItems] = useState([]);

    const handleChange = (event) => {
        setSearchTerm(event.target.value);
    };

    useEffect(() => {
        axios
            .get('http://localhost:8082/api/products')
            .then((res) => {
                setProducts(res.data);
            })
            .catch((err) => {
                console.log('Error from ShowProductList', err);
            });
    }, []);

    useEffect(() => {
        const regex = new RegExp(removeDiacritics(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), "gi");
        const results = products.filter((product) =>
            removeDiacritics(product.name).match(regex)
        );
        setSearchResults(results);
    }, [searchTerm, products]);

    const removeDiacritics = (str) => {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    };

    const handleCheckboxChange = (event, itemName) => {
        if (event.target.checked) {
            setCheckedItems([...checkedItems, itemName]);
        } else {
            const updatedCheckedItems = checkedItems.filter(item => item !== itemName);
            setCheckedItems(updatedCheckedItems);
        }
    };

    const filteredItems = products.filter(item => checkedItems.includes(item.name));

    const productList =
        products.length === 0 ? (
            <div className="text-center" >
                <div role="status" >
                    <svg
                        aria-hidden="true"
                        className="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                        />
                        <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"
                        />
                    </svg>
                    <span className="sr-only" >Loading...</span>
                </div>
            </div>
        ) : filteredItems.map((item) =>
            <div key={item._id}>
                <div className="relative float-right ml-5 py-5">
                    <Link
                        to={`/show-product/${item._id}`}
                        className="text-gray-800 hover:text-indigo-500 transition-colors duration-300"
                    >
                        <h2 className="text-2xl font-bold text-gray-800">{item.name}</h2>
                    </Link>
                    <LineChart
                        width={700}
                        height={400}
                        data={item.alltheprices}
                        margin={{ top: 5, right: 0, bottom: 5, left: 0 }}
                    >
                        <CartesianGrid stroke="#ccc" strokeDasharray="10 10" />
                        <XAxis
                            dataKey="date"
                        />
                        <YAxis dataKey="price" />
                        <Tooltip />
                        <Line
                            type="monotone"
                            dataKey="price"
                            stroke="#8884d8"
                            strokeWidth={7}
                        />
                    </LineChart>
                </div>
                <br />
            </div>
        )

    const table = searchResults.map((product) => (
        <tbody key={product._id}>
            <tr className="text-xl bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <td className="w-4 p-4 border-r">
                    <div className="flex items-center">
                        <input
                            onChange={(event) => handleCheckboxChange(event, product.name)}
                            id="checkbox-table-search-1"
                            type="checkbox"
                            className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label htmlFor="checkbox-table-search-1" className="sr-only">
                            checkbox
                        </label>
                    </div>
                </td>
                <td className="px-6 py-4 border-r font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {product.name}
                </td>
                <td className="px-6 py-4 border-r">{product.quantity}</td>
                <td className="px-6 py-4 border-r">{product.tags}</td>
                <td className="px-6 py-4">{product.price}</td>
            </tr>
        </tbody>
    ));

    return (
        <div>
            <NavBar />
            <div className="ShowProductList" >
                <div className="container py-32" >
                    <div className="flex">
                        <div className="w-full">
                            <input
                                type="text"
                                className="border text-2xl border-gray-300 p-2 rounded text-black"
                                placeholder="Search"
                                value={searchTerm}
                                onChange={handleChange}
                            />
                            <div className="pb-3" />
                            <div className="pt-2 relative overflow-x-auto shadow-md sm:rounded-lg">
                                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                    <thead className="text-2xl text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                        <tr>
                                            <th scope="col" className="p-4 border-r">
                                                <div className="flex items-center"></div>
                                            </th>
                                            <th scope="col" className="px-6 py-3 border-r">
                                                Product name
                                            </th>
                                            <th scope="col" className="px-6 py-3 border-r">
                                                Quantity
                                            </th>
                                            <th scope="col" className="px-6 py-3 border-r">
                                                Category
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Price
                                            </th>
                                        </tr>
                                    </thead>
                                    {table}
                                </table>
                            </div>
                        </div>
                        <div>{productList}</div>
                    </div>
                </div>
            </div>
        </div>

    );
}
