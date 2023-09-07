import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import "../styles/SearchResults.css";
import Book from "../components/Book/Book";
import axios from "axios";
import { backendUrl } from "../utils/URLs";
import { toastOptions } from "./Signup";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Genres = () => {
  const [genre, setGenre] = useState("fiction");
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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


  const getBooks = async ()=>{
    try {
      setIsLoading(true)
      const {data} = await axios.get(`${backendUrl}/api/book/getBooksByGenre/${genre}`);
      setBooks(data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  } 
  
  useEffect(()=>{
    getBooks();
  },[])

  useEffect(()=>{
    getBooks();
  },[genre]);

  return (
    <>
      <Navbar />
      <div className="search-container">
        <h2>Select a genre to get results</h2>
        <select onChange={(e)=>{setGenre(e.target.value)}}>
          <option value="fiction">Fiction</option>
          <option value="non-fiction">Non-Fiction</option>
          <option value="mystery">Mystery</option>
          <option value="novel">Novel</option>
          <option value="romance">Romance</option>
          <option value="narrative">Narrative</option>
          <option value="science-fiction">Science Fiction</option>
          <option value="adult">Adult Fiction</option>
          <option value="fantasy">Fantasy</option>
          <option value="horror">Horror</option>
          <option value="children">Children</option>
          <option value="autobiography">Autobiography</option>
        </select>
        <div className="result-container">
          {
            isLoading ? <h2>Loading...</h2> : 
            books.map((book, index)=>{
              return (
                <Book title={book.title} olid={book.olid} urlToImage={book.urlToImage} key={index} />
              )
            })
          }
        </div>
      </div>
    </>
  );
};

export default Genres;
