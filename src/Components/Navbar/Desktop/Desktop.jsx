import { Link, NavLink } from "react-router";
import { CiSearch } from "react-icons/ci";
import { CiShoppingCart } from "react-icons/ci";
import { FaBarsStaggered } from "react-icons/fa6";

const Desktop = ({openMenu , setMenu}) => {
    return (
        <div className="d-flex align-items-center gap-5">
            
            <nav className="d-none d-lg-flex align-items-center gap-4 navigationbar">
                <NavLink to='/' className={({isActive}) => {
                    return isActive ? 'active' :''
                }}>about us</NavLink>
                
                <NavLink to='_blank' className={({isActive}) => {
                    return isActive ? 'active' :''
                }}>our product</NavLink>

                <NavLink to='_blank'  className={({isActive}) => {
                   return isActive ? 'active' :''
                }}>delivery</NavLink>
            </nav>

            <div className="desktop_right_wrapper d-flex align-items-center gap-4">
                <form action="#" className="d-none d-lg-block">
                    <input type="text" placeholder="Cappuccino" />
                    <button> <CiSearch fontSize='1.5rem' color="#000000" /> </button>
                </form>

                <button><Link className="cart_icon"><CiShoppingCart fontSize='2rem' color="#000000" /></Link></button>
            </div>
            <button onClick={() => setMenu(!openMenu)}  className="d-block d-lg-none"><FaBarsStaggered fontSize='2rem' color="#000000" /></button>
        </div>
    );
};

export default Desktop;