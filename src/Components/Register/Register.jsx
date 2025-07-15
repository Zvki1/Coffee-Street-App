import React from "react";
import { Link } from "react-router-dom";
import "../Login/Login.css";

const Register = () => {
  return (
    <div className="login-page d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <h2 className="mb-4 text-center">Créer un compte</h2>
        <form>
          <div className="mb-3">
            <label htmlFor="prenom" className="form-label">Prénom</label>
            <input
              type="text"
              className="form-control"
              id="prenom"
              name="prenom"
              placeholder="Jean"
              required
              pattern="^[A-Za-zÀ-ÿ\-'\s]+$"
              title="Le prénom ne doit pas contenir de chiffres"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="nom" className="form-label">Nom</label>
            <input
              type="text"
              className="form-control"
              id="nom"
              name="nom"
              placeholder="Dupont"
              required
              pattern="^[A-Za-zÀ-ÿ\-'\s]+$"
              title="Le nom ne doit pas contenir de chiffres"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="phone" className="form-label">Numéro de téléphone</label>
            <input
              type="tel"
              className="form-control"
              id="phone"
              name="phone"
              placeholder="+33 6 12 34 56 78"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">Adresse email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              placeholder="email@example.com"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Mot de passe</label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">S'inscrire</button>
        </form>

        <p className="signup-link mt-3 text-center">
          Déjà un compte ? <Link to="/login">Se connecter</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
