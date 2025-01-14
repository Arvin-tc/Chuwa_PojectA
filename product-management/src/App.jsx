import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './pages/signIn';
import SignUp from './pages/signUp';
import ForgotPassword from './pages/forgotPassword';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path = "/forgot-password" element={<ForgotPassword />} />
        <Route path="/" element={<SignIn />} />
      </Routes>
    </Router>
  );
}

export default App;
