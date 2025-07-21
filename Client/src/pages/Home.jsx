import React from "react";
import { HeroGeometric } from "../ui-components/ShapeLandingHero";
import GetStarted from "../Components/GetStarted";
import Feature from "../Components/Feature";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const Home = () => {
    return (
        <div className="text-white h-screen w-screen overflow-x-hidden">
            <HeroGeometric badge="Zidio Development" title1="Blog App" title2="Share your thoughts with the world" description="A clean, responsive blogging app to write, share, explore, and engage with content effortlessly anywhere." />
            <Feature />
            <GetStarted />
            <Footer />
        </div>
    );
};

export default Home;
