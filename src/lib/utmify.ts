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
