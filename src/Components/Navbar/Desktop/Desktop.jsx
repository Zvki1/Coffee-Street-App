import { useState } from "react";
import { Link, NavLink } from "react-router";
import { CiSearch, CiShoppingCart, CiUser } from "react-icons/ci";
import { FaBarsStaggered } from "react-icons/fa6";

const Desktop = ({ openMenu, setMenu }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="d-flex align-items-center gap-5 position-relative">
      <nav className="d-none d-lg-flex align-items-center gap-4 navigationbar">
          <a href="#product" className="nav-link">
          About Us
        </a>
       
        <a href="#product" className="nav-link">
          our product
        </a>

        <a href="#delivery" className="nav-link">
          delivery
        </a>
      </nav>

      <div className="desktop_right_wrapper d-flex align-items-center gap-4 position-relative">
        <button onClick={() => setShowDropdown(!showDropdown)}>
          <span className="user_icon">
            <CiUser fontSize="2rem" color="#000000" />
          </span>
        </button>

        {showDropdown && (
          <div className="dropdown-menu show p-2 position-absolute top-100 start-0 mt-2 bg-white border rounded">
            <Link to="/login" className="dropdown-item">
              Se connecter
            </Link>
          </div>
        )}

        
      </div>

      <button onClick={() => setMenu(!openMenu)} className="d-block d-lg-none">
        <FaBarsStaggered fontSize="2rem" color="#000000" />
      </button>
    </div>
  );
};

export default Desktop;
