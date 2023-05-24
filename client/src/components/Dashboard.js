import React, { useEffect, useState } from "react";
import NavBar from "./NavBar.js"
import withAuth from "./withAuth.js";
import axios from "axios";
import ProductCard from "./ProductCard.js";

const Dashboard = () => {
    const [data, setData] = useState([]);
    const [products, setProducts] = useState([]);

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
                setData(data);
            });

        axios
            .get('http://localhost:8082/api/products')
            .then((res) => {
                if (res.status === 200) {
                    setProducts(res.data);
                } else {
                    console.log('Error', res.status);
                }
            })
            .catch((err) => {
                console.log('Error from ShowProductList', err);
            })
    }, []);

    const currentDate = new Date(); // Get the current date
    const fiveDaysFromNow = new Date(); // Create a date object for 5 days from now
    fiveDaysFromNow.setDate(currentDate.getDate() + 5);

    const sortedProducts = [...products]
        .filter((product) => {
            const parts = product.expdate.split('/');
            const expDate = new Date(parts[2], parts[1] - 1, parts[0]);
            return expDate < fiveDaysFromNow; // Filter products with expiration date less than 5 days from now
        })
        .sort((a, b) => {
            const aParts = a.expdate.split('/');
            const bParts = b.expdate.split('/');
            const aDate = new Date(aParts[2], aParts[1] - 1, aParts[0]);
            const bDate = new Date(bParts[2], bParts[1] - 1, bParts[0]);
            return aDate - bDate;
        });

    const productList =
        sortedProducts.length === 0 ? (
            <div className="text-center">
                <div role="status">
                    <svg
                        aria-hidden="true"
                        className="inline w-12 h-12 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        ) : sortedProducts.map((product, k) => (
            <ProductCard key={k} product={product} />
        ));
    console.log(products);

    return (
        <div>
            <NavBar />
            <div className='ShowProductList'>
                <div className='container py-32'>
                    <div className='row'>
                        <div className="col-md-12 d-flex flex-wrap">
                            <h1 className="text-5xl font-extrabold text-black dark:text-white">Hey {data.data?.firstname} {data.data?.lastname}</h1>
                            <h2 className="pt-2 text-4xl font-semibold text-gray-500 dark:text-gray-400">&emsp;Welcome back!</h2>
                        </div>
                    </div>
                    <h1 className="pt-8 text-3xl font-semibold text-black dark:text-white">These items are approaching their expiration dates (less than 5 days away 😥)</h1>
                    <div className="list">{productList}</div>
                </div>
            </div>
        </div>
    );
}
export default withAuth(Dashboard);
