import Header from "@/components/Header";
import Hero from "@/components/Hero";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const handleStartQuiz = () => {
    navigate("/questionario");
  };

  return (
    <div className="min-h-[100svh] bg-background overflow-x-hidden">
      <Header />
      <Hero onStartQuiz={handleStartQuiz} />
    </div>
  );
};

export default Index;
