import { Route, Routes } from 'react-router-dom';
import './App.css';

import Login from './views/public/login';
import ChangePassword from './views/public/changePassword';
import ForgotPassword from './views/public/forgotPassword';
import ResetPassword from './views/public/resetPassword';
import ValidateSession from './views/private/validateSession';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/change-password" element={<ChangePassword />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/*" element={<ValidateSession />} />
    </Routes>
  );
}

export default App;
