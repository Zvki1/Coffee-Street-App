import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Admin from "./Components/Admin/Admin";
import Navbar from './Components/Navbar/Navbar';
import Home from './Pages/Home/Home';
import Login from './Components/Login/login';
import Register from './Components/Register/Register';
import ClientDashboard from "./Components/ClientDashboard/ClientDashboard.jsx";

function AppContent() {
  const location = useLocation();

  // Cacher la navbar sur /login et /register
  const hideNavbarRoutes = ['/login', '/register','/admin','/client'];
  const hideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/admin" element={<Admin />} />   
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/*" element={<Admin />} />
        <Route path="/client" element={<ClientDashboard />} />
        

      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
