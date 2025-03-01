
const About = () => {
    return (
        <div className="about_component d-flex align-items-center justify-content-center">
            <div className="container">
                <div className="row gx-5 align-items-center">
                    <div className="col-xl-6 col-lg-6 col-md-12 mb-5 mb-lg-0">
                        <div className="about_image">
                            <img src="/src/assets/about/about_hero.png" alt="about us" />
                        </div>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-12">
                        <div className="about_content">
                            <div className="section_header mb-4">
                                <h2>About <span>us</span></h2>
                            </div>
                            <h3>we provide quality coffee, and ready to delivery</h3>
                            <p>we are a company that makes and distributes delicious drinks. our main product is mode with a secret recipe and available in sores worldwide</p>
                            <button className="common_btn">get your coffee</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;