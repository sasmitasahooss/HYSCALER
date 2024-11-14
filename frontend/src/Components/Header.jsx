import React from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('employeeId');
    navigate('/login');
  }
  return (
    <>
      <div className=" header flex justify-betwwen border-2 gap-4 bg-[#0e2d49] h-10vh w-screen">
        <div className="navbar-logo">
        <img src="" alt="" />
        </div>
        
        <div className="flex justify-between text-white text-xl items-center gap-24 ml-60">
          <a href="#">Profile</a>
          <a href="#">Projects</a>
          <a href="#">Leave</a>
          <a href="#">Salary</a>
          <a onClick={handleLogout} href="/login">Logout</a>
        </div>
        <div className="menu text-white text-2xl flex items-end"><i className="ri-menu-line"></i></div>
      </div>
    </>
  );
};

export default Header;
