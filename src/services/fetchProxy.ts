export const proxiedFetch = async (url: string, options?: RequestInit) => {
  // Se estivermos rodando localmente (localhost), a própria API geralmente não bloqueia CORS
  // pois estamos em desenvolvimento. No GitHub Pages, precisamos do proxy.
  const isLocal = typeof window !== 'undefined' && window.location.hostname === 'localhost';
  
  // Usamos allorigins.win para intermediar o pedido quando estivermos no GitHub Pages (pois corsproxy.io bloqueia o mangadex em nuvem)
  const finalUrl = isLocal ? url : `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
  
  return options ? fetch(finalUrl, options) : fetch(finalUrl);
};
