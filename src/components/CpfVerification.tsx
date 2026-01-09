import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Shield, CheckCircle2, AlertCircle, Loader2, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface CpfVerificationProps {
  userData: { name: string; whatsapp: string; answers: string[] };
}

type VerificationStatus = "idle" | "loading" | "success" | "error";

const loadingMessages = [
  "Analisando dados...",
  "Verificando elegibilidade...",
  "Consultando disponibilidade...",
  "Finalizando verificação...",
];

// Função para validar CPF com dígitos verificadores
const validateCPF = (cpf: string): boolean => {
  const numbers = cpf.replace(/\D/g, "");
  
  if (numbers.length !== 11) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(numbers)) return false;
  
  // Validação do primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(numbers[i]) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(numbers[9])) return false;
  
  // Validação do segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(numbers[i]) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(numbers[10])) return false;
  
  return true;
};

const CpfVerification = ({ userData }: CpfVerificationProps) => {
  const [cpf, setCpf] = useState("");
  const [status, setStatus] = useState<VerificationStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
    if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCpf(formatCPF(e.target.value));
  };

  useEffect(() => {
    if (status === "loading") {
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 2;
        });
      }, 100);

      const messageInterval = setInterval(() => {
        setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 1500);

      const timeout = setTimeout(() => {
        const isValid = validateCPF(cpf);
        setStatus(isValid ? "success" : "error");
      }, 5500);

      return () => {
        clearInterval(progressInterval);
        clearInterval(messageInterval);
        clearTimeout(timeout);
      };
    }
  }, [status, cpf]);

  const handleVerify = () => {
    if (cpf.replace(/\D/g, "").length === 11) {
      setStatus("loading");
      setProgress(0);
      setMessageIndex(0);
    }
  };

  const handleRetry = () => {
    setCpf("");
    setStatus("idle");
    setProgress(0);
  };

  return (
    <section className="py-12 px-4 bg-background">
      <div className="max-w-md mx-auto">
        <div className="card-elevated p-6 animate-scale-in">
          {status === "idle" && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-7 h-7 text-primary" />
                </div>
                <h2 className="section-title">Verificação de Elegibilidade</h2>
                <p className="text-muted-foreground text-sm mt-2">
                  Informe seu CPF para verificar sua participação
                </p>
              </div>

              <div>
                <label htmlFor="cpf" className="block text-sm font-medium text-foreground mb-1.5">
                  CPF
                </label>
                <input
                  id="cpf"
                  type="text"
                  placeholder="000.000.000-00"
                  value={cpf}
                  onChange={handleCpfChange}
                  className="input-field text-center text-lg tracking-wider"
                  maxLength={14}
                />
              </div>

              <Button
                variant="hero"
                size="lg"
                className="w-full"
                onClick={handleVerify}
                disabled={cpf.replace(/\D/g, "").length !== 11}
              >
                <Shield className="w-4 h-4" />
                Verificar CPF
              </Button>
            </div>
          )}

          {status === "loading" && (
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  {loadingMessages[messageIndex]}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Aguarde um momento...
                </p>
              </div>

              <div className="space-y-2">
                <div className="h-3 bg-border rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-100"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">{progress}%</span>
              </div>
            </div>
          )}

          {status === "success" && (
            <div className="space-y-6 text-center py-4 animate-scale-in">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[hsl(152_69%_41%)] to-[hsl(162_63%_45%)] flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Elegível ✅
                </h3>
                <p className="text-base text-foreground font-medium">
                  Parabéns, {userData.name.split(" ")[0]}!
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Sua inscrição foi confirmada na seleção.
                </p>
              </div>

              <div className="bg-secondary/50 rounded-xl p-4 text-left">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Próximos passos:</strong><br />
                  Entraremos em contato pelo WhatsApp{" "}
                  <span className="font-medium text-foreground">{userData.whatsapp}</span>{" "}
                  caso você seja selecionado.
                </p>
              </div>

              <p className="text-xs text-muted-foreground">
                A seleção depende de disponibilidade e critérios da campanha.
              </p>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-6 text-center py-4 animate-scale-in">
              <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
                <AlertCircle className="w-10 h-10 text-destructive" />
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  CPF Inválido
                </h3>
                <p className="text-sm text-muted-foreground">
                  Verifique o número digitado e tente novamente.
                </p>
              </div>

              <Button
                variant="secondary"
                size="lg"
                className="w-full"
                onClick={handleRetry}
              >
                Tentar Novamente
              </Button>
            </div>
          )}
        </div>

        {/* LGPD Section */}
        <div id="duvidas" className="mt-8 p-4 rounded-xl bg-secondary/30 border border-border/50">
          <div className="flex items-start gap-3">
            <Lock className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-1">Seus dados estão seguros</p>
              <p className="leading-relaxed">
                Não compartilhamos suas informações com terceiros. 
                Usaremos apenas para contato sobre esta campanha.
              </p>
              <button className="text-primary hover:underline mt-2 font-medium">
                Ver política de privacidade
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CpfVerification;
