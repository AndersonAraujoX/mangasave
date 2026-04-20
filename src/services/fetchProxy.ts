export const proxiedFetch = async (url: string, options?: RequestInit) => {
  // Se estivermos rodando localmente (localhost), a própria API geralmente não bloqueia CORS
  // pois estamos em desenvolvimento. No GitHub Pages, precisamos do proxy.
  const isLocal = typeof window !== 'undefined' && window.location.hostname === 'localhost';
  
  // Usamos codetabs.com para intermediar o pedido quando estivermos no GitHub Pages 
  // (pois allorigins.win e corsproxy.io bloqueiam/sofrem CF no mangadex em nuvem)
  const finalUrl = isLocal ? url : `https://api.codetabs.com/v1/proxy/?quest=${encodeURIComponent(url)}`;
  
  return options ? fetch(finalUrl, options) : fetch(finalUrl);
};
