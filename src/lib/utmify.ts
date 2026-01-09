// Helper para capturar parâmetros UTM do Utmify
export const getUtmifyParams = (): Record<string, string> => {
  const params: Record<string, string> = {};
  
  // Parâmetros padrão UTM
  const utmKeys = [
    "utm_source",
    "utm_medium", 
    "utm_campaign",
    "utm_content",
    "utm_term",
    "src",
    "sck",
  ];

  // Tentar pegar da URL atual
  const urlParams = new URLSearchParams(window.location.search);
  utmKeys.forEach((key) => {
    const value = urlParams.get(key);
    if (value) {
      params[key] = value;
    }
  });

  // Tentar pegar dos cookies (Utmify salva lá)
  const cookies = document.cookie.split(";");
  cookies.forEach((cookie) => {
    const [name, value] = cookie.trim().split("=");
    if (utmKeys.includes(name) && value && !params[name]) {
      params[name] = decodeURIComponent(value);
    }
  });

  // Tentar pegar do localStorage (backup)
  utmKeys.forEach((key) => {
    if (!params[key]) {
      const stored = localStorage.getItem(key);
      if (stored) {
        params[key] = stored;
      }
    }
  });

  return params;
};

// Salvar parâmetros UTM quando a página carrega
export const saveUtmParams = (): void => {
  const urlParams = new URLSearchParams(window.location.search);
  const utmKeys = [
    "utm_source",
    "utm_medium",
    "utm_campaign", 
    "utm_content",
    "utm_term",
    "src",
    "sck",
  ];

  utmKeys.forEach((key) => {
    const value = urlParams.get(key);
    if (value) {
      localStorage.setItem(key, value);
    }
  });
};

// Capturar o leadId da Utmify (salvo pelo pixel script)
export const getUtmifyLeadId = (): string | null => {
  // O pixel da Utmify salva o leadId no localStorage
  try {
    // Tentar pegar do localStorage (formato mais comum)
    const utmifyData = localStorage.getItem("utmify_lead");
    if (utmifyData) {
      const parsed = JSON.parse(utmifyData);
      if (parsed._id) return parsed._id;
      if (parsed.id) return parsed.id;
    }
    
    // Tentar formato alternativo
    const leadId = localStorage.getItem("utmify_lead_id");
    if (leadId) return leadId;
    
    // Tentar pegar do cookie _utmify
    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split("=");
      if (name === "_utmify" || name === "utmify_lead") {
        try {
          const decoded = decodeURIComponent(value);
          const parsed = JSON.parse(decoded);
          if (parsed._id) return parsed._id;
          if (parsed.id) return parsed.id;
        } catch {
          // Se não for JSON, pode ser o ID direto
          return value;
        }
      }
    }
    
    // Tentar pegar do window (o pixel pode expor lá)
    const windowUtmify = (window as any).utmify;
    if (windowUtmify?.lead?._id) return windowUtmify.lead._id;
    if (windowUtmify?.leadId) return windowUtmify.leadId;
    
    return null;
  } catch (err) {
    console.error("Error getting Utmify leadId:", err);
    return null;
  }
};

// Capturar IP do cliente (para tracking server-side)
export const getClientIP = async (): Promise<string> => {
  try {
    // Tentar IPv4 primeiro
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    return data.ip || "";
  } catch {
    try {
      // Fallback para IPv6
      const response = await fetch("https://api6.ipify.org?format=json");
      const data = await response.json();
      return data.ip || "";
    } catch {
      return "";
    }
  }
};
