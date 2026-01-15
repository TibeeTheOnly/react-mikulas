import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Children } from './pages/Children';
import { ChildDetail } from './pages/ChildDetail';
import { Toys } from './pages/Toys';
import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/children" element={<Children />} />
          <Route path="/children/:id" element={<ChildDetail />} />
          <Route path="/toys" element={<Toys />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
