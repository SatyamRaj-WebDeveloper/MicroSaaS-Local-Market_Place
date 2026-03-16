// frontend/app/layout.jsx
import './globals.css';
import Providers from './Providers';

export const metadata = {
  title: 'MicroSaaS Local',
  description: 'Zero-commission local e-commerce',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}