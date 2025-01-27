import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Importuj Routes umesto Switch
import Login from './components/Login';
import Register from './components/Register';
import ProductList from './components/ProductList';
import ProductDetails from './components/ProductDetails';
import EditProduct from './components/EditProduct';
import AddProduct from './components/AddProduct';
import ManufacturerList from './components/ManufacturerList';
import ManufacturerDetails from './components/ManufacturerDetails';
import AddManufacturer from './components/AddManufacturer';
import EditManufacturer from './components/EditManufacturer';
import UserList from './components/UserList';
import EditUser from './components/EditUser';
import CountMembers from './components/CountMembers';
import ChangePassword from './components/ChangePassword';
import AdminsList from './components/AdminsList';
import UsersList from './components/UsersList';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/edit-product/:productId" element={<EditProduct />} />
        <Route path="/edit-user/:userId" element={<EditUser />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/products" element={<ProductList />} />
        <Route path='/users' element={<UserList/>} />
        <Route path="/" element={<Login />} />
        <Route path="/countMembers" element={<CountMembers />} />
        <Route path="/admins" element={<AdminsList />} />
        <Route path="/user" element={<UsersList />} />
        <Route path="/authent/:userId" element={<ChangePassword />} />
        <Route path="/manufacturers" element={<ManufacturerList />} />
        <Route path="/manufacturer-details/:manufacturerId" element={<ManufacturerDetails />} />
        <Route path="/add-manufacturer" element={<AddManufacturer />} />
        <Route path="/edit-manufacturer/:manufacturerId" element={<EditManufacturer />} />
      </Routes>
    </Router>
  );
};

export default App;
