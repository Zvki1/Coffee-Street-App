import Banner from "../../Components/Banner/Banner";
import Delivery from "../../Components/Devlivery/Delivery";
import Popular from "../../Components/Popular/Popular";
import Review from "../../Components/Review/Review";
import Special from "../../Components/Special/Special";

const Home = () => {
    return (
        <div>



            {/* banner component  */}
            <Banner></Banner>


            {/* popular component  */}
            <Popular></Popular>



            {/* delivery component  */}
            <Delivery></Delivery>


            {/* special component  */}
            <Special></Special>


            {/* review component  */}
            <Review></Review>


          
        </div>
    );
};

export default Home;