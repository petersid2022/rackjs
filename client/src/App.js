import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

import CreateProduct from './components/CreateProduct';
import ShowProductDetails from './components/ShowProductDetails';
import UpdateProductInfo from './components/UpdateProductInfo';
import LoginPage from './components/LoginPage';
import CreateAccountPage from './components/CreateAccountPage';
import UserDetails from './components/UserDetails';
import Team from './components/Team.js';
import Graphs from './components/graphs.js';
import AddNewPrice from './components/AddNewPrice.js';
import Cart from './components/cart.js';
import Products from './components/products.js';
import NotFound from './components/NotFound.js';

const App = () => {
    const isLoggedIn = window.localStorage.getItem("loggedIn");
    return (
        <Router>
            <div className="bg-gradient-to-r from-gray-100 to-gray-300">
                <Routes>
                    <Route
                        exact
                        path="/"
                        element={isLoggedIn === "true" ? <UserDetails /> : <LoginPage />}
                    />
                    <Route path='/login' element={<LoginPage />} />
                    <Route path='/products' element={<Products />} />
                    <Route path='/cart' element={<Cart />} />
                    <Route path='/register' element={<CreateAccountPage />} />
                    <Route path='/create-product' element={<CreateProduct />} />
                    <Route path='/team' element={<Team />} />
                    <Route path='/price-history' element={<Graphs />} />
                    <Route path='/edit-product/:id' element={<UpdateProductInfo />} />
                    <Route path='/add-new-price/:id' element={<AddNewPrice />} />
                    <Route path='/show-product/:id' element={<ShowProductDetails />} />
                    <Route path='*' element={<NotFound />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
