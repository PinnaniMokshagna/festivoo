import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Services from '../components/Services';
import FeaturedVendors from '../components/FeaturedVendors';
import HowItWorks from '../components/HowItWorks';
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
      <BudgetPlannerCTA />
      <HowItWorks />
      <AppCTA />
      <Footer />
    </>
  );
}
