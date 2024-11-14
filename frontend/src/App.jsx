import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Admin from './Pages/Admin'
import Employee from './Pages/Employee'
import LogIn from './Pages/LogIn'
import Registration from './Pages/Registration'
import axios from 'axios';
function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const handleLogin = async ({ email, password }) => {
    if (email === 'admin@example.com' && password === '123') {
      setUser('admin');
      navigate('/admin');
    } else {
      const response = await axios.post('http://localhost:5000/employees/login',
        { email, password });  
      const result = response.data;
      if (result) {
        setUser('employee');
      } else {
        alert("Invalid credentials");
      }
      console.log(user)
      if(user === 'admin'){
        navigate('/admin');
      }else{
        navigate('/employee');
      }
    }
  };

  return (
    <Routes>
      <Route path="/" element={<LogIn handleLogin={handleLogin} />} />
      <Route path="/login" element={<LogIn handleLogin={handleLogin} />} />
      <Route path="/registration" element={<Registration />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/employee" element={<Employee />} />
    </Routes>
  )
}

export default App
