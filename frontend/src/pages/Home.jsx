import Hero from '../components/Hero';
import Features from '../components/Features';
import BestSellers from '../components/BestSellers';
import NewArrivals from '../components/NewArrivals';
import Books from '../components/Books';
import DiscountBanner from '../components/DiscountBanner';
import BlogSection from '../components/BlogSection';
import Reviews from '../components/Reviews';
import Gallery from '../components/Gallery';

const Home = () => {
  return (
    <>
      <Hero />
      <Features />
      <BestSellers />
      <NewArrivals />
      <Books />
      <DiscountBanner />
      <BlogSection />
      <Reviews />
      <Gallery />
    </>
  );
};

export default Home;
