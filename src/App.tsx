import { Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import ResumeOptimize from './pages/ResumeOptimize';
import JDAnalyze from './pages/JDAnalyze';
import InterviewPrep from './pages/InterviewPrep';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Login from './pages/Login';

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  // 登录页面不使用 Layout
  if (isLoginPage) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
      </Routes>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/resume" element={<ResumeOptimize />} />
        <Route path="/jd" element={<JDAnalyze />} />
        <Route path="/interview" element={<InterviewPrep />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Layout>
  );
}

export default App;
