import { Link } from 'react-router-dom';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="layout">
      <nav className="navbar">
        <div className="nav-brand">🎅 Mikulás Alkalmazás</div>
        <div className="nav-links">
          <Link to="/" className="nav-link">Kezdőlap</Link>
          <Link to="/children" className="nav-link">Gyerekek</Link>
          <Link to="/toys" className="nav-link">Játékok</Link>
        </div>
      </nav>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};
