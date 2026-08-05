import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Services from '../components/Services';
import FeaturedVendors from '../components/FeaturedVendors';
import HowItWorks from '../components/HowItWorks';
import Stats from '../components/Stats';
import Testimonials from '../components/Testimonials';
import AppCTA from '../components/AppCTA';
import Footer from '../components/Footer';
import BudgetPlannerCTA from '../components/BudgetPlannerCTA';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <Services />
      <FeaturedVendors />
      <Stats />
      <BudgetPlannerCTA />
      <HowItWorks />
      <Testimonials />
      <AppCTA />
      <Footer />
    </>
  );
}
