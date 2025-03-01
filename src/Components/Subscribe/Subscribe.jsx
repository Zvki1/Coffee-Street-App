
const Subscribe = () => {



    return (
        <div className="subscribe_component">
            <div className="container">
                <div className="subscribe_container d-flex flex-column align-items-center justify-content-center">
                    {/* section header  */}
                    <div className="section_header subscribe_header mb-5">
                        <h2>Subscribe to get <span>50% discount</span> price</h2>
                    </div>

                    <form action="#"  className="subscribe_form">
                        <input type="email" placeholder="Email address..." />
                        <button className="common_btn">order now</button>
                    </form>
                </div>
            </div>

        </div>
    );
};

export default Subscribe;