import "./globals.css";

export const metadata = {
  title: "Q-SENSE — Quantum Learning Platform",
  description:
    "Learn, build, simulate and visualize quantum computing through an interactive learning experience.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}