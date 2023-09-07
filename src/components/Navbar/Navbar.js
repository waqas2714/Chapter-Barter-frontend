import React, { useState } from 'react'
import Logo from '../../assets/Logo.PNG'
import './Navbar.css'
import { FaUserSecret } from 'react-icons/fa'
import { ImSearch } from 'react-icons/im'
import { AiOutlinePoweroff } from 'react-icons/ai'
import {IoOptionsOutline} from 'react-icons/io5'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { toastOptions } from '../../pages/Signup'

const Navbar = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const userName= localStorage.getItem('userName');
  
  const handleSearch = ()=>{
    if (search === "") {
      return
    }
    navigate(`/search/${search}`);
    setSearch("");
  }
  
  const logout = ()=>{
    localStorage.clear();
    toast.success('Logged Out.', toastOptions);
    navigate('/');
  }

  return (
    <header className="header">
        <nav className='nav'>
            <div className="logo-container">
              <Link to={'/home'}><img className='nav-logo' src={Logo} alt="Logo" /></Link>
            </div>
            <div className="icons-and-links">
            
            <div className="search">
              <input type="text" className={ `search-input ${searchOpen ? 'z-above' : ''}`} placeholder='Search' value={search} onChange={(e)=>setSearch(e.target.value)}/>
              <ImSearch size={20} className='search-icon' color={searchOpen ? '#2E2E2E' : 'white'} 
              onClick={()=>{
                if (!searchOpen) {
                  setSearchOpen((prev)=>!prev)                  
                }else{
                handleSearch();
                }}}/>
            </div>
            <div >
              <Link to={'/genres'}><IoOptionsOutline size={24} className="genres-icon" /></Link>
            </div>
            <div className="profile-icon">
              <FaUserSecret size={24} onClick={()=>navigate(`/profile/${userName}`)}/>
            </div>
            <div className="logout">
              <AiOutlinePoweroff  size={24} className='logout-icon' onClick={logout}/>
            </div>
            </div>
        </nav>
        </header>
  )
}

export default Navbar