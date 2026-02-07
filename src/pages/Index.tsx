import Navbar from "@/components/store/Navbar";
import HeroBanner from "@/components/store/HeroBanner";
import FeaturedProducts from "@/components/store/FeaturedProducts";
import Footer from "@/components/store/Footer";

export default function Index() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroBanner />
        <FeaturedProducts />
      </main>
      <Footer />
    </div>
  );
}
