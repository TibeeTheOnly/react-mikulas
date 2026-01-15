import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useMikulas } from '../context/MikulasContext';
import './Children.css';

export const Children = () => {
  const { children, loading, error, fetchChildren } = useMikulas();

  useEffect(() => {
    fetchChildren();
  }, []);

  if (loading) {
    return <div className="loading">Betöltés...</div>;
  }

  if (error) {
    return <div className="error">Hiba: {error}</div>;
  }

  return (
    <div className="children-page">
      <h1>👶 Gyerekek listája</h1>
      
      {children.length === 0 ? (
        <p className="no-data">Még nincsenek gyerekek az adatbázisban.</p>
      ) : (
        <div className="children-grid">
          {children.map((child) => (
            <Link 
              key={child.id} 
              to={`/children/${child.id}`} 
              className="child-card"
            >
              <div className="child-header">
                <h3>{child.name}</h3>
                <span className={`badge ${child.hasBeenGood ? 'good' : 'bad'}`}>
                  {child.hasBeenGood ? '😇 Jó' : '😈 Rossz'}
                </span>
              </div>
              <p className="child-address">📍 {child.address}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
