import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CiShoppingCart } from "react-icons/ci";
import { IoIosStar } from "react-icons/io";
import "./ClientDashboard.css";

const formatPrice = (price) => `€${price.toFixed(2)}`;

const ClientDashboard = () => {
  const navigate = useNavigate();
  const [client, setClient] = useState({ email: "", name: "", password: "" });
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [view, setView] = useState("menu");
  const [showModal, setShowModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState("");
  const [form, setForm] = useState({
    street: "",
    postal: "",
    city: "",
    payment: "card",
    cardName: "",
    cardNumber: "",
  });
  const calculateOrderTotal = (order) => {
    if (!order || !order.products || !Array.isArray(order.products)) {
      return 0;
    }

    return order.products.reduce((total, product) => {
      const price = product.price || 0;
      const quantity = product.quantity || 0;
      return total + price * quantity;
    }, 0);
  };
  // Fetch products from API
  const fetchProducts = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://134.122.92.14:8089/api/product/all",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Erreur lors du chargement des produits. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch orders from API
  const fetchOrders = async () => {
    setOrdersLoading(true);
    setOrdersError("");

    try {
      const response = await fetch("http://134.122.92.14:3000/api/orders", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Get current user ID from localStorage
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const clientId = user.id;

      // Filter orders to show only current client's orders
      const clientOrders = data.filter(
        (order) =>
          order.clientId === clientId || order.clientId === clientId.toString()
      );

      setOrders(clientOrders);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setOrdersError(
        "Erreur lors du chargement des commandes. Veuillez réessayer."
      );
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setClient({
          email: userData.email || "",
          name: `${userData.firstName || ""} ${userData.lastName || ""}`.trim(),
          password: "", // Don't store password in state
        });
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }

    fetchProducts();
    fetchOrders(); // Fetch orders when component mounts
  }, []);

  // Fetch orders when switching to orders view
  useEffect(() => {
    if (view === "orders") {
      fetchOrders();
    }
  }, [view]);

  const isActive = (section) =>
    view === section ? "btn btn-light" : "btn btn-outline-light";

  const handleAddToCart = (item) => {
    setCart((prev) => {
      const exists = prev.find((p) => p.id === item.id);
      if (exists) {
        return prev.map((p) =>
          p.id === item.id ? { ...p, qty: p.qty + 1 } : p
        );
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0)
    );
  };

  const subtotal = cart.reduce((sum, item) => sum + item.qty * item.price, 0);
  const tax = subtotal * 0.2;
  const total = subtotal + tax;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleCheckout = async () => {
    if (!form.street || !form.postal || !form.city)
      return alert("Complétez l'adresse.");
    if (
      (form.payment === "card" || form.payment === "paypal") &&
      (!form.cardName || !form.cardNumber)
    )
      return alert("Complétez les infos bancaires.");

    // Get client ID from localStorage
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const clientId = user.id;

    if (!clientId) {
      alert("Erreur: Utilisateur non identifié. Veuillez vous reconnecter.");
      return;
    }

    // Prepare order data for backend
    const orderData = {
      clientId: clientId.toString(),
      products: cart.map((item) => ({
        productId: item.id.toString(),
        quantity: item.qty,
      })),
    };

    setCheckoutLoading(true);

    try {
      // Send order to backend
      const response = await fetch("http://134.122.92.14:3000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();
      console.log("Order created successfully:", result);

      // Clear cart and form
      setCart([]);
      setForm({
        street: "",
        postal: "",
        city: "",
        payment: "card",
        cardName: "",
        cardNumber: "",
      });
      setShowModal(false);
      setView("orders");

      // Refresh orders after successful checkout
      fetchOrders();

      alert("commande passé veuillez visiter la liste des commandes pour voir son etat");
    } catch (error) {
      console.error("Error creating order:", error);
      alert(`Erreur lors de la création de la commande: ${error.message}`);
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleLogout = () => {
    const confirm = window.confirm("Voulez-vous vous déconnecter ?");
    if (!confirm) return;
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  const saveProfile = async () => {
    // Update user data in localStorage
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    const [firstName, ...lastNameParts] = client.name.split(" ");
    const lastName = lastNameParts.join(" ");

    const updatedUser = {
      ...currentUser,
      email: client.email,
      firstName: firstName || "",
      lastName: lastName || "",
    };
    console.log(updatedUser);

    try {
      const response = await fetch(
        `http://134.122.92.14:8081/api/v1/users/${currentUser.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(updatedUser),
        }
      );

      if (!response.ok) {
        alert("Erreur lors de la mise à jour du profil. Veuillez réessayer.");
        return;
      }

      setClient(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      alert("Profil mis à jour");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Erreur lors de la mise à jour du profil. Veuillez réessayer.");
    }
  };

  const retryFetch = () => {
    fetchProducts();
  };

  const retryFetchOrders = () => {
    fetchOrders();
  };

  return (
    <div
      className="client-dashboard"
      style={{
        backgroundImage: "url('/src/assets/bg/bg_client.png')",
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
      }}
    >
      <nav
        className="navbar navbar-expand-lg navbar-dark px-4 py-3"
        style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
      >
        <span className="navbar-brand fw-bold">Bienvenue {client.name}</span>
        <div className="ms-auto d-flex gap-3 align-items-center">
          <button className={isActive("menu")} onClick={() => setView("menu")}>
            Commander
          </button>
          <button
            className={isActive("orders")}
            onClick={() => setView("orders")}
          >
            Mes commandes
          </button>
          <button
            className={isActive("profile")}
            onClick={() => setView("profile")}
          >
            Profil
          </button>
          <button className="btn btn-outline-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <div className="container py-5">
        {view === "menu" && (
          <>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="fw-bold">Choisissez votre café ☕</h2>
              <button
                onClick={() => setShowModal(true)}
                className="btn-cart-toggle"
              >
                <CiShoppingCart color="white" fontSize="1.8rem" />
                <span className="cart-count">
                  {cart.reduce((sum, i) => sum + i.qty, 0)}
                </span>
              </button>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-5">
                <div className="spinner-border text-light" role="status">
                  <span className="visually-hidden">Chargement...</span>
                </div>
                <p className="text-light mt-2">Chargement des produits...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="alert alert-danger d-flex align-items-center justify-content-between">
                <span>{error}</span>
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={retryFetch}
                >
                  Réessayer
                </button>
              </div>
            )}

            {/* Products Grid */}
            {!loading && !error && (
              <div className="row g-4">
                {products.length === 0 ? (
                  <div className="col-12 text-center py-5">
                    <p className="text-light">
                      Aucun produit disponible pour le moment.
                    </p>
                  </div>
                ) : (
                  products.map((product) => (
                    <div key={product.id} className="col-md-4">
                      <div className="card coffee-card h-100 shadow-sm">
                        {/* Handle image - use placeholder if no image */}
                        <img
                          src={
                           
                            `/src/assets/popular/c${(product.id % 4) + 1}.png`
                          }
                          className="card-img-top"
                          alt={product.name}
                          onError={(e) => {
                            e.target.src = "/src/assets/popular/popular_1.png";
                          }}
                        />
                        <div className="card-body d-flex flex-column">
                          <h5 className="card-title">{product.name}</h5>
                          {product.description && (
                            <p className="text-muted small">
                              {product.description}
                            </p>
                          )}
                          <p className="text-muted">
                            {formatPrice(product.price)}
                          </p>
                          <div className="d-flex justify-content-between align-items-center mt-auto">
                            <span className=" d-flex align-items-center gap-1">
                            QTE: {product.quantity}
                            </span>
                            <button
                              onClick={() => handleAddToCart(product)}
                              className="btn btn-coffee"
                            >
                              <CiShoppingCart /> Ajouter
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}

        {view === "orders" && (
          <div className="my-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h4 className="mb-1 text-light">Mes Commandes</h4>
                <p className="text-light opacity-75 mb-0">
                  Suivez l'état de vos commandes en temps réel
                </p>
              </div>
              <button
                className="btn btn-outline-light btn-sm"
                onClick={retryFetchOrders}
                disabled={ordersLoading}
              >
                {ordersLoading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    ></span>
                    Actualisation...
                  </>
                ) : (
                  <>Actualiser</>
                )}
              </button>
            </div>

            {/* Orders Loading State */}
            {ordersLoading && (
              <div className="text-center py-5">
                <div
                  className="spinner-border text-light"
                  role="status"
                  style={{ width: "3rem", height: "3rem" }}
                >
                  <span className="visually-hidden">
                    Chargement des commandes...
                  </span>
                </div>
                <p className="text-light mt-3 h5">
                  Chargement de vos commandes...
                </p>
              </div>
            )}

            {/* Orders Error State */}
            {ordersError && (
              <div className="card border-danger">
                <div className="card-body text-center py-4">
                  <div className="text-danger mb-3">
                    <i
                      className="fas fa-exclamation-triangle"
                      style={{ fontSize: "2rem" }}
                    ></i>
                  </div>
                  <h5 className="text-danger">Erreur de chargement</h5>
                  <p className="text-muted mb-3">{ordersError}</p>
                  <button className="btn btn-danger" onClick={retryFetchOrders}>
                    Réessayer
                  </button>
                </div>
              </div>
            )}

            {/* Orders List */}
            {!ordersLoading && !ordersError && (
              <>
                {orders.length === 0 ? (
                  <div className="card bg-light border-0 shadow-sm">
                    <div className="card-body text-center py-5">
                      <div className="text-muted mb-3">
                        <i
                          className="fas fa-shopping-bag"
                          style={{ fontSize: "3rem", opacity: "0.3" }}
                        ></i>
                      </div>
                      <h5 className="text-muted">
                        Aucune commande pour le moment
                      </h5>
                      <p className="text-muted mb-3">
                        Vous n'avez pas encore passé de commande. Découvrez nos
                        délicieux cafés !
                      </p>
                      <button
                        className="btn btn-coffee"
                        onClick={() => setView("menu")}
                      >
                        Découvrir nos produits
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="row g-3">
                    {orders.map((order) => (
                      <div key={order.id} className="col-12">
                        <div className="card border-0 shadow-sm h-100">
                          <div className="card-body">
                            <div className="row align-items-start">
                              <div className="col-md-8">
                                <div className="d-flex align-items-center mb-3">
                                  <div
                                    className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                                    style={{
                                      width: "40px",
                                      height: "40px",
                                      fontSize: "1.2rem",
                                    }}
                                  >
                                    📦
                                  </div>
                                  <div>
                                    <h5 className="mb-1 fw-bold">
                                      Commande #{order._id.substring(0, 4)}
                                    </h5>
                                    <small className="text-muted">
                                      {order.createdAt
                                        ? new Date(
                                            order.createdAt
                                          ).toLocaleDateString("fr-FR", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                          })
                                        : "Date non disponible"}
                                    </small>
                                  </div>
                                </div>

                                {/* Status Badge */}
                                <div className="mb-3">
                                  <span
                                    className={`badge ${
                                      order.orderStatus === "validated"
                                        ? "bg-success"
                                        : order.orderStatus === "pending"
                                        ? "bg-warning text-dark"
                                        : order.orderStatus === "failed"
                                        ? "bg-danger"
                                        : "bg-info"
                                    } px-3 py-2`}
                                  >
                                    {order.orderStatus === "validated"
                                      ? "Validée"
                                      : order.orderStatus === "pending"
                                      ? "En cours"
                                      : order.orderStatus === "failed"
                                      ? "Annulée"
                                      : order.orderStatus || "En préparation"}
                                  </span>
                                </div>

                                {/* Products List */}
                                {order.products &&
                                  order.products.length > 0 && (
                                    <div className="mb-3">
                                      <h6 className="text-muted mb-2">
                                        Articles commandés :
                                      </h6>
                                      <div className="bg-light rounded p-3">
                                        {order.products.map(
                                          (product, index) => (
                                            <div
                                              key={index}
                                              className="d-flex justify-content-between align-items-center mb-1"
                                            >
                                              <span className="fw-medium">
                                                {product.name ||
                                                  `Produit ${product.productId}`}
                                              </span>
                                              <span className="badge bg-secondary">
                                                QTE: {product.quantity}
                                              </span>
                                            </div>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  )}
                              </div>

                              <div className="col-md-4 text-md-end">
                                {/* Total Price */}
                                <div className="mb-3">
                                  <small className="text-muted d-block">
                                    Total
                                  </small>
                                  <h4 className="text-primary fw-bold mb-0">
                                    {formatPrice(calculateOrderTotal(order))}
                                  </h4>
                                </div>

                                {/* Action Buttons */}
                                {/* <div className="d-flex flex-column gap-2">
                                  <button className="btn btn-outline-primary btn-sm">
                                    Voir détails
                                  </button>
                                  {order.orderStatus === "validated" && (
                                    <button className="btn btn-outline-success btn-sm">
                                      Laisser un avis
                                    </button>
                                  )}
                                  {order.orderStatus === "pending" && (
                                    <button className="btn btn-outline-warning btn-sm">
                                      Suivre la commande
                                    </button>
                                  )}
                                </div> */}
                              </div>
                            </div>

                            {/* Progress Bar for "En cours" orders */}
                            {order.orderStatus === "pending" && (
                              <div className="mt-3 pt-3 border-top">
                                <div className="d-flex justify-content-between mb-2">
                                  <small className="text-muted">
                                    Progression
                                  </small>
                                  <small className="text-muted">
                                    En préparation...
                                  </small>
                                </div>
                                <div
                                  className="progress"
                                  style={{ height: "6px" }}
                                >
                                  <div
                                    className="progress-bar bg-warning"
                                    role="progressbar"
                                    style={{ width: "65%" }}
                                    aria-valuenow="65"
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                  ></div>
                                </div>
                                <div className="d-flex justify-content-between mt-1">
                                  <small className="text-success">
                                    ✓ Confirmée
                                  </small>
                                  <small className="text-warning">
                                    • En préparation
                                  </small>
                                  <small className="text-muted">
                                    ○ En livraison
                                  </small>
                                  <small className="text-muted">○ Livrée</small>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {view === "profile" && (
          <div className="my-5">
            <h4 className="mb-3">👤 Profil Utilisateur</h4>
            <div className="card p-4" style={{ maxWidth: "500px" }}>
              <input
                className="form-control mb-2"
                placeholder="Email"
                value={client.email}
                onChange={(e) =>
                  setClient({ ...client, email: e.target.value })
                }
              />
              <input
                className="form-control mb-2"
                placeholder="Nom complet"
                value={client.name}
                onChange={(e) => setClient({ ...client, name: e.target.value })}
              />
              <input
                className="form-control mb-2"
                placeholder="Téléphone"
                type="text"
                value={client.phone}
                onChange={(e) =>
                  setClient({ ...client, phone: e.target.value })
                }
              />
              <button className="btn btn-primary" onClick={saveProfile}>
                Sauvegarder
              </button>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="cart-modal-overlay">
          <div className="cart-modal">
            <button className="close-btn" onClick={() => setShowModal(false)}>
              ×
            </button>
            <h4 className="mb-3">🛒 Panier</h4>
            {cart.length === 0 ? (
              <p className="text-muted">Votre panier est vide.</p>
            ) : (
              <div className="cart-items mb-3">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="d-flex justify-content-between align-items-center mb-2"
                  >
                    <div>
                      <strong>{item.name}</strong>
                      <div className="text-muted">
                        {formatPrice(item.price)} × {item.qty}
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <button
                        className="qty-btn"
                        onClick={() => updateQty(item.id, -1)}
                      >
                        -
                      </button>
                      <span>{item.qty}</span>
                      <button
                        className="qty-btn"
                        onClick={() => updateQty(item.id, 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mb-3">
              <label>Adresse</label>
              <input
                type="text"
                name="street"
                className="form-control mb-2"
                placeholder="Rue"
                value={form.street}
                onChange={handleChange}
              />
              <input
                type="text"
                name="postal"
                className="form-control mb-2"
                placeholder="Code Postal"
                value={form.postal}
                onChange={handleChange}
              />
              <input
                type="text"
                name="city"
                className="form-control mb-2"
                placeholder="Ville"
                value={form.city}
                onChange={handleChange}
              />
              <select
                name="payment"
                className="form-select mb-2"
                value={form.payment}
                onChange={handleChange}
              >
                <option value="card">Carte Bancaire</option>
                <option value="paypal">PayPal</option>
                <option value="cash">Espèces</option>
              </select>
              {(form.payment === "card" || form.payment === "paypal") && (
                <>
                  <input
                    type="text"
                    name="cardName"
                    className="form-control mb-2"
                    placeholder="Nom sur la carte"
                    value={form.cardName}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    name="cardNumber"
                    className="form-control mb-2"
                    placeholder="Numéro de carte"
                    value={form.cardNumber}
                    onChange={handleChange}
                  />
                </>
              )}
              <p>
                Sous-total : <strong>{formatPrice(subtotal)}</strong>
              </p>
              <p>
                Taxe (20%) : <strong>{formatPrice(tax)}</strong>
              </p>
              <p>
                Total : <strong>{formatPrice(total)}</strong>
              </p>
            </div>
            <button
              className="btn btn-success w-100"
              onClick={handleCheckout}
              disabled={checkoutLoading}
            >
              {checkoutLoading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Traitement...
                </>
              ) : (
                "Confirmer"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientDashboard;
