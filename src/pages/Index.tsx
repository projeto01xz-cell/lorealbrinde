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
      
      {/* Footer */}
      <footer className="py-4 px-4 border-t border-border/50 bg-secondary/20">
        <div className="max-w-sm mx-auto text-center">
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            © 2025 L'Oréal Paris. Todos os direitos reservados.
            <br />
            Campanha promocional com vagas limitadas.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
