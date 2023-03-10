import React from 'react';
import HeroSlider from '../components/sliders/HeroSlider';
import FeaturedSlider from '../components/sliders/FeaturedSlider';
import SectionsHead from '../components/common/SectionsHead';
import TopProducts from '../components/product/TopProducts';
import Services from '../components/common/Services';
import ComboSlider from '../components/sliders/ComboSlider';


const Home = () => {

    return (
        <main>
            <section id="hero">
                <HeroSlider />
            </section>

            <section id="featured" className="section">
                <div className="container">
                    <SectionsHead heading="Featured Books" />
                    <FeaturedSlider />
                </div>
            </section>

            <section id="products" className="section">
                <div className="container">
                    <SectionsHead heading="Top Books" />
                    <TopProducts />
                </div>
            </section>

            <section id="combo" className="section">
                <div className="container">
                    <SectionsHead heading="Combo Books" />
                    <ComboSlider />
                </div>
            </section>

            <Services />
        </main>
    );
};

export default Home;;