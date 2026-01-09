import { useState, forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, ArrowRight, Sparkles, Heart, Zap } from "lucide-react";

interface QuizFormProps {
  onComplete: (data: { name: string; whatsapp: string; answers: string[] }) => void;
}

const questions = [
  {
    id: 1,
    question: "Qual dessas opções mais combina com você?",
    options: [
      { value: "inovador", label: "Gosto de inovar", icon: Sparkles },
      { value: "pratico", label: "Prefiro praticidade", icon: Zap },
      { value: "cuidadoso", label: "Valorizo qualidade", icon: Heart },
    ],
  },
  {
    id: 2,
    question: "Com que frequência você experimenta novidades?",
    options: [
      { value: "sempre", label: "Sempre que posso", icon: Sparkles },
      { value: "as-vezes", label: "De vez em quando", icon: Zap },
      { value: "raramente", label: "Apenas o essencial", icon: Heart },
    ],
  },
  {
    id: 3,
    question: "O que você mais valoriza em um lançamento?",
    options: [
      { value: "exclusividade", label: "Exclusividade", icon: Sparkles },
      { value: "custo-beneficio", label: "Custo-benefício", icon: Zap },
      { value: "qualidade", label: "Alta qualidade", icon: Heart },
    ],
  },
];

const QuizForm = forwardRef<HTMLDivElement, QuizFormProps>(({ onComplete }, ref) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  const isQuizStep = currentStep < questions.length;
  const isContactStep = currentStep === questions.length;

  const handleOptionSelect = (value: string) => {
    const newAnswers = [...answers];
    newAnswers[currentStep] = value;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (isQuizStep && answers[currentStep]) {
      setCurrentStep(currentStep + 1);
    }
  };

  const formatWhatsapp = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 11) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const handleWhatsappChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWhatsapp(formatWhatsapp(e.target.value));
  };

  const handleSubmit = () => {
    if (name.trim() && whatsapp.replace(/\D/g, "").length >= 10) {
      onComplete({ name, whatsapp, answers });
    }
  };

  const progress = ((currentStep + 1) / (questions.length + 1)) * 100;

  return (
    <section ref={ref} id="questionario" className="py-12 px-4 bg-secondary/30">
      <div className="max-w-md mx-auto">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Etapa {currentStep + 1} de {questions.length + 1}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-border rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-[hsl(25_90%_52%)] transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="card-elevated p-6 animate-fade-up">
          {isQuizStep && (
            <div key={currentStep} className="space-y-6 animate-fade-in">
              <h2 className="section-title text-center">
                {questions[currentStep].question}
              </h2>
              
              <div className="space-y-3">
                {questions[currentStep].options.map((option) => {
                  const Icon = option.icon;
                  const isSelected = answers[currentStep] === option.value;
                  
                  return (
                    <button
                      key={option.value}
                      onClick={() => handleOptionSelect(option.value)}
                      className={cn(
                        "option-card w-full flex items-center gap-3 text-left",
                        isSelected && "option-card-selected"
                      )}
                    >
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                        isSelected ? "bg-primary text-white" : "bg-secondary text-muted-foreground"
                      )}>
                        {isSelected ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                      </div>
                      <span className={cn(
                        "font-medium transition-colors",
                        isSelected ? "text-primary" : "text-foreground"
                      )}>
                        {option.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              <Button
                variant="hero"
                size="lg"
                className="w-full"
                onClick={handleNext}
                disabled={!answers[currentStep]}
              >
                Continuar
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}

          {isContactStep && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-6 h-6 text-primary" />
                </div>
                <h2 className="section-title">Quase lá!</h2>
                <p className="text-muted-foreground text-sm mt-2">
                  Preencha seus dados para participar
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1.5">
                    Seu nome
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Digite seu nome completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field"
                  />
                </div>

                <div>
                  <label htmlFor="whatsapp" className="block text-sm font-medium text-foreground mb-1.5">
                    WhatsApp
                  </label>
                  <input
                    id="whatsapp"
                    type="tel"
                    placeholder="(00) 00000-0000"
                    value={whatsapp}
                    onChange={handleWhatsappChange}
                    className="input-field"
                    maxLength={15}
                  />
                </div>
              </div>

              <Button
                variant="hero"
                size="lg"
                className="w-full"
                onClick={handleSubmit}
                disabled={!name.trim() || whatsapp.replace(/\D/g, "").length < 10}
              >
                Continuar
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
});

QuizForm.displayName = "QuizForm";

export default QuizForm;
