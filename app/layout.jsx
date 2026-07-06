import "./globals.css";

export const metadata = {
  title: "UNIKE | Dados, IA e Decisões",
  description: "Apresentação premium da Unike sobre dados, IA e gestão de creators."
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
