import { Link } from "react-router";
import Desktop from "./Desktop/Desktop";
import Mobile from "./Mobile/Mobile";
import { useState } from "react";
import "./Navbar.css";


const Navbar = () => {

    const [openMenu, setMenu] = useState(false);

    return (
        <header className="header_component d-flex align-items-center justify-content-between">
            <div className="container">
                <div className="header_container d-flex align-items-center justify-content-between">


                    {/* logo wrapper  */}
                    <div className="logo_wrapper">
                        <Link to='/'><img src="/src/assets/logo/logo_coffee.png" alt="logo" /></Link>
                    </div>

                    {/* navbar wrapper  */}
                    <div className="header_right">
                        {/* desktop navigation  */}
                        <Desktop openMenu={openMenu} setMenu={setMenu} />

                        {/* mobile navigation  */}
                        <Mobile openMenu={openMenu} setMenu={setMenu}></Mobile>
                    </div>


                </div>
            </div>
        </header>
    );
};

export default Navbar;