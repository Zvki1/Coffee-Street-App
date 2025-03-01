import About from "../../Components/About/About";
import Banner from "../../Components/Banner/Banner";
import Delivery from "../../Components/Devlivery/Delivery";
import Popular from "../../Components/Popular/Popular";
import Review from "../../Components/Review/Review";
import Special from "../../Components/Special/Special";
import Subscribe from './../../Components/Subscribe/Subscribe';

const Home = () => {
    return (
        <div>



            {/* banner component  */}
            <Banner></Banner>


            {/* popular component  */}
            <Popular></Popular>



            {/* delivery component  */}
            <Delivery></Delivery>


            {/* about us component  */}
            <About></About>



            {/* special component  */}
            <Special></Special>


            {/* review component  */}
            <Review></Review>


            {/* subscribe component  */}
            <Subscribe />

        </div>
    );
};

export default Home;