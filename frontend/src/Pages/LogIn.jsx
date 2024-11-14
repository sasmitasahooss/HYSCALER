import React from 'react'
import Btn from '../Components/Btn'
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

  const LogIn = ({handleLogin}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('')
  const navigate = useNavigate();
  const setEmployeeId = (id) => {
    localStorage.setItem('employeeId', id);
  }
  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/employees/login', { email, password });
      const result = response.data;
      localStorage.setItem('token', result.token);
      localStorage.setItem('employeeId', result.id);
      setEmployeeId(result.id);
     console.log(result.token)

      if (result.resCode === 200) {
          handleLogin({ email, password }); 
      } else {
          console.log('Login failed:', result.message);
      }
  } catch (error) {
      console.error("An error occurred during login:", error);
  }
};
  const switchToRegistration = () => {
   navigate('/registration');
}
 
  
  return (
    <>
    <div className='h-screen w-screen bg-[#0e2d49] flex justify-center items-center'>
        <div className='h-50vh w-50vw border-2 px-10 py-10 rounded-md'>
            <form action="" onSubmit={handleSubmit} className='flex flex-col gap-4'>
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="text" placeholder='Email' className='p-2 rounded-md'/>
                <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder='Password' className='p-2 rounded-md'/>
                <div className='flex justify-center'>
                    <Btn />
                </div>
                <p className='text-white text-sm'>
                        Don't have an account? 
                        <span onClick={switchToRegistration} className='text-[#fff] cursor-pointer'> Register</span>
                    </p>
            </form>
        </div>
    </div>
    </>
  )
}

export default LogIn
