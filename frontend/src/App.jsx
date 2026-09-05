import { lazy, Suspense } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import { AppProvider } from './context/AppContext';
import About from './pages/About';
import Contact from './pages/Contact';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Skills from './pages/Skills';
import Profile from './pages/Profile';

// The admin dashboard and its editing UI are only ever used by the site
// owner, never by public visitors, so they don't need to be in the main
// bundle every visitor downloads. Splitting them into their own chunk
// shrinks the JS the public pages have to parse/execute on first load.
const AdminDashboard = lazy(() => import('./components/Admin/Dashboard'));
const Login = lazy(() => import('./components/Admin/Login'));

function App() {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/skills" element={<Skills />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Suspense fallback={null}><Login /></Suspense>} />
            <Route path="/admin" element={<Suspense fallback={null}><AdminDashboard /></Suspense>} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
}

export default App;
