import { useState, useRef } from "react";
import Header from "@/components/Header";
import QuizForm from "@/components/QuizForm";
import CpfVerification from "@/components/CpfVerification";
import ProductPage from "@/components/ProductPage";
import CheckoutPage from "@/components/CheckoutPage";
import PixPaymentPage from "@/components/PixPaymentPage";

type Step = "quiz" | "cpf" | "product" | "checkout" | "pix";

interface PixData {
  payload: string;
  expiresAt?: string;
}

const Questionario = () => {
  const [currentStep, setCurrentStep] = useState<Step>("quiz");
  const [userData, setUserData] = useState<{
    name: string;
    whatsapp: string;
    answers: string[];
    cpf?: string;
  } | null>(null);
  const [pixData, setPixData] = useState<PixData | null>(null);
  const [pixTotal, setPixTotal] = useState(0);
  
  const quizRef = useRef<HTMLDivElement>(null);

  const handleQuizComplete = (data: { name: string; whatsapp: string; answers: string[] }) => {
    setUserData(data);
    setCurrentStep("cpf");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCpfVerified = (cpf: string) => {
    setUserData(prev => prev ? { ...prev, cpf } : null);
    setCurrentStep("product");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleGoToCheckout = () => {
    setCurrentStep("checkout");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleGoToPix = (pix: PixData, total: number) => {
    setPixData(pix);
    setPixTotal(total);
    setCurrentStep("pix");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-[100svh] bg-background overflow-x-hidden flex flex-col">
      {(currentStep === "quiz" || currentStep === "cpf") && <Header />}
      
      <main className="flex-1">
        {currentStep === "quiz" && (
          <QuizForm ref={quizRef} onComplete={handleQuizComplete} />
        )}

        {currentStep === "cpf" && userData && (
          <CpfVerification userData={userData} onVerified={handleCpfVerified} />
        )}
        
        {currentStep === "product" && userData && (
          <ProductPage userData={userData} onCheckout={handleGoToCheckout} />
        )}

        {currentStep === "checkout" && userData && (
          <CheckoutPage userData={userData} onPixGenerated={handleGoToPix} />
        )}

        {currentStep === "pix" && userData && pixData && (
          <PixPaymentPage
            pixData={pixData}
            total={pixTotal}
            customerName={userData.name}
          />
        )}
      </main>
      
      {(currentStep === "quiz" || currentStep === "cpf") && (
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
