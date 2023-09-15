import React, { useEffect, useState } from 'react'
import '../styles/auth.css'
import { Link, useNavigate } from 'react-router-dom'
import { backendUrl } from '../utils/URLs'
import { toast } from 'react-toastify'
import axios from 'axios'
import { toastOptions } from './Signup'

const initialState = {
    userName : "",
    password : ""
}

const Login = () => {
    const [formData, setFormData] = useState(initialState);
    const {userName, password} = formData;
    const navigate = useNavigate();

    const handleInputChange = (e)=>{
        const {name, value} = e.target;
        setFormData({...formData, [name] : value});
    }

    const handleSubmit = async (e)=>{
        e.preventDefault();
        if (password === "" || userName === "") {
            return toast.error("Please fill all the fields.", toastOptions);
        }
        try {
            const {data} = await axios.post(`${backendUrl}/api/user/login`, formData);
            if (data.error) {
                return toast.error(data.error, toastOptions);
            }
            setFormData(initialState);
            const {_id, email, userName, image, booksRequired, booksForExchange, token} = data;
            
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
        }
    }

    const verifyToken = async ()=>{
        const token = localStorage.getItem('token');
        if (token) {
            const {data} = await axios.post(`${backendUrl}/api/user/verifyToken`, {token});
            if (data.isVerified) {
                navigate('/home');
            }
        }
    }

    useEffect(()=>{
        verifyToken();
    },[])

    useEffect(()=>{
        toast.info("Due to the free version of render, the backend takes time in loading, if it doesn't login at first, you might need to refresh the page.", toastOptions)
    },[])
    
  return (
    <>
        <div className='container'>
            <form className="form" onSubmit={handleSubmit}>
                <div className="input-container">
                    <label className='input-label'>Username</label>
                    <input className='input' type="text" placeholder='Username' name='userName' value={userName} onChange={handleInputChange}/>
                </div>
                <div className="input-container">
                    <label className='input-label'>Password</label>
                    <input className='input' type="password" placeholder='Password' name='password' value={password} onChange={handleInputChange}/>
                </div>
                <button className="btn" type='submit'>Login!</button>
                <Link className='link' to={'/signup'}>Don't have an account?</Link>
            </form>
        </div>
    </>
  )
}

export default Login
