import ReviewSlider from "../ReviewSlider/ReviewSlider";
import "./Review.css"
const Review = () => {
    return (
        <div className="review_component d-flex align-items-center justify-content-center">

            <div className="review_container d-flex flex-column row-gap-5 flex-lg-row align-items-center">

                <div className="about_content review_content">
                    <div className="section_header mb-4">
                        <h2>About <span>us</span></h2>
                    </div>
                    <h3>we provide quality coffee, and ready to delivery</h3>
                    <p>we are a company that makes and distributes delicious drinks. our main product is mode with a secret recipe and available in sores worldwide</p>
                    <button className="order_btn">get your coffee</button>

                </div>

                <div className="slider_wrapper">
                    <ReviewSlider></ReviewSlider>
                </div>
            </div>

        </div>
    );
};

export default Review;