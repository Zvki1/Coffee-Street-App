import { CiSearch } from "react-icons/ci";
import { CiShoppingCart } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import { Link, NavLink } from 'react-router';

const Mobile = ({openMenu, setMenu}) => {
    return (
        <div className={`mobile_navigationbar d-flex flex-column row-gap-5 ${openMenu ? 'show' : ''}`}>


            <button onClick={() => setMenu(!openMenu)} className="d-block d-lg-none"><IoMdClose fontSize='2rem' color="#fff" /></button>

            <nav className="d-flex d-lg-none flex-column align-items-center gap-4 navigationbar">
                <NavLink to='/' className={({ isActive }) => {
                    return isActive ? 'active' : ''
                }}>about us</NavLink>

                <NavLink to='_blank' className={({ isActive }) => {
                    return isActive ? 'active' : ''
                }}>our product</NavLink>

                <NavLink to='_blank' className={({ isActive }) => {
                    return isActive ? 'active' : ''
                }}>delivery</NavLink>
            </nav>

            <div className="desktop_right_wrapper d-flex flex-column align-items-center gap-4">
                <form action="#" className="d-block d-lg-none">
                    <input type="text" placeholder="Cappuccino" />
                    <button> <CiSearch fontSize='1.5rem' color="#000000" /> </button>
                </form>

                <button><Link className="cart_icon"><CiShoppingCart fontSize='2rem' color="#000000" /></Link></button>
            </div>

        </div>
    );
};

export default Mobile;