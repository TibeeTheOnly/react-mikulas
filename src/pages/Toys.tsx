import { useEffect, useState } from 'react';
import { useMikulas } from '../context/MikulasContext';
import './Toys.css';

export const Toys = () => {
  const { toys, loading, error, fetchToys, createToy, deleteToy } = useMikulas();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    material: 'wood' as 'wood' | 'plastic' | 'metal',
    weight: 0
  });

  useEffect(() => {
    fetchToys();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await createToy(formData);
      setFormData({ name: '', material: 'wood', weight: 0 });
      setShowForm(false);
    } catch (err) {
      console.error('Failed to create toy:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Biztosan törölni szeretnéd ezt a játékot?')) {
      try {
        await deleteToy(id);
      } catch (err) {
        console.error('Failed to delete toy:', err);
      }
    }
  };

  if (loading && toys.length === 0) {
    return <div className="loading">Betöltés...</div>;
  }

  const materialLabels = {
    wood: '🌳 Fa',
    plastic: '🔷 Műanyag',
    metal: '⚙️ Fém'
  };

  return (
    <div className="toys-page">
      <div className="page-header">
        <h1>🎁 Játékok kezelése</h1>
        <button 
          className="btn btn-primary" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '❌ Mégse' : '➕ Új játék'}
        </button>
      </div>

      {error && <div className="error">Hiba: {error}</div>}

      {showForm && (
        <form className="toy-form" onSubmit={handleSubmit}>
          <h2>Új játék hozzáadása</h2>
          <div className="form-group">
            <label htmlFor="name">Név:</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="material">Anyag:</label>
            <select
              id="material"
              value={formData.material}
              onChange={(e) => setFormData({ ...formData, material: e.target.value as 'wood' | 'plastic' | 'metal' })}
              required
            >
              <option value="wood">🌳 Fa</option>
              <option value="plastic">🔷 Műanyag</option>
              <option value="metal">⚙️ Fém</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="weight">Súly (kg):</label>
            <input
              type="number"
              id="weight"
              step="0.1"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) })}
              required
            />
          </div>
          <button type="submit" className="btn btn-success">
            Létrehozás
          </button>
        </form>
      )}

      {toys.length === 0 ? (
        <p className="no-data">Még nincsenek játékok az adatbázisban.</p>
      ) : (
        <div className="toys-grid">
          {toys.map((toy) => (
            <div key={toy.id} className="toy-card">
              <div className="toy-header">
                <h3>{toy.name}</h3>
                <button 
                  className="btn btn-danger btn-small"
                  onClick={() => handleDelete(toy.id)}
                >
                  🗑️
                </button>
              </div>
              <p className="toy-material">{materialLabels[toy.material]}</p>
              <p className="toy-weight">⚖️ {toy.weight} kg</p>
              {toy.childId && (
                <p className="toy-assigned">✅ Kiosztva</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
