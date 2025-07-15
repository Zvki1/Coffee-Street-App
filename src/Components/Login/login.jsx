import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    if (email === "admin@example.com" && password === "0000") {
      localStorage.setItem("admin", JSON.stringify({ email }));
      navigate("/admin");
    } else {
      localStorage.setItem("client", JSON.stringify({ email, name: "", password }));
      navigate("/client");
    }
  };

  return (
    <div className="login-page d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <h2 className="mb-4 text-center">Se connecter</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Adresse email</label>
            <input type="email" className="form-control" id="email" name="email" required />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Mot de passe</label>
            <input type="password" className="form-control" id="password" name="password" required />
          </div>
          <button type="submit" className="btn btn-primary w-100">Connexion</button>
        </form>
        <p className="signup-link mt-3 text-center">
          Pas de compte ? <Link to="/register">Créer un compte</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
