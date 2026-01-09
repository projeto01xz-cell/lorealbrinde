import Header from "@/components/Header";
import Hero from "@/components/Hero";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const handleStartQuiz = () => {
    navigate("/questionario");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero onStartQuiz={handleStartQuiz} />
      
      {/* Footer */}
      <footer className="py-6 px-4 border-t border-border/50 bg-secondary/20">
        <div className="max-w-md mx-auto text-center">
          <p className="text-xs text-muted-foreground">
            © 2025 L'Oréal Paris. Todos os direitos reservados.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Esta é uma campanha promocional com vagas limitadas.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
