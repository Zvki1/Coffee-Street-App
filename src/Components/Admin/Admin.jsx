import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaBoxOpen, FaReceipt, FaEdit, FaTrash, FaPlus, FaSignOutAlt } from "react-icons/fa";
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import "./Admin.css";

const Admin = () => {
  const navigate = useNavigate();
  const [section, setSection] = useState("dashboard");
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({});
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState("");
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState("");
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState("");

  const [users, setUsers] = useState([
    { id: 1, name: "Admin", lastname: "Root", email: "admin@example.com", password: "0000" }
  ]);
  const [products, setProducts] = useState([
    { id: 1, name: "Espresso", price: "2.50€" }
  ]);
  const [orders, setOrders] = useState([
    { id: 1, number: "CMD001", status: "En cours" },
    { id: 2, number: "CMD002", status: "Livrée" },
    { id: 3, number: "CMD003", status: "En cours" }
  ]);

  // Fetch products from API
  const fetchProducts = async () => {
    setProductsLoading(true);
    setProductsError("");

    try {
      const response = await fetch("http://134.122.92.14:8089/api/product/all",
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
      setProductsError("Erreur lors du chargement des produits. Veuillez réessayer.");
    } finally {
      setProductsLoading(false);
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
      setOrders(data);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setOrdersError("Erreur lors du chargement des commandes. Veuillez réessayer.");
    } finally {
      setOrdersLoading(false);
    }
  };

  // Fetch users from API
  const fetchUsers = async () => {
    setUsersLoading(true);
    setUsersError("");

    try {
      const response = await fetch("http://134.122.92.14:8081/api/v1/users", {
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
      // Extract users from the content property
      setUsers(data.content || []);
    } catch (err) {
      console.error("Error fetching users:", err);
      setUsersError("Erreur lors du chargement des utilisateurs. Veuillez réessayer.");
    } finally {
      setUsersLoading(false);
    }
  };

  // Calculate total price for an order
  const calculateOrderTotal = (order) => {
    if (!order || !order.products || !Array.isArray(order.products)) {
      return 0;
    }

    return order.products.reduce((total, product) => {
      const price = product.price || 0;
      const quantity = product.quantity || 0;
      return total + (price * quantity);
    }, 0);
  };

  // Fetch products when section changes to "products"
  useEffect(() => {
    if (section === "products") {
      fetchProducts();
    }
    if (section === "orders") {
      fetchOrders();
    }
    if (section === "users") {
      fetchUsers();
    }
  }, [section]);

  const logout = () => {
   const confirm = window.confirm("Voulez-vous vous déconnecter ?");
    if (!confirm) return;
    localStorage.clear();
    navigate("/");
  };

  const handleEdit = (item) => {
    setForm(item);
    setEditId(item.id);
    setEditMode(true);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    // Confirm deletion
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer cet élément ?");
    if (!confirmDelete) return;

    if (section === "products") {
      try {
        const response = await fetch(`http://134.122.92.14:8089/api/product/delete/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Remove product from local state
        setProducts(products.filter(p => p.id !== id));
        alert("✅ Produit supprimé avec succès !");
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("❌ Erreur lors de la suppression du produit. Veuillez réessayer.");
      }
    } else if (section === "users") {
      try {
        const response = await fetch(`http://134.122.92.14:8081/api/v1/users/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Remove user from local state
        setUsers(users.filter(u => u.id !== id));
        alert("✅ Utilisateur supprimé avec succès !");
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("❌ Erreur lors de la suppression de l'utilisateur. Veuillez réessayer.");
      }
    } else {
      // Handle local deletion for orders only
      if (section === "orders") {
        const update = (arr) => arr.filter(i => i.id !== id);
        setOrders(update(orders));
      }
    }

    // Reset form state
    setForm({});
    setEditId(null);
    setEditMode(false);
  };

  const handleSave = async () => {
    if (section === "users") {
      // Handle user creation/update with API
      try {
        if (editMode) {
          // Update user
          const response = await fetch(`http://134.122.92.14:8081/api/v1/users/${editId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              firstName: form.firstName,
              lastName: form.lastName,
              email: form.email,
              phone: form.phone,
              role: form.role,
              status: form.status || "ACTIVE"
            }),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const updatedUser = await response.json();
          setUsers(users.map(u => u.id === editId ? updatedUser : u));
          alert("✅ Utilisateur mis à jour avec succès !");
        } else {
          // Create new user
          const response = await fetch("http://134.122.92.14:8081/api/v1/users", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              firstName: form.firstName,
              lastName: form.lastName,
              email: form.email,
              password: form.password,
              phone: form.phone,
              role: form.role || "CLIENT",
              status: form.status || "ACTIVE"
            }),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const newUser = await response.json();
          setUsers([...users, newUser]);
          alert("✅ Utilisateur créé avec succès !");
        }
      } catch (error) {
        console.error("Error saving user:", error);
        alert("❌ Erreur lors de la sauvegarde de l'utilisateur. Veuillez réessayer.");
        return;
      }
    } else if (section === "products") {
      // Handle product creation/update with API
      try {
        if (editMode) {
          // Update product
          const response = await fetch(`http://134.122.92.14:8089/api/product/update/${editId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              name: form.name,
              description: form.description,
              price: parseFloat(form.price),
              quantity: parseInt(form.quantity)
            }),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const updatedProduct = await response.json();
          setProducts(products.map(p => p.id === editId ? updatedProduct : p));
          alert("✅ Produit mis à jour avec succès !");
        } else {
          // Create new product
          const response = await fetch("http://134.122.92.14:8089/api/product/create", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              name: form.name,
              description: form.description,
              price: parseFloat(form.price),
              quantity: parseInt(form.quantity)
            }),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const newProduct = await response.json();
          setProducts([...products, newProduct]);
          alert("✅ Produit créé avec succès !");
        }
      } catch (error) {
        console.error("Error saving product:", error);
        alert("❌ Erreur lors de la sauvegarde du produit. Veuillez réessayer.");
        return;
      }
    } else {
      // Handle local save for orders
      const updateList = (list, setList) => {
        if (editMode) {
          setList(list.map(i => (i.id === editId ? { ...i, ...form } : i)));
        } else {
          setList([...list, { id: list.length + 1, ...form }]);
        }
      };

      if (section === "orders") updateList(orders, setOrders);
    }

    // Reset form state
    setForm({});
    setEditId(null);
    setEditMode(false);
    setModalVisible(false);
  };

  const renderModal = () => {
    if (!modalVisible) return null;
    const inputs = {
      users: (
        <>
          <input 
            placeholder="Prénom" 
            className="form-control mb-2" 
            value={form.firstName || ""} 
            onChange={e => setForm({ ...form, firstName: e.target.value })} 
          />
          <input 
            placeholder="Nom" 
            className="form-control mb-2" 
            value={form.lastName || ""} 
            onChange={e => setForm({ ...form, lastName: e.target.value })} 
          />
          <input 
            placeholder="Email" 
            className="form-control mb-2" 
            type="email"
            value={form.email || ""} 
            onChange={e => setForm({ ...form, email: e.target.value })} 
          />
          <input 
            placeholder="Téléphone" 
            className="form-control mb-2" 
            value={form.phone || ""} 
            onChange={e => setForm({ ...form, phone: e.target.value })} 
          />
          {!editMode && (
            <input 
              placeholder="Mot de passe" 
              className="form-control mb-2" 
              type="password" 
              value={form.password || ""} 
              onChange={e => setForm({ ...form, password: e.target.value })} 
            />
          )}
          <select 
            className="form-control mb-2" 
            value={form.role || ""} 
            onChange={e => setForm({ ...form, role: e.target.value })}
          >
            <option value="">Sélectionner un rôle</option>
            <option value="CLIENT">CLIENT</option>
            <option value="ADMIN">ADMIN</option>
          </select>
          <select 
            className="form-control mb-2" 
            value={form.status || ""} 
            onChange={e => setForm({ ...form, status: e.target.value })}
          >
            <option value="">Sélectionner un statut</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        </>
      ),
      products: (
        <>
          <input 
            placeholder="Nom du produit" 
            className="form-control mb-2" 
            value={form.name || ""} 
            onChange={e => setForm({ ...form, name: e.target.value })} 
          />
          <textarea 
            placeholder="Description" 
            className="form-control mb-2" 
            rows="3"
            value={form.description || ""} 
            onChange={e => setForm({ ...form, description: e.target.value })} 
          />
          <input 
            placeholder="Prix (€)" 
            className="form-control mb-2" 
            type="number"
            step="0.01"
            min="0"
            value={form.price || ""} 
            onChange={e => setForm({ ...form, price: e.target.value })} 
          />
          <input 
            placeholder="Quantité en stock" 
            className="form-control mb-2" 
            type="number"
            min="0"
            value={form.quantity || ""} 
            onChange={e => setForm({ ...form, quantity: e.target.value })} 
          />
        </>
      ),
      orders: (
        <>
          <input placeholder="Numéro" className="form-control mb-2" value={form.number || ""} onChange={e => setForm({ ...form, number: e.target.value })} />
          <input placeholder="Statut" className="form-control mb-2" value={form.status || ""} onChange={e => setForm({ ...form, status: e.target.value })} />
        </>
      )
    };

    return (
      <div className="modal d-block bg-dark bg-opacity-50">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5>{editMode ? "Modifier" : "Ajouter"}</h5>
              <button className="btn-close" onClick={() => setModalVisible(false)}></button>
            </div>
            <div className="modal-body">{inputs[section]}</div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setModalVisible(false)}>Annuler</button>
              <button className="btn btn-primary" onClick={handleSave}>Sauvegarder</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const orderChartData = Object.entries(
    orders.reduce((acc, order) => {
      const status = order.orderStatus || order.status || "Non défini";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {})
  ).map(([status, value]) => ({ name: status, value }));

  const renderTable = () => {
    const data = {
      users,
      products,
      orders
    }[section];

    // Handle empty data array
    if (!data || data.length === 0) {
      return (
        <>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2>{section === "users" ? "Utilisateurs" : section === "products" ? "Produits" : "Commandes"}</h2>
            {/* Add refresh button for orders */}
            {section === "orders" && (
              <button 
                className="btn btn-outline-primary" 
                onClick={fetchOrders}
                disabled={ordersLoading}
              >
                {ordersLoading ? "Actualisation..." : "Actualiser"}
              </button>
            )}
            {(section !== "orders") && <button className="btn btn-success" onClick={() => {
              setEditMode(false);
              setForm({});
              setModalVisible(true);
            }}>
              <FaPlus /> Ajouter
            </button>}
          </div>
          
          {/* Show loading state for users */}
          {section === "users" && usersLoading && (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Chargement...</span>
              </div>
              <p className="mt-2">Chargement des utilisateurs...</p>
            </div>
          )}

          {/* Show loading state for products */}
          {section === "products" && productsLoading && (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Chargement...</span>
              </div>
              <p className="mt-2">Chargement des produits...</p>
            </div>
          )}

          {/* Show loading state for orders */}
          {section === "orders" && ordersLoading && (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Chargement...</span>
              </div>
              <p className="mt-2">Chargement des commandes...</p>
            </div>
          )}

          {/* Show error state for users */}
          {section === "users" && usersError && (
            <div className="alert alert-danger d-flex align-items-center justify-content-between">
              <span>{usersError}</span>
              <button className="btn btn-outline-danger btn-sm" onClick={fetchUsers}>
                Réessayer
              </button>
            </div>
          )}

          {/* Show error state for products */}
          {section === "products" && productsError && (
            <div className="alert alert-danger d-flex align-items-center justify-content-between">
              <span>{productsError}</span>
              <button className="btn btn-outline-danger btn-sm" onClick={fetchProducts}>
                Réessayer
              </button>
            </div>
          )}

          {/* Show error state for orders */}
          {section === "orders" && ordersError && (
            <div className="alert alert-danger d-flex align-items-center justify-content-between">
              <span>{ordersError}</span>
              <button className="btn btn-outline-danger btn-sm" onClick={fetchOrders}>
                Réessayer
              </button>
            </div>
          )}

          {/* Show empty state for users */}
          {section === "users" && !usersLoading && !usersError && (
            <div className="text-center py-5">
              <p className="text-muted">Aucun utilisateur disponible.</p>
            </div>
          )}

          {/* Show empty state */}
          {section === "products" && !productsLoading && !productsError && (
            <div className="text-center py-5">
              <p className="text-muted">Aucun produit disponible.</p>
            </div>
          )}

          {/* Show empty state for orders */}
          {section === "orders" && !ordersLoading && !ordersError && (
            <div className="text-center py-5">
              <p className="text-muted">Aucune commande disponible.</p>
            </div>
          )}
        </>
      );
    }

    return (
      <>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>{section === "users" ? "Utilisateurs" : section === "products" ? "Produits" : "Commandes"}</h2>
          <div className="d-flex gap-2">
            {/* Add refresh button for users */}
            {section === "users" && (
              <button 
                className="btn btn-outline-primary" 
                onClick={fetchUsers}
                disabled={usersLoading}
              >
                {usersLoading ? "Actualisation..." : "Actualiser"}
              </button>
            )}
            {/* Add refresh button for products */}
            {section === "products" && (
              <button 
                className="btn btn-outline-primary" 
                onClick={fetchProducts}
                disabled={productsLoading}
              >
                {productsLoading ? "Actualisation..." : "Actualiser"}
              </button>
            )}
            <button className="btn btn-success" onClick={() => {
              setEditMode(false);
              setForm({});
              setModalVisible(true);
            }}>
              <FaPlus /> Ajouter
            </button>
          </div>
        </div>

        {/* Show loading state for users */}
        {section === "users" && usersLoading && (
          <div className="text-center py-3">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Chargement...</span>
            </div>
            <p className="mt-2">Chargement des utilisateurs...</p>
          </div>
        )}

        {/* Show loading state for products */}
        {section === "products" && productsLoading && (
          <div className="text-center py-3">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Chargement...</span>
            </div>
            <p className="mt-2">Chargement des produits...</p>
          </div>
        )}

        {/* Show loading state for orders */}
        {section === "orders" && ordersLoading && (
          <div className="text-center py-3">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Chargement...</span>
            </div>
            <p className="mt-2">Chargement des commandes...</p>
          </div>
        )}

        {/* Show error state for users */}
        {section === "users" && usersError && (
          <div className="alert alert-danger d-flex align-items-center justify-content-between">
            <span>{usersError}</span>
            <button className="btn btn-outline-danger btn-sm" onClick={fetchUsers}>
              Réessayer
            </button>
          </div>
        )}

        {/* Show error state for products */}
        {section === "products" && productsError && (
          <div className="alert alert-danger d-flex align-items-center justify-content-between">
            <span>{productsError}</span>
            <button className="btn btn-outline-danger btn-sm" onClick={fetchProducts}>
              Réessayer
            </button>
          </div>
        )}

        {/* Show error state for orders */}
        {section === "orders" && ordersError && (
          <div className="alert alert-danger d-flex align-items-center justify-content-between">
            <span>{ordersError}</span>
            <button className="btn btn-outline-danger btn-sm" onClick={fetchOrders}>
              Réessayer
            </button>
          </div>
        )}

        {/* Show table when data is loaded and no error */}
        {((section === "products" && !productsLoading && !productsError) || 
          (section === "orders" && !ordersLoading && !ordersError) ||
          section === "users") && (
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                {section === "users" && (
                  <>
                    <th>Nom</th>
                    <th>Prénom</th>
                    <th>Email</th>
                    <th>Role</th>
                  </>
                )}
                {section === "products" && (
                  <>
                    <th>Nom</th>
                    <th>Prix</th>
                    <th>Quantité</th>
                    <th>Description</th>
                  </>
                )}
                {section === "orders" && (
                  <>
                    <th>Client ID</th>
                    <th>Produits</th>
                    <th>Total</th>
                    <th>Statut</th>
                  </>
                )}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id || item._id}>
                  <td>{item.id || item._id?.slice(-8)}</td>
                  {section === "users" && (
                      <>
                      <td>{item?.name || item.firstName} </td>
                      <td>{item.lastname || item.lastName}</td>
                      <td>{item.email}</td>
                      <td>{item.role}</td>
                    </>
                  )}
                  {section === "products" && (
                    <>
                      <td>{item.name}</td>
                      <td>{typeof item.price === "number" ? `€${item.price.toFixed(2)}` : item.price}</td>
                      <td>
                        <span className={`badge ${
                          item.quantity > 50 ? "bg-success" :
                          item.quantity > 10 ? "bg-warning text-dark" :
                          item.quantity > 0 ? "bg-danger" :
                          "bg-secondary"
                        }`}>
                          {item.quantity} unités
                        </span>
                      </td>
                      <td>
                        <div style={{ maxWidth: "600px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {item.description}
                        </div>
                      </td>
                    </>
                  )}
                  {section === "orders" && (
                    <>
                      <td>{item.clientId}</td>
                      <td>
                        {item.products?.length ? (
                          <div>
                            {item.products.map((product, index) => (
                              <div key={index} className="mb-1">
                                <small className="text-muted">
                                  {product.name} × {product.quantity}
                                </small>
                              </div>
                            ))}
                          </div>
                        ) : "Aucun produit"}
                      </td>
                      <td>
                        <strong>€{calculateOrderTotal(item).toFixed(2)}</strong>
                      </td>
                      <td>
                        <span className={`badge ${
                          item.orderStatus === "validated" ? "bg-success" :
                          item.orderStatus === "pending" ? "bg-warning text-dark" :
                          item.orderStatus === "failed" ? "bg-danger" :
                          item.orderStatus === "pending" ? "bg-info" :
                          "bg-secondary"
                        }`}>
                          {item.orderStatus === "delivered" ? "Livrée" :
                           item.orderStatus === "validated" ? "Validée" :
                           item.orderStatus === "failed" ? "Annulée" :
                           item.orderStatus === "pending" ? "En attente" :
                           item.orderStatus || "Non défini"}
                        </span>
                      </td>
                    </>
                  )}
                  <td>
                    <FaEdit className="text-warning me-3 cursor-pointer" onClick={() => handleEdit(item)} />
                    <FaTrash className="text-danger cursor-pointer" onClick={() => handleDelete(item.id || item._id)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </>
    );
  };

  return (
    <div className="admin-wrapper">
      <aside className="admin-sidebar">
        <h3 className="sidebar-title">Paye Ton Kawa</h3>
        <ul>
          <li onClick={() => setSection("dashboard")}>🏠 Tableau de bord</li>
          <li onClick={() => setSection("users")}><FaUser /> Utilisateurs</li>
          <li onClick={() => setSection("products")}><FaBoxOpen /> Produits</li>
          <li onClick={() => setSection("orders")}><FaReceipt /> Commandes</li>
        </ul>
        <div className="logout-button mt-4 px-3">
          <button className="btn btn-danger w-100" onClick={logout}><FaSignOutAlt /> Déconnexion</button>
        </div>
      </aside>

      <main className="admin-content">
        {section === "dashboard" ? (
          <div className="admin-overview">
            <h2>Tableau de bord</h2>
            <div className="admin-stats">
              <div className="stat-card">👤 {users.length} utilisateurs</div>
              <div className="stat-card">📦 {products.length} produits</div>
              <div className="stat-card">🧾 {orders.length} commandes</div>
            </div>
            <div className="row mt-4">
              <div className="col-md-6">
                <h5>Statuts des commandes</h5>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={orderChartData} dataKey="value" nameKey="name" outerRadius={80} label>
                      {orderChartData.map((_, i) => (
                        <Cell key={i} fill={["#82ca9d", "#8884d8", "#ffc658"][i % 3]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="col-md-6">
                <h5>Activité globale</h5>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={[
                    { name: "Utilisateurs", value: users.length },
                    { name: "Produits", value: products.length },
                    { name: "Commandes", value: orders.length }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#6d4c41" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        ) : (
          <div className="admin-table-section">
            {renderTable()}
          </div>
        )}
      </main>

      {renderModal()}
    </div>
  );
};

export default Admin;