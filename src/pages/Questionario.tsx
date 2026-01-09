import { useState, useRef } from "react";
import Header from "@/components/Header";
import QuizForm from "@/components/QuizForm";
import CpfVerification from "@/components/CpfVerification";

type Step = "quiz" | "cpf";

const Questionario = () => {
  const [currentStep, setCurrentStep] = useState<Step>("quiz");
  const [userData, setUserData] = useState<{
    name: string;
    whatsapp: string;
    answers: string[];
  } | null>(null);
  
  const quizRef = useRef<HTMLDivElement>(null);

  const handleQuizComplete = (data: { name: string; whatsapp: string; answers: string[] }) => {
    setUserData(data);
    setCurrentStep("cpf");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {currentStep === "quiz" && (
        <QuizForm ref={quizRef} onComplete={handleQuizComplete} />
      )}
      
      {currentStep === "cpf" && userData && (
        <CpfVerification userData={userData} />
      )}
      
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

export default Questionario;
