import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '../context/ThemeContext';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'MangaSave — Leia seus mangás favoritos',
  description: 'Plataforma moderna de leitura de mangás com suporte PT-BR e Inglês. Acompanhe, leia e salve seus mangás favoritos.',
  keywords: 'manga, mangá, leitura, PT-BR, one piece, naruto',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} dark`}>
      <body className="bg-bg-primary text-text-primary font-sans antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
