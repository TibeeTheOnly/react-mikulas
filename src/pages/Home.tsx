import { Link } from 'react-router-dom';
import './Home.css';

export const Home = () => {
  return (
    <div className="home">
      <h1>🎅 Üdvözöllek a Mikulás Alkalmazásban!</h1>
      <p className="subtitle">Kezeld a gyerekeket és ajándékokat egyszerűen</p>
      
      <div className="home-cards">
        <Link to="/children" className="home-card">
          <div className="card-icon">👶</div>
          <h2>Gyerekek</h2>
          <p>Tekintsd meg és kezeld a gyerekek listáját</p>
        </Link>
        
        <Link to="/toys" className="home-card">
          <div className="card-icon">🎲</div>
          <h2>Játékok</h2>
          <p>Hozz létre, töröld és rendeld hozzá a játékokat</p>
        </Link>
      </div>
    </div>
  );
};
