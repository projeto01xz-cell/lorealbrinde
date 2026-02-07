import { Link } from "react-router-dom";
import heroBanner from "@/assets/hero-banner.png";

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden">
      {/* Hero Image */}
      <Link to="/produtos" className="block">
        <img
          src={heroBanner}
          alt="E-Bike Thunder 1000W - Não precisa de CNH"
          className="w-full h-auto object-cover"
        />
      </Link>
    </section>
  );
}