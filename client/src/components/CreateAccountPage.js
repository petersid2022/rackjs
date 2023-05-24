import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreateAccountPage() {

    const navigate = useNavigate();
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [admincode, setAdmincode] = useState("");
    const [userType, setUserType] = useState("User");
    const [accountCreated, setAccountCreated] = useState(false);
    const [showDiv, setShowDiv] = useState(false);
    const [remainingSeconds, setRemainingSeconds] = useState(5); // Initial value set to the number of seconds for the redirect

    const ADMIN_PASS = "admin";

    const handleSubmit = (e) => {
        if (userType === "Admin" && admincode !== ADMIN_PASS) {
            alert("Incorrect admin code");
        } else {
            e.preventDefault();
            fetch('http://localhost:8082/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({ firstname, lastname, email, password, admincode, userType }),
            }).then((response) => response.json()).then((data) => {
                if (data.status === "ok") {
                    setAccountCreated(true);
                } else {
                    alert("User already exists");
                }
            });
        }
    };

    const handleRadioChange = (e) => {
        setShowDiv(e.target.checked);
        setUserType(e.target.checked ? "Admin" : "User");
    }

    useEffect(() => {
        if (accountCreated) {
            const redirectTimeout = setTimeout(() => {
                navigate('/login'); // Replace '/destination' with the desired route
            }, remainingSeconds * 1000); // Convert seconds to milliseconds

            const interval = setInterval(() => {
                setRemainingSeconds((prevSeconds) => prevSeconds - 1);
            }, 1000); // Update remaining seconds every second

            return () => {
                clearTimeout(redirectTimeout);
                clearInterval(interval);
            };
        }
    }, [accountCreated, remainingSeconds, userType]);


    return (
        <section className="bg-gradient-to-r from-gray-100 to-gray-300">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-4xl dark:text-white">
                            Sign up
                        </h1>

                        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label for="firstname" className="block mb-2 text-xl font-medium text-gray-900 dark:text-white">First name</label>
                                <input type="text" name="firstname" id="firstname" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-xl rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John" onChange={(e) => setFirstname(e.target.value)} required="" />
                            </div>
                            <div>
                                <label for="lastname" className="block mb-2 text-xl font-medium text-gray-900 dark:text-white">Last name</label>
                                <input type="text" name="lastname" id="lastname" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-xl rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Doe" onChange={(e) => setLastname(e.target.value)} required="" />
                            </div>
                            <div>
                                <label for="email" className="block mb-2 text-xl font-medium text-gray-900 dark:text-white">Email</label>
                                <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-xl rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" onChange={(e) => setEmail(e.target.value)} required="" />
                            </div>
                            <div>
                                <label for="password" className="block mb-2 text-xl font-medium text-gray-900 dark:text-white">Password</label>
                                <input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-xl rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={(e) => setPassword(e.target.value)} required="" />
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" onChange={handleRadioChange} required="" />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600">  </div>
                                <span className="ml-3 text-xm font-medium text-gray-900 dark:text-gray-300">I am an admin</span>
                            </label>
                            {showDiv && (
                                <div>
                                    <label for="admincode" className="block mb-2 text-xl font-medium text-gray-900 dark:text-white">Special admin code</label>
                                    <input type="password" name="admincode" id="admincode" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-xl rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="" onChange={(e) => setAdmincode(e.target.value)} />
                                </div>
                            )}
                            <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-xl px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Create an account</button>
                            {accountCreated && (
                                <p className="animate-bounce text-xl font-medium text-center text-gray-400">
                                    Account created successfully :) Redirecting in {remainingSeconds} seconds...
                                </p>
                            )}
                            <p className="text-xl font-light text-gray-500 dark:text-gray-400">
                                Already have an account? <a href="/login" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Login here</a>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
