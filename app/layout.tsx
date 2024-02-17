import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import { Metadata } from 'next';
 
export const metadata: Metadata = {
  /* 1. In your root layout, update the metadata object to include a template:
  The %s in the template will be replaced with the specific page title. */
  //title: 'Acme Dashboard', // Substituído
  title: {
    template: '%s | Acme Dashboard',
    default: 'Acme Dashboard',
  },
  /* 1. (FIM) */
  description: 'The official Next.js Course Dashboard, built with App Router.',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
