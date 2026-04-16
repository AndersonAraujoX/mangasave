export const proxiedFetch = async (url: string, options?: RequestInit) => {
  // Se estivermos rodando localmente (localhost), a própria API geralmente não bloqueia CORS
  // pois estamos em desenvolvimento. No GitHub Pages, precisamos do proxy.
  const isLocal = typeof window !== 'undefined' && window.location.hostname === 'localhost';
  
  // Usamos corsproxy.io para intermediar o pedido quando estivermos no GitHub Pages
  const finalUrl = isLocal ? url : `https://corsproxy.io/?${encodeURIComponent(url)}`;
  
  return options ? fetch(finalUrl, options) : fetch(finalUrl);
};
