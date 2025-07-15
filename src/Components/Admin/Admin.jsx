
import React, { useState } from "react";
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

  const logout = () => {
    if (window.confirm("Voulez-vous vous déconnecter ?")) navigate("/");
  };

  const handleEdit = (item) => {
    setForm(item);
    setEditId(item.id);
    setEditMode(true);
    setModalVisible(true);
  };

  const handleDelete = (id) => {
    const update = (arr) => arr.filter(i => i.id !== id);
    if (section === "users") setUsers(update(users));
    if (section === "products") setProducts(update(products));
    if (section === "orders") setOrders(update(orders));
    setForm({});
    setEditId(null);
    setEditMode(false);
  };

  const handleSave = () => {
    const updateList = (list, setList) => {
      if (editMode) {
        setList(list.map(i => (i.id === editId ? { ...i, ...form } : i)));
      } else {
        setList([...list, { id: list.length + 1, ...form }]);
      }
      setForm({});
      setEditId(null);
      setEditMode(false);
      setModalVisible(false);
    };

    if (section === "users") updateList(users, setUsers);
    if (section === "products") updateList(products, setProducts);
    if (section === "orders") updateList(orders, setOrders);
  };

  const renderModal = () => {
    if (!modalVisible) return null;
    const inputs = {
      users: (
        <>
          <input placeholder="Nom" className="form-control mb-2" value={form.name || ""} onChange={e => setForm({ ...form, name: e.target.value })} />
          <input placeholder="Prénom" className="form-control mb-2" value={form.lastname || ""} onChange={e => setForm({ ...form, lastname: e.target.value })} />
          <input placeholder="Email" className="form-control mb-2" value={form.email || ""} onChange={e => setForm({ ...form, email: e.target.value })} />
          <input placeholder="Mot de passe" className="form-control mb-2" value={form.password || ""} onChange={e => setForm({ ...form, password: e.target.value })} />
        </>
      ),
      products: (
        <>
          <input placeholder="Nom produit" className="form-control mb-2" value={form.name || ""} onChange={e => setForm({ ...form, name: e.target.value })} />
          <input placeholder="Prix (€)" className="form-control mb-2" value={form.price || ""} onChange={e => setForm({ ...form, price: e.target.value })} />
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
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {})
  ).map(([status, value]) => ({ name: status, value }));
  const renderTable = () => {
  const headers = {
    users: ["Nom", "Prénom", "Email"],
    products: ["Nom", "Prix"],
    orders: ["Numéro", "Statut"]
  }[section];

  const data = {
    users,
    products,
    orders
  }[section];

  const fields = Object.keys(data[0] || {}).filter(k => k !== "id" && k !== "password");

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>{section === "users" ? "Utilisateurs" : section === "products" ? "Produits" : "Commandes"}</h2>
        <button className="btn btn-success" onClick={() => {
          setEditMode(false);
          setForm({});
          setModalVisible(true);
        }}>
          <FaPlus /> Ajouter
        </button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            {headers.map((h) => <th key={h}>{h}</th>)}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              {fields.map((f) => <td key={f}>{item[f]}</td>)}
              <td>
                <FaEdit className="text-warning me-3 cursor-pointer" onClick={() => handleEdit(item)} />
                <FaTrash className="text-danger cursor-pointer" onClick={() => handleDelete(item.id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
