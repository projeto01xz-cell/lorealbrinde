import Header from "@/components/Header";
import Hero from "@/components/Hero";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const handleStartQuiz = () => {
    navigate("/questionario");
  };

  return (
    <div className="min-h-[100svh] overflow-x-hidden" style={{ background: 'linear-gradient(180deg, #a855f7 0%, #7c3aed 50%, #6d28d9 100%)' }}>
      <Header />
      <Hero onStartQuiz={handleStartQuiz} />
    </div>
  );
};

export default Index;
