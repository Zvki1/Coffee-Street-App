import { Link } from "react-router";
import { CiShoppingCart } from "react-icons/ci";
import './Banner.css';
const Banner = () => {
    return (
        <div className="banner_component d-flex align-items-center justify-content-center">
            <div className="container">
                <div className="row">
                    <div className="col-xl-6 col-lg-6 col-md-12 mb-5 mb-lg-0">
                        <div className="banner_content">
                            <h2>enjoy your <span>coffee</span> before your activity</h2>
                            <p>Boost your productivity and build your mood with a glass of coffee in the morning</p>

                            <div className="btn_box">
                                <button id="order_btn"><Link className="common_btn">order now <CiShoppingCart fontSize='1.5rem' /> </Link></button>
                                
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-12">
                        <div className="banner_img">
                           {/* <img src="/src/assets/banner/img-hero.png" alt="hero image" />  */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Banner;