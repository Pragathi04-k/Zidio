import React from "react";
import { HeroGeometric } from "../ui-components/ShapeLandingHero";
import GetStarted from "../Components/GetStarted";
import Feature from "../Components/Feature";

const Home = () => {
    return (
        <div className="text-white w-full overflow-x-hidden mt-10">
            <HeroGeometric badge="Zidio Development" title1="Blog App" title2="Share your thoughts with the world" description="A clean, responsive blogging app to write, share, explore, and engage with content effortlessly anywhere." />
            <Feature />
            <GetStarted />
        </div>
    );
};

export default Home;
