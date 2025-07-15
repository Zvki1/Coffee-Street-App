import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CiShoppingCart } from "react-icons/ci";
import { IoIosStar } from "react-icons/io";
import "./ClientDashboard.css";

const coffeeMenu = [
  { id: 1, name: "Vanilla Latte", price: 4.5, rating: "4.5", image: "/src/assets/popular/popular_1.png" },
  { id: 2, name: "Espresso", price: 2.8, rating: "4.0", image: "/src/assets/popular/popular_2.png" },
  { id: 3, name: "Caramel Macchiato", price: 5.2, rating: "4.8", image: "/src/assets/popular/popular_3.png" },
];

const formatPrice = (price) => `€${price.toFixed(2)}`;

const ClientDashboard = () => {
  const navigate = useNavigate();
  const [client, setClient] = useState({ email: "", name: "", password: "" });
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [view, setView] = useState("menu");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ street: "", postal: "", city: "", payment: "card", cardName: "", cardNumber: "" });

  useEffect(() => {
    const stored = localStorage.getItem("client");
    if (stored) setClient(JSON.parse(stored));
  }, []);
  const isActive = (section) => view === section ? "btn btn-light" : "btn btn-outline-light";

  const handleAddToCart = (item) => {
    setCart((prev) => {
      const exists = prev.find(p => p.id === item.id);
      if (exists) {
        return prev.map(p => p.id === item.id ? { ...p, qty: p.qty + 1 } : p);
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCart((prev) =>
      prev.map(i => i.id === id ? { ...i, qty: i.qty + delta } : i).filter(i => i.qty > 0)
    );
  };

  const subtotal = cart.reduce((sum, item) => sum + item.qty * item.price, 0);
  const tax = subtotal * 0.2;
  const total = subtotal + tax;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleCheckout = () => {
    if (!form.street || !form.postal || !form.city) return alert("Complétez l'adresse.");
    if ((form.payment === "card" || form.payment === "paypal") && (!form.cardName || !form.cardNumber)) return alert("Complétez les infos bancaires.");

    const newOrder = {
      id: Date.now(),
      items: cart,
      address: `${form.street}, ${form.postal} ${form.city}`,
      status: "En cours",
      total,
      payment: form.payment
    };

    setOrders([...orders, newOrder]);
    setCart([]);
    setForm({ street: "", postal: "", city: "", payment: "card", cardName: "", cardNumber: "" });
    setShowModal(false);
    setView("orders");
    alert("✅ Commande confirmée !");
  };

  const handleLogout = () => {
    if (window.confirm("Voulez-vous vous déconnecter ?")) navigate("/");
  };

  const saveProfile = () => {
    localStorage.setItem("client", JSON.stringify(client));
    alert("✅ Profil mis à jour");
  };

  return (
    <div className="client-dashboard" style={{ backgroundImage: "url('/src/assets/bg/bg_client.png')", backgroundSize: "cover", backgroundAttachment: "fixed" }}>
      <nav className="navbar navbar-expand-lg navbar-dark px-4 py-3" style={{ backgroundColor: "rgba(0,0,0,0.4)" }}>
        <span className="navbar-brand fw-bold">Bienvenue {client.email}</span>
        <div className="ms-auto d-flex gap-3 align-items-center">
          <button className={isActive("menu")} onClick={() => setView("menu")}>Commander</button>
          <button className={isActive("orders")} onClick={() => setView("orders")}>Mes commandes</button>
          <button className={isActive("profile")} onClick={() => setView("profile")}>Profil</button>
          <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="container py-5">
        {view === "menu" && (
          <>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="fw-bold">Choisissez votre café ☕</h2>
              <button onClick={() => setShowModal(true)} className="btn-cart-toggle">
                <CiShoppingCart color="white" fontSize="1.8rem" />
                <span className="cart-count">{cart.reduce((sum, i) => sum + i.qty, 0)}</span>
              </button>
            </div>

            <div className="row g-4">
              {coffeeMenu.map(item => (
                <div key={item.id} className="col-md-4">
                  <div className="card coffee-card h-100 shadow-sm">
                    <img src={item.image} className="card-img-top" alt={item.name} />
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{item.name}</h5>
                      <p className="text-muted">{formatPrice(item.price)}</p>
                      <div className="d-flex justify-content-between align-items-center mt-auto">
                        <span className="text-warning d-flex align-items-center gap-1">{item.rating} <IoIosStar /></span>
                        <button onClick={() => handleAddToCart(item)} className="btn btn-coffee"><CiShoppingCart /> Ajouter</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {view === "orders" && (
          <div className="my-5">
            <h4 className="mb-3">📦 Mes Commandes</h4>
            {orders.length === 0 ? <p className="text-muted">Aucune commande enregistrée.</p> : (
              <ul className="list-group">
                {orders.map(order => (
                  <li key={order.id} className="list-group-item">
                    <div className="fw-bold">Commande #{order.id}</div>
                    <div>Status : {order.status}</div>
                    <div>Adresse : {order.address}</div>
                    <div>Total : {formatPrice(order.total)}</div>
                    <ul className="mt-2">
                      {order.items.map(i => <li key={i.id}>{i.name} × {i.qty}</li>)}
                    </ul>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {view === "profile" && (
          <div className="my-5">
            <h4 className="mb-3">👤 Profil Utilisateur</h4>
            <div className="card p-4" style={{ maxWidth: "500px" }}>
              <input className="form-control mb-2" placeholder="Email" value={client.email} onChange={e => setClient({ ...client, email: e.target.value })} />
              <input className="form-control mb-2" placeholder="Nom" value={client.name} onChange={e => setClient({ ...client, name: e.target.value })} />
              <input className="form-control mb-2" placeholder="Mot de passe" type="password" value={client.password} onChange={e => setClient({ ...client, password: e.target.value })} />
              <button className="btn btn-primary" onClick={saveProfile}>Sauvegarder</button>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="cart-modal-overlay">
          <div className="cart-modal">
            <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            <h4 className="mb-3">🛒 Panier</h4>
            {cart.length === 0 ? <p className="text-muted">Votre panier est vide.</p> : (
              <div className="cart-items mb-3">
                {cart.map((item) => (
                  <div key={item.id} className="d-flex justify-content-between align-items-center mb-2">
                    <div>
                      <strong>{item.name}</strong>
                      <div className="text-muted">{formatPrice(item.price)} × {item.qty}</div>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <button className="qty-btn" onClick={() => updateQty(item.id, -1)}>-</button>
                      <span>{item.qty}</span>
                      <button className="qty-btn" onClick={() => updateQty(item.id, 1)}>+</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mb-3">
              <label>Adresse</label>
              <input type="text" name="street" className="form-control mb-2" placeholder="Rue" value={form.street} onChange={handleChange} />
              <input type="text" name="postal" className="form-control mb-2" placeholder="Code Postal" value={form.postal} onChange={handleChange} />
              <input type="text" name="city" className="form-control mb-2" placeholder="Ville" value={form.city} onChange={handleChange} />
              <select name="payment" className="form-select mb-2" value={form.payment} onChange={handleChange}>
                <option value="card">Carte Bancaire</option>
                <option value="paypal">PayPal</option>
                <option value="cash">Espèces</option>
              </select>
              {(form.payment === "card" || form.payment === "paypal") && (
                <>
                  <input type="text" name="cardName" className="form-control mb-2" placeholder="Nom sur la carte" value={form.cardName} onChange={handleChange} />
                  <input type="text" name="cardNumber" className="form-control mb-2" placeholder="Numéro de carte" value={form.cardNumber} onChange={handleChange} />
                </>
              )}
              <p>Sous-total : <strong>{formatPrice(subtotal)}</strong></p>
              <p>Taxe (20%) : <strong>{formatPrice(tax)}</strong></p>
              <p>Total : <strong>{formatPrice(total)}</strong></p>
            </div>
            <button className="btn btn-success w-100" onClick={handleCheckout}>✅ Confirmer</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientDashboard;
