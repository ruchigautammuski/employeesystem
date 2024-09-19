import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import EmployeData from './components/EmployeData';
import CreateEmploye from './components/CreateEmploye';
import EditEmployee from './components/EditEmploye';
import WelcomePage from './components/WelcomePage';


const Navigation = () => {
  const location = useLocation();

  const hideNav = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/signup';

  return (
    <>
      {!hideNav && (
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Employee Management
            </Typography>
            <Button color="inherit" component={Link} to="/employee-data">
              Employee Data
            </Button>
            <Button color="inherit" component={Link} to="/create-employee">
              Create Employee
            </Button>
            <Button color="inherit" component={Link} to="/dashboard">
              Dashboard
            </Button>
          </Toolbar>
        </AppBar>
      )}
    </>
  );
};


const App = () => {
  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-employee" element={<CreateEmploye />} />
        <Route path="/employee-data" element={<EmployeData />} />
        <Route path="/employee/edit/:id" element={<EditEmployee />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </>
  );
};


const MainApp = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

export default MainApp;
