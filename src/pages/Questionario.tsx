import { useState, useRef } from "react";
import Header from "@/components/Header";
import QuizForm from "@/components/QuizForm";
import ProductPage from "@/components/ProductPage";
import CheckoutPage from "@/components/CheckoutPage";

type Step = "quiz" | "product" | "checkout";

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
    setCurrentStep("product");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleGoToCheckout = () => {
    setCurrentStep("checkout");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-[100svh] bg-background overflow-x-hidden flex flex-col">
      {currentStep === "quiz" && <Header />}
      
      <main className="flex-1">
        {currentStep === "quiz" && (
          <QuizForm ref={quizRef} onComplete={handleQuizComplete} />
        )}
        
        {currentStep === "product" && userData && (
          <ProductPage userData={userData} onCheckout={handleGoToCheckout} />
        )}

        {currentStep === "checkout" && userData && (
          <CheckoutPage userData={userData} />
        )}
      </main>
      
      {currentStep === "quiz" && (
        <footer className="py-4 px-4 border-t border-border/50 bg-secondary/20 mt-auto">
          <div className="max-w-sm mx-auto text-center">
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              © 2025 L'Oréal Paris. Todos os direitos reservados.
              <br />
              Campanha promocional com vagas limitadas.
            </p>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Questionario;
