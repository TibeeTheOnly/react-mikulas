import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useMikulas } from '../context/MikulasContext';
import './ChildDetail.css';

export const ChildDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    children, 
    toys, 
    fetchChildren, 
    fetchToys,
    getChildToys,
    assignToyToChild,
    removeToyFromChild,
    loading,
    error
  } = useMikulas();

  const [selectedToyId, setSelectedToyId] = useState<number | ''>('');
  const [assignError, setAssignError] = useState<string | null>(null);

  const child = children.find(c => c.id === Number(id));
  const childToys = child ? getChildToys(child.id) : [];

  useEffect(() => {
    fetchChildren();
    fetchToys();
  }, []);

  const handleAssignToy = async () => {
    if (!child || selectedToyId === '') return;
    
    setAssignError(null);
    try {
      await assignToyToChild(child.id, Number(selectedToyId));
      setSelectedToyId('');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ismeretlen hiba';
      setAssignError(errorMessage);
      console.error('Failed to assign toy:', err);
    }
  };

  const handleRemoveToy = async (toyId: number) => {
    if (!child) return;
    
    if (window.confirm('Biztosan elveszed ezt a játékot?')) {
      try {
        await removeToyFromChild(child.id, toyId);
      } catch (err) {
        console.error('Failed to remove toy:', err);
      }
    }
  };

  if (loading && !child) {
    return <div className="loading">Betöltés...</div>;
  }

  if (!child) {
    return (
      <div className="not-found">
        <h2>😕 Nem található gyerek</h2>
        <p>A keresett gyerek nem létezik.</p>
        <Link to="/children" className="btn btn-primary">Vissza a gyerekekhez</Link>
      </div>
    );
  }

  const availableToys = toys.filter(
    toy => !toy.childId || toy.childId === null
  );

  const materialLabels = {
    wood: '🌳 Fa',
    plastic: '🔷 Műanyag',
    metal: '⚙️ Fém'
  };

  return (
    <div className="child-detail">
      <button onClick={() => navigate(-1)} className="btn-back">
        ← Vissza
      </button>

      <div className="detail-card">
        <div className="detail-header">
          <h1>{child.name}</h1>
          <span className={`badge-large ${child.hasBeenGood ? 'good' : 'bad'}`}>
            {child.hasBeenGood ? '😇 Jó gyerek' : '😈 Rossz gyerek'}
          </span>
        </div>
        
        <div className="detail-info">
          <p><strong>📍 Cím:</strong> {child.address}</p>
          <p><strong>🆔 Azonosító:</strong> {child.id}</p>
        </div>
      </div>

      <div className="toys-section">
        <h2>🎁 Játékok</h2>
        
        {error && <div className="error">Hiba: {error}</div>}
        {assignError && <div className="error">Hiba: {assignError}</div>}
        
        {child.hasBeenGood ? (
          <div className="assign-toy">
            <select 
              value={selectedToyId} 
              onChange={(e) => setSelectedToyId(e.target.value === '' ? '' : Number(e.target.value))}
              className="toy-select"
            >
              <option value="">Válassz játékot...</option>
              {availableToys.map(toy => (
                <option key={toy.id} value={toy.id}>
                  {toy.name} ({materialLabels[toy.material]}, {toy.weight} kg)
                </option>
              ))}
            </select>
            <button 
              onClick={handleAssignToy} 
              disabled={selectedToyId === ''}
              className="btn btn-primary"
            >
              Játék hozzáadása
            </button>
          </div>
        ) : (
          <div className="warning-message">
            ⚠️ Ez a gyerek rossz volt, nem kap játékot!
          </div>
        )}

        {childToys.length === 0 ? (
          <p className="no-toys">Még nincs játék hozzárendelve.</p>
        ) : (
          <div className="child-toys-list">
            {childToys.map(toy => (
              <div key={toy.id} className="toy-item">
                <div className="toy-info">
                  <h4>{toy.name}</h4>
                  <p className="toy-material">{materialLabels[toy.material]}</p>
                  <span className="toy-weight">⚖️ {toy.weight} kg</span>
                </div>
                <button 
                  onClick={() => handleRemoveToy(toy.id)}
                  className="btn btn-danger btn-small"
                >
                  🗑️ Eltávolítás
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
