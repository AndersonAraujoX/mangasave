# 📚 MangaSave

<div align="center">
  <img src="public/favicon.ico" alt="MangaSave Logo" width="80" height="80" style="margin-bottom: 20px;" />
  <br />
  <strong>O Leitor de Mangás Distraction-Free com Sincronização Inteligente.</strong>
  <br />
  <p>
    <a href="https://andersonaraujox.github.io/mangasave/"><strong>Testar Aplicação Ao Vivo »</strong></a>
  </p>

  [![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
  [![Jest](https://img.shields.io/badge/Jest-Tested-C21325?style=flat-square&logo=jest)](https://jestjs.io/)
  [![GitHub Pages](https://img.shields.io/badge/Deploy-GitHub_Pages-brightgreen?style=flat-square)](https://andersonaraujox.github.io/mangasave/)
</div>

<br />

O **MangaSave** é uma aplicação web focada em entregar a melhor e mais imersiva experiência de leitura de mangás. Baseado fortemente nas melhores UI/UX do mercado (como MangaDex, Crunchyroll e Webtoon), ele oferece uma interface "Dark Mode First", busca integrada a múltiplas APIs de animes e mangás, e o recurso exclusivo **Smart Sync**.

---

## ✨ Principais Funcionalidades

### 🔄 Multi-Provider Search
O sistema de busca central (Coordinator) não consulta apenas uma fonte. O MangaSave varre diversas bases de dados (MangaDex, Kitsu, AniList, MangaUpdates, Jikan) simultaneamente.
- **Fallbacks robustos:** Se a API de uma provedora como a Jikan cair, a aplicação roteia automaticamente a busca para Kitsu, sem apresentar erro para o usuário.
- **Tradução Focada:** Filtra nativamente conteúdos nas línguas `pt-br` e `en` para que você não perca tempo clicando em lançamentos ilegíveis.

### 📱 Smart Sync (Sincronização Inter-Dispositivos)
A plataforma monitora em tempo real a página, o capítulo e o mangá que você está lendo.
- Mudou do **PC para o Celular**? Ao entrar no MangaSave pelo novo dispositivo, um *Toast Flutuante* super inteligente o recebe com a mensagem: `"📲 Continuar de onde parou: Cap X, Pág Y?"`
- Integração profunda: Um único clique no botão de Sincronizar te leva diretamente para a página milimétrica em que você parou a leitura.

### 📖 Leitor Moderno (Distraction-Free)
Leia do seu jeito, com interface feita de leitores para leitores:
- **Modo Webtoon (Scroll):** Deslize infinitamente por todas as páginas costuradas na tela. A Navbar inteligentemente se esconde ao perceber um scroll imersivo.
- **Modo Página a Página:** Interface semelhante à de um livro/tablet focado em 1 página por vez. Controle nativo pelo teclado (setas ← / →) com zonas invisisíveis de clique (Toque) nas laterais para avançar rapidamente com os dedos em smartphones.

### 🛡️ Resiliência Cloud e Proxy Anti-CORS
Para rodar 100% estático (SSG) sob a hospedagem segura do **GitHub Pages** sem bancos de dados caros, toda requisição API do aplicativo faz um bypass seguro utilizando o `api.allorigins.win`. O projeto anula restrições governamentais ou firewalls de provedores locais, entregando imagens sempre velozes.

---

## 🛠️ Tecnologias Utilizadas

*   **Front-end:** [Next.js (App Router)](https://nextjs.org/) e [React](https://react.dev/)
*   **Linguagem:** [TypeScript](https://www.typescriptlang.org/) para segurança estrita de tipagem e manutenabilidade.
*   **Estilos:** [Tailwind CSS](https://tailwindcss.com/) criando uma aura `Eerie Black` (#1E1E2E) com destaques agressivos `Flame Orange` (#FF4500).
*   **Qualidade & Testes:** Cobertura de Testes Unitários e de Integração densa escrita em [Jest](https://jestjs.io/) e [React Testing Library](https://testing-library.com/).
*   **Deploy Automatizado:** [GitHub Actions](https://github.com/features/actions) integrado perfeitamente ao *Next Static Exports*.

---

## 💻 Como Rodar (Ambiente de Desenvolvimento)

A aplicação pode rodar globalmente através do site ao vivo, ou localmente na sua máquina:

### Instalação
1. Clone este repositório:
   ```bash
   git clone https://github.com/AndersonAraujoX/mangasave.git
   ```
2. Acesse a pasta do projeto:
   ```bash
   cd mangasave
   ```
3. Instale as dependências rigorosamente mapeadas:
   ```bash
   npm install
   ```

### Iniciando a Aplicação
Inicie a versão de desenvolvimento local (Fast Refresh + sem proxy de requisições, 100% direta):
```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador base Chromium ou Safari.

---

## 🧪 Rodando os Testes Automatizados

O sistema foi blindado para resistir a Regressões e Bugs.

Para executar todas as **35 suítes de testes**, incluindo os testes lógicos de APIs, *Debounce Navbar* e Interações do React com a DOM Simulada (Leitor):
```bash
npm run test
```

## 🏗️ Como as Buscas Funcionam no Código?
A inteligência do Coordinator encontra-se sob uso unificado encolhendo os seguintes caminhos:
1. `src/services/coordinator.ts` engloba Multi-Busca simultânea com a `Promise.allSettled`.
2. As buscas derivam da pasta `providers/*.ts` (jikan, kitsu, anilist, etc).
3. Todas as rotas passam pelo invólucro mágico `proxiedFetch` exportado em `fetchProxy.ts` para anular erros CORS no deploy final.

---

<p align="center">
Desenvolvido com ☕️ por <b>Anderson Araújo</b>.
</p>
