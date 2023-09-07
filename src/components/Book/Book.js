import React from "react";
import "./Book.css";
import { useNavigate } from "react-router-dom";

const Book = ({urlToImage, olid, title}) => {
  const navigate = useNavigate();
  return (
    <div className="book book-custom" onClick={()=>navigate(`/bookInfo/${olid}`)}>
      <img src={urlToImage} alt="book" className="book-image" />
      <p>{title}</p>
    </div>
  );
};

export default Book;
