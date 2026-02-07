import { Home, ArrowLeft } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

export default function NotFound() {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-8xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-foreground mb-4">
          Página não encontrada
        </h2>
        <p className="text-muted-foreground mb-8 max-w-md">
          A página que você está procurando não existe ou foi movida.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="btn-primary px-6 py-3 inline-flex items-center justify-center gap-2"
          >
            <Home className="h-4 w-4" />
            Ir para Início
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn-secondary px-6 py-3 inline-flex items-center justify-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
}
