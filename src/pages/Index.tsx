import Navbar from "@/components/store/Navbar";
import HeroBanner from "@/components/store/HeroBanner";
import FeaturedProducts from "@/components/store/FeaturedProducts";
import Footer from "@/components/store/Footer";
import promoBanner from "@/assets/promo-banner.png";

export default function Index() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroBanner />
        
        {/* Promo Banner - GTSM1 Desde 1994 */}
        <div className="bg-card py-4">
          <img 
            src={promoBanner} 
            alt="GTSM1 - Desde 1994" 
            className="w-full h-auto max-h-20 object-contain"
          />
        </div>
        
        <FeaturedProducts />
      </main>
      <Footer />
    </div>
  );
}