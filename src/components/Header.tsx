import { Gift } from "lucide-react";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-sm border-b border-border/50">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-[hsl(25_90%_52%)] flex items-center justify-center">
            <Gift className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-foreground">NovoProduto</span>
        </div>
        
        <nav className="flex items-center gap-4 text-sm text-muted-foreground">
          <a 
            href="#como-funciona" 
            className="hover:text-foreground transition-colors"
          >
            Como funciona
          </a>
          <a 
            href="#duvidas" 
            className="hover:text-foreground transition-colors"
          >
            Dúvidas
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
