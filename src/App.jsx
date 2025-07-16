import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Admin from "./Components/Admin/Admin";
import Navbar from "./Components/Navbar/Navbar";
import Home from "./Pages/Home/Home";
import Login from "./Components/Login/login";
import Register from "./Components/Register/Register";
import ClientDashboard from "./Components/ClientDashboard/ClientDashboard.jsx";

// Helper function to get user from localStorage
const getCurrentUser = () => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
    return null;
  }
};

// Helper function to check if user is authenticated
const isAuthenticated = () => {
  const user = getCurrentUser();
  const token = localStorage.getItem("token");
  return user && token;
};

// Helper function to check if user is admin
const isAdmin = () => {
  const user = getCurrentUser();
  return user && user.role === "ADMIN";
};

// Protected Route Component for Admin
const AdminRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isAdmin()) {
    return <Navigate to="/client" replace />;
  }
  
  return children;
};

// Protected Route Component for authenticated users
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Component to redirect authenticated users away from login/register
const AuthRedirect = ({ children }) => {
  const user = getCurrentUser();
  
  if (isAuthenticated()) {
    // Redirect based on user role
    if (user.role === "ADMIN") {
      return <Navigate to="/admin" replace />;
    } else {
      return <Navigate to="/client" replace />;
    }
  }
  
  return children;
};

function AppContent() {
  const location = useLocation();

  // Cacher la navbar sur /login et /register
  const hideNavbarRoutes = ["/login", "/register", "/admin", "/client"];
  const hideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        
        {/* Auth Routes - redirect if already logged in */}
        <Route 
          path="/login" 
          element={
            <AuthRedirect>
              <Login />
            </AuthRedirect>
          } 
        />
        <Route 
          path="/register" 
          element={
            <AuthRedirect>
              <Register />
            </AuthRedirect>
          } 
        />

        {/* Protected Routes */}
        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          } 
        />
        <Route 
          path="/admin/*" 
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          } 
        />
        <Route 
          path="/client" 
          element={
            <ProtectedRoute>
              <ClientDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Catch all route - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
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