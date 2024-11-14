import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const Registration = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://localhost:7000/employees/register`, { name, email, password })
            setSuccessMessage(`User registered successfully`);
            setTimeout(() => {
                navigate('/login');
            }, 2000);
    }catch(error){
        setErrorMessage(error.response.data.message);
        console.log(error.message)
    }
}

    const switchToLogin = () => {
        navigate('/login');
    };

    return (
        <>
        <p className='text-white text-sm mt-2 text-center bg-green-500'>{successMessage}</p>
        <p className='text-white text-sm mt-2 text-center bg-red-500'>{errorMessage}</p>
            <div className='h-screen w-screen bg-[#0e2d49] flex justify-center items-center'>
                <div className='h-50vh w-50vw border-2 px-10 py-10 rounded-md'>
                    <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                        <input value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder='Name' className='p-2 rounded-md'/>
                        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder='Email' className='p-2 rounded-md'/>
                        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder='Password' className='p-2 rounded-md'/>
                        <div className='flex justify-center'>
                            <button type='submit' className='bg-[#fff] text-[#0e2d49] p-2 rounded-md'>Register</button>
                        </div>
                        
                        <p className='text-white text-sm'>
                            Already have an account? 
                            <span onClick={switchToLogin} className='text-[#fff] cursor-pointer'> Login</span>
                        </p>            
                    </form>
                </div>
            </div>
        </>
    );
};

export default Registration;
