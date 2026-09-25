import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const metadata = {
  title: 'Hasiru Samvadha Ideathon 2026 | National Green Innovation Portal',
  description: 'Production management platform for Hasiru Samvadha Ideathon with 3-round evaluation and strict access control.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          <div style={{ minHeight: 'calc(100vh - 380px)', paddingTop: '78px' }}>{children}</div>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}

