import { Lock, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-4">
      {/* Selos de Confiança */}
      <div className="bg-card px-4 py-6">
        {/* Primeira linha - Google Safe Browsing e Loja Confiável */}
        <div className="flex justify-center gap-4 mb-4">
          {/* Google Safe Browsing */}
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground">Safe Browsing</p>
              <p className="text-sm font-medium">
                <span className="text-blue-500">G</span>
                <span className="text-red-500">o</span>
                <span className="text-yellow-500">o</span>
                <span className="text-blue-500">g</span>
                <span className="text-green-500">l</span>
                <span className="text-red-500">e</span>
              </p>
            </div>
          </div>

          {/* Loja Confiável */}
          <div className="bg-gradient-to-b from-blue-100 to-blue-200 px-3 py-2 rounded-lg text-center">
            <p className="text-[10px] text-blue-800 font-medium">LOJA CONFIÁVEL</p>
            <div className="flex justify-center text-yellow-500 text-xs">★★★★★</div>
            <p className="text-lg font-bold text-blue-900">4,1<span className="text-sm">/5</span></p>
            <p className="text-[8px] text-blue-700">07/02/2026</p>
          </div>
        </div>

        {/* Segunda linha - NIQ Ebit e Loja Protegida */}
        <div className="flex justify-center gap-4 mb-4">
          {/* NIQ Ebit */}
          <div className="bg-white border border-border px-3 py-2 rounded-lg text-center">
            <div className="bg-yellow-500 text-white text-[8px] font-bold px-2 py-0.5 rounded mb-1">Ouro</div>
            <div className="w-10 h-10 bg-blue-900 rounded mx-auto flex items-center justify-center mb-1">
              <span className="text-yellow-500 text-lg">★</span>
            </div>
            <p className="text-[8px] text-muted-foreground">FEVEREIRO 2026</p>
            <p className="text-xs font-bold">NIQ <span className="text-blue-600">Ebit</span></p>
            <p className="text-[8px] text-blue-600">Clique e verifique</p>
          </div>

          {/* Loja Protegida */}
          <div className="bg-white border border-border px-4 py-3 rounded-lg flex items-center gap-2">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">LOJA PROTEGIDA</p>
              <p className="text-[10px] text-muted-foreground">SAIBA O POR QUÊ</p>
            </div>
          </div>
        </div>

        {/* Terceira linha - Reclame Aqui */}
        <div className="flex justify-center">
          <div className="bg-white border border-border px-4 py-2 rounded-lg flex items-center gap-2">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-lg">✓</span>
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">RA 1000</p>
              <p className="text-xs">
                <span className="text-foreground">Reclame</span>
                <span className="text-green-500 font-bold">AQUI</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Confira Onde Estamos */}
      <div className="bg-secondary/50 px-4 py-6">
        <h3 className="text-center text-lg font-bold mb-4">
          <span className="text-foreground italic">CONFIRA ONDE </span>
          <span className="text-primary italic">ESTAMOS</span>
        </h3>

        {/* Logos dos Marketplaces */}
        <div className="grid grid-cols-3 gap-3 items-center justify-items-center">
          {/* Mercado Livre */}
          <div className="text-center">
            <p className="text-sm font-medium text-yellow-600">mercado<span className="font-bold">livre</span></p>
          </div>

          {/* Netshoes */}
          <div className="text-center">
            <p className="text-sm font-bold tracking-wide">NETSHOES</p>
          </div>

          {/* Americanas */}
          <div className="text-center">
            <p className="text-sm font-bold text-red-600 underline">americanas</p>
          </div>

          {/* Centauro */}
          <div className="text-center">
            <p className="text-sm font-bold text-orange-500">CENTAURO</p>
          </div>

          {/* Shopee */}
          <div className="text-center">
            <p className="text-sm font-bold text-orange-600">Shopee</p>
          </div>

          {/* Shoptime */}
          <div className="text-center">
            <p className="text-sm font-bold text-blue-600">shoptime</p>
          </div>

          {/* Submarino */}
          <div className="text-center">
            <p className="text-sm font-bold text-yellow-600">Submarino</p>
          </div>

          {/* Extra */}
          <div className="text-center">
            <p className="text-sm font-bold text-red-600">extra</p>
          </div>

          {/* Magalu */}
          <div className="text-center">
            <p className="text-sm font-bold text-blue-600">Magalu</p>
          </div>
        </div>
      </div>

      {/* Texto Legal */}
      <div className="bg-card px-4 py-4">
        <p className="text-xs text-muted-foreground text-center leading-relaxed">
          Todos os direitos reservados. Proibida reprodução total ou parcial. Preços e estoque sujeito a alterações sem aviso prévio. CNPJ: 18.180.777/0001-40 GTSM1 - Rodovia Waldomiro Corrêa de Camargo KM 57,3 , Pirapitingui CEP - 13308-200 Itu / SP - Horário de Funcionamento: De segunda a sexta das 8h às 17h
        </p>
      </div>

      {/* Copyright Bar */}
      <div className="bg-foreground px-4 py-3 flex items-center justify-center gap-2">
        <Lock className="h-3 w-3 text-background" />
        <p className="text-xs text-background">
          lojagtsm1.com.br
        </p>
      </div>
    </footer>
  );
}
