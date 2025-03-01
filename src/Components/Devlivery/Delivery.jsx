
const Delivery = () => {

    const services = [
        {
            id: 1,
            title: 'choose your coffee',
            description:'there are 20+ coffee for your',
            image: '/src/assets/delivery/delivery_1.png',
        },
        {
            id: 2,
            title: 'we delivery it to you',
            description:'choose delivery service',
            image: '/src/assets/delivery/delivery_2.png',
        },
        {
            id: 3,
            title: 'choose your coffee',
            description:'we delivery it to you',
            image: '/src/assets/delivery/delivery_3.png',
        },
    ]

    return (
        <div className="delivery_component">
            <div className="container">
                <div className="section_header mb-5">
                    <h2>how to use delivery <span>service</span></h2>
                </div>

                <div className="row gy-5">
                    {
                        services?.map(item => (
                            <div key={item?.id} className="col-xl-4 col-lg-4 col-md-12 d-flex align-items-center justify-content-center">
                                <div className="deliver_content text-center d-flex flex-column row-gap-2">
                                    <img src={item?.image} alt={item?.title} />
                                    <h4>{item?.title}</h4>
                                    <p>{item?.description}</p>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    );
};

export default Delivery;