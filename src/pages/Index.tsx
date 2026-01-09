import Header from "@/components/Header";
import Hero from "@/components/Hero";
import { useNavigate } from "react-router-dom";
import heroBg from "@/assets/hero-bg.png";

const Index = () => {
  const navigate = useNavigate();

  const handleStartQuiz = () => {
    navigate("/questionario");
  };

  return (
    <div 
      className="min-h-[100svh] overflow-x-hidden"
      style={{
        backgroundImage: `url(${heroBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top'
      }}
    >
      <Header />
      <Hero onStartQuiz={handleStartQuiz} />
    </div>
  );
};

export default Index;
