import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col w-full">
      <Header />
      <main className="mx-auto">{children}</main>
      <Footer />
    </div>
  );
}