import { useState, forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, ArrowRight } from "lucide-react";

interface QuizFormProps {
  onComplete: (data: { name: string; whatsapp: string; answers: string[] }) => void;
}

const questions = [
  {
    id: 1,
    question: "Qual é o seu tipo de cabelo?",
    options: [
      { value: "liso", label: "Liso" },
      { value: "ondulado", label: "Ondulado" },
      { value: "cacheado", label: "Cacheado" },
      { value: "crespo", label: "Crespo" },
    ],
  },
  {
    id: 2,
    question: "Qual a sua maior preocupação com o cabelo?",
    options: [
      { value: "queda", label: "Queda de cabelo" },
      { value: "ressecamento", label: "Ressecamento e frizz" },
      { value: "oleosidade", label: "Oleosidade excessiva" },
      { value: "pontas-duplas", label: "Pontas duplas e quebra" },
    ],
  },
  {
    id: 3,
    question: "Com que frequência você lava o cabelo?",
    options: [
      { value: "diariamente", label: "Todos os dias" },
      { value: "dias-alternados", label: "Dia sim, dia não" },
      { value: "2-3-vezes", label: "2 a 3 vezes por semana" },
      { value: "1-vez", label: "1 vez por semana" },
    ],
  },
  {
    id: 4,
    question: "Você costuma usar ferramentas de calor?",
    options: [
      { value: "sempre", label: "Sim, frequentemente" },
      { value: "as-vezes", label: "Às vezes" },
      { value: "raramente", label: "Raramente" },
      { value: "nunca", label: "Nunca uso" },
    ],
  },
  {
    id: 5,
    question: "O que você mais busca em um produto capilar?",
    options: [
      { value: "hidratacao", label: "Hidratação intensa" },
      { value: "volume", label: "Mais volume" },
      { value: "brilho", label: "Brilho e maciez" },
      { value: "fortalecimento", label: "Fortalecimento" },
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
    <section ref={ref} id="questionario" className="min-h-[100svh] py-6 px-4 bg-secondary/30 flex flex-col">
      <div className="w-full max-w-sm mx-auto flex-1 flex flex-col">
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
            <span>Etapa {currentStep + 1} de {questions.length + 1}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 bg-border rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="card-elevated p-5 animate-fade-up flex-1 flex flex-col justify-center">
          {isQuizStep && (
            <div key={currentStep} className="space-y-5 animate-fade-in">
              <h2 className="text-lg font-semibold text-foreground text-center leading-snug">
                {questions[currentStep].question}
              </h2>
              
              <div className="space-y-2.5">
                {questions[currentStep].options.map((option, index) => {
                  const isSelected = answers[currentStep] === option.value;
                  const letters = ['A', 'B', 'C', 'D'];
                  
                  return (
                    <button
                      key={option.value}
                      onClick={() => handleOptionSelect(option.value)}
                      className={cn(
                        "option-card w-full flex items-center gap-3 text-left py-3.5 px-4",
                        isSelected && "option-card-selected"
                      )}
                    >
                      <div className={cn(
                        "w-9 h-9 rounded-full flex items-center justify-center transition-colors flex-shrink-0 text-sm font-semibold",
                        isSelected ? "bg-primary text-white" : "bg-secondary text-muted-foreground"
                      )}>
                        {isSelected ? <Check className="w-4 h-4" /> : letters[index]}
                      </div>
                      <span className={cn(
                        "text-sm font-medium transition-colors",
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
                className="w-full h-12"
                onClick={handleNext}
                disabled={!answers[currentStep]}
              >
                Continuar
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}

          {isContactStep && (
            <div className="space-y-5 animate-fade-in">
              <div className="text-center">
                <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Check className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">Quase lá!</h2>
                <p className="text-muted-foreground text-sm mt-1">
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
