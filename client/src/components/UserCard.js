import React, { useState, useEffect } from 'react';
import '../App.css';

const UserCard = ({ id, fname, lname, email, usertype }) => {
    const [numberofusers, setNumberofusers] = useState(0);
    const [showDiv, setShowDiv] = useState(false);

    useEffect(() => {
        const getallusers = () => {
            fetch("http://localhost:8082/getAllUser", {
                method: "GET",
            })
                .then((res) => res.json())
                .then((data) => {
                    setNumberofusers(data.data.length);
                });
        };

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
                if (data.data.email === email) {
                    setShowDiv(true);
                } else {
                    setShowDiv(false);
                }
            })
            .catch((err) => {
                console.log(err);
            });

        getallusers();
    }, [email]);

    const deleteOneUser = (id, name) => {
        if (showDiv === true) {
            if (window.confirm(`Are you sure you want to delete user: ${name}`)) {
                fetch("http://localhost:8082/deleteUser", {
                    method: "POST",
                    crossDomain: true,
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                    body: JSON.stringify({
                        id: id,
                    }),
                })
                    .then((res) => res.json())
                    .then((data) => {
                        if (data.status === 200) {
                            window.localStorage.clear();
                            window.location.href = "/login";
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            } else {
                console.log("Not deleted");
            }
        } else {
            if (window.confirm(`Are you sure you want to delete user: ${name}`)) {
                fetch("http://localhost:8082/deleteUser", {
                    method: "POST",
                    crossDomain: true,
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                    body: JSON.stringify({
                        id: id,
                    }),
                })
                    .then((res) => res.json())
                    .then((data) => {
                        if (data.status === 200) {
                            alert("User deleted");
                            window.location.href = "/team";
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            } else {
                console.log("Not deleted");
            }
        }
    };

    const changeUserType = (email, newValue) => {
        let updatedValue;
        if (newValue === "Admin") {
            updatedValue = "User";
        } else if (newValue === "User") {
            updatedValue = "Admin";
        }

        fetch("http://localhost:8082/changeusertype", {
            method: "POST",
            crossDomain: true,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
                email: email,
                newValue: updatedValue,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.status === "Ok") { // Check the correct property name for success
                    window.location.href = "/team";
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <div>
            {showDiv === true ? (
                <div className="bg-white text-gray-800 max-w-lg rounded-lg overflow-hidden shadow-lg">
                    <div className="py-2">
                        <div className="ml-4 my-2 font-bold text-2xl">
                            <h1> First Name: {fname} (its u!)</h1>
                            <h1> Last name: {lname}</h1>
                            <h1> Email: {email} </h1>
                            <h1> Usertype: {usertype} </h1>
                        </div>
                        <div className="flex justify-center -ml-7 text-xl">
                            <button onClick={() => deleteOneUser(id, fname)} className="ml-4 my-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                                Delete
                            </button>
                            <button onClick={() => changeUserType(email, usertype)} className="ml-4 my-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                {usertype === "Admin" ? "Demote" : "Promote"}
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-white text-gray-800 max-w-lg rounded-lg overflow-hidden shadow-lg">
                    <div className="py-2">
                        <div className="ml-4 my-2 font-bold text-2xl">
                            <h1> First Name: {fname} </h1>
                            <h1> Last name: {lname}</h1>
                            <h1> Email: {email} </h1>
                            <h1> Usertype: {usertype} </h1>
                        </div>
                        <div className="flex justify-center -ml-7 text-xl">
                            <button onClick={() => deleteOneUser(id, fname)} className="ml-4 my-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                                Delete
                            </button>
                            <button onClick={() => changeUserType(email, usertype)} className="ml-4 my-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                {usertype === "Admin" ? "Demote" : "Promote"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserCard;
