import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar/Navbar'
import '../styles/SearchResults.css'
import Book from '../components/Book/Book'
import axios from 'axios'
import { backendUrl } from '../utils/URLs'
import { useParams } from 'react-router-dom'
import { toastOptions } from "./Signup";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const {search} = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token')
  if (!token) {
    navigate('/');
    toast.error("Not Authorized.", toastOptions);
  } 

  const isVerified = async ()=>{
    try {
      const {data} = await axios.post(`${backendUrl}/api/user/verifyToken`, {token});
      if (data.isVerified) {
        return
      }else{
        navigate('/');
        toast.error("Sesion timed out, please log in again.", toastOptions);
      }
    } catch (error) {
     console.log(error); 
    }
  }

  useEffect(()=>{
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      toast.error("Not Authorized.", toastOptions);
    } 
  },[])

  const getResults = async ()=>{
    try {
      setIsLoading(true);
      const {data} = await axios.post(`${backendUrl}/api/book/getBooks`, {title : search});
      setResults(data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=>{
    getResults();
  },[])

  useEffect(()=>{
    getResults();
  },[search])

  return (
    <>
        <Navbar />
        <div className="search-container">
        <h2>Here Are Your Results</h2>
        <div className="result-container">
            {
              isLoading ? <h2>Loading...</h2> :
              results.map((book, index)=>{
                return (
                  <Book key={index} urlToImage={book.urlToImage} olid={book.olid} title={book.title} />
                )
              })
            }
            </div>
        </div>
    </>
  )
}

export default SearchResults