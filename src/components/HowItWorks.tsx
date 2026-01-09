import { FileQuestion, UserCheck, Gift } from "lucide-react";

const steps = [
  {
    icon: FileQuestion,
    title: "Responda o quiz",
    description: "3 perguntas rápidas sobre você",
  },
  {
    icon: UserCheck,
    title: "Verifique elegibilidade",
    description: "Confirme seus dados com CPF",
  },
  {
    icon: Gift,
    title: "Aguarde o contato",
    description: "Selecionados recebem o kit",
  },
];

const HowItWorks = () => {
  return (
    <section id="como-funciona" className="py-12 px-4 bg-background">
      <div className="max-w-md mx-auto">
        <h2 className="section-title text-center mb-8">Como Funciona</h2>
        
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30 border border-border/50"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0">
                <step.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-sm">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </div>
              <div className="ml-auto text-2xl font-bold text-primary/20">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
