import React, { useState } from 'react'
import '../styles/auth.css'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { backendUrl } from '../utils/URLs'
import {toast} from 'react-toastify';

const initialState = {
    userName : "",
    email : "",
    password : ""
}

export const toastOptions = {
    position: 'top-right',
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
}

const Signup = () => {
    const [formData, setFormData] = useState(initialState);
    const [confirmPassword, setConfirmPassword] = useState("");
    const {email, userName, password} = formData ;
    const navigate = useNavigate();

    const handleInputChange = (e)=>{
        const {name, value} = e.target;
        setFormData({...formData, [name] : value});
    }

    const handleSubmit = async (e)=>{
        e.preventDefault();
        if (password === "" || email === "" || userName === "" || confirmPassword ==="") {
            return toast.error("Please fill all the fields.", toastOptions);
        }
        if (password !== confirmPassword) {
            return toast.error("Passwords do not match.", toastOptions);
        }
        try {
            const {data} = await axios.post(`${backendUrl}/api/user/signup`, formData);
            if (data.error) {
                throw new Error(data.error);
            }
            setFormData(initialState);
            const {user, token} = data;
            const {email, userName,booksRequired, booksForExchange, image, _id} = user;
            toast.success("Logged In!", toastOptions);
            localStorage.setItem('email', email);
            localStorage.setItem('userName', userName);
            localStorage.setItem('_id', _id);
            localStorage.setItem('token',token);
            localStorage.setItem('booksRequired', JSON.stringify(booksRequired));
            localStorage.setItem('booksForExchange',JSON.stringify(booksForExchange));
            localStorage.setItem('image', image);
            navigate('/home');
        } catch (error) {
            console.log(error);
            toast.error(error);
        }
    }

  return (
    <>
        <div className='container'>
            <form className="form" onSubmit={handleSubmit}>
                <div className="input-container">
                    <label className='input-label'>Username</label>
                    <input className='input' type="text" placeholder='Username' name='userName' value={userName} onChange={handleInputChange}/>
                </div>
                <div className="input-container">
                    <label className='input-label'>Email</label>
                    <input className='input' type="email" placeholder='Email' name='email' value={email} onChange={handleInputChange} />
                </div>
                <div className="input-container">
                    <label className='input-label'>Password</label>
                    <input className='input' type="password" placeholder='Password' name='password' value={password} onChange={handleInputChange} />
                </div>
                <div className="input-container">
                    <label className='input-label'>Confirm Password</label>
                    <input className='input' type="password" placeholder='Confirm Password' value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} />
                </div>
                <button className="btn" type='submit'>Sign Up!</button>
                <Link className='link' to={'/'}>Already have an account?</Link>
            </form>
        </div>
    </>
  )
}

export default Signup