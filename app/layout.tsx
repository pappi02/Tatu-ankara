import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tatu Ankara | Elegant African Fashion",
  description:
    "Kenyan fashion brand specializing in contemporary women's clothing crafted from premium Ankara fabrics.",
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