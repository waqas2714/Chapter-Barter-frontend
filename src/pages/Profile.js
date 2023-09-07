import React, { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import Sidebar from "../components/Sidebar/Sidebar";
import "../styles/Profile.css";
import Book from "../components/Book/Book";
import axios from "axios";
import { backendUrl } from "../utils/URLs";
import { useNavigate, useParams } from "react-router-dom";
import { toastOptions } from "./Signup";
import { toast } from "react-toastify";
import { PiChatsCircleBold } from "react-icons/pi";

const initialState = {
  email: "",
  booksForExchange: [],
  booksRequired: [],
  image: "",
};




const Profile = () => {
  const [data, setData] = useState(initialState);
  const [isLoading, setIsLoading] = useState(true);
  const [showMyBooks, setShowMyBooks] = useState(true);
  const [selectedMyBook, setSelectedMyBook] = useState(0);
  const [selectedRequiredBook, setSelectedRequiredBook] = useState(0);
  const [openPlaceOffer, setOpenPlaceOffer] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { email, booksForExchange, booksRequired, image } = data;
  const { userName } = useParams();
  const navigate = useNavigate();
  const name = localStorage.getItem("userName");
  const userId = localStorage.getItem("_id");
  const offerBooksRequired = JSON.parse(localStorage.getItem("booksRequired"));
  const offerBooksForExchange = JSON.parse(
    localStorage.getItem("booksForExchange")
  );
  // const [myBook, setMyBook] = useState({
  //   bookIHaveTitle : offerBooksForExchange[selectedMyBook].title,
  //   bookIHaveOlid : offerBooksForExchange[selectedMyBook].olid,
  //   bookIHaveUrlToImage : offerBooksForExchange[selectedMyBook].urlToImage
  // });
  // const [requiredBook, setRequiredBook] = useState({
  //   bookIWantTitle : offerBooksRequired[selectedRequiredBook].title,
  //   bookIWantOlid : offerBooksRequired[selectedRequiredBook].olid,
  //   bookIWantUrlToImage : offerBooksRequired[selectedRequiredBook].urlToImage
  // });
  const [myBook, setMyBook] = useState();
  const [requiredBook, setRequiredBook] = useState()
  useEffect(() => {
    // Conditionally initialize myBook and requiredBook
    if (offerBooksForExchange.length > 0 && offerBooksRequired.length > 0) {
      setMyBook({
        bookIHaveTitle: offerBooksForExchange[selectedMyBook].title,
        bookIHaveOlid: offerBooksForExchange[selectedMyBook].olid,
        bookIHaveUrlToImage: offerBooksForExchange[selectedMyBook].urlToImage,
      });
      setRequiredBook({
        bookIWantTitle: offerBooksRequired[selectedRequiredBook].title,
        bookIWantOlid: offerBooksRequired[selectedRequiredBook].olid,
        bookIWantUrlToImage: offerBooksRequired[selectedRequiredBook].urlToImage,
      });
    } else {
      // Default values when the arrays are empty
      setMyBook({
        bookIHaveTitle: "",
        bookIHaveOlid: "",
        bookIHaveUrlToImage: "",
      });
      setRequiredBook({
        bookIWantTitle: "",
        bookIWantOlid: "",
        bookIWantUrlToImage: "",
      });
    }
  
    getData();
  }, [selectedMyBook, selectedRequiredBook]);
  const [description, setDescription] = useState("");

  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/");
    toast.error("Not Authorized.", toastOptions);
  }

  const isVerified = async () => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/verifyToken`, {
        token,
      });
      if (data.isVerified) {
        return;
      } else {
        navigate("/");
        toast.error("Sesion timed out, please log in again.", toastOptions);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      toast.error("Not Authorized.", toastOptions);
    }
    isVerified();
  }, []);

  const getData = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(
        `${backendUrl}/api/user/getSingleUser/${userName}`
      );
      setData({
        email: data.email,
        booksForExchange: data.booksForExchange,
        booksRequired: data.booksRequired,
        image: data.image,
      });
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const placeOffer = async ()=>{
    try {
      const {bookIHaveOlid, bookIHaveTitle, bookIHaveUrlToImage} = myBook;
      const {bookIWantOlid, bookIWantTitle, bookIWantUrlToImage} = requiredBook;
      if (description === "") {
        toast.error("Please give a description.", toastOptions);
        return
      }
      const {data} = await axios.post(`${backendUrl}/api/offer/addOffer`, {userId, description, bookIHaveOlid, bookIHaveTitle, bookIHaveUrlToImage, bookIWantOlid, bookIWantTitle, bookIWantUrlToImage})
      console.log(data);
      setOpenPlaceOffer(false)
      navigate(`/profile/${name}`)
    } catch (error) {
      console.log(error);
    }
  }



  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <Navbar />
        <Sidebar open={sidebarOpen}>
        <PiChatsCircleBold size={30} className='deals-icon' onClick={()=>setSidebarOpen((prev)=>!prev)}/>
        <div className={`backdrop ${openPlaceOffer ? "translate-back" : ""}`} onClick={()=>setOpenPlaceOffer(false)}></div>
          <div className={`offers-container ${openPlaceOffer ? "translate-back" : ""}`}>
            {
              offerBooksForExchange.length > 0 && offerBooksRequired.length > 0 && 
              <button className="place-offer" onClick={placeOffer}>Place Offer</button>
            }
            <div className="books-display">
              {offerBooksRequired?.map((book, index) => {
                return (
                  <div
                  key={index}
                  className={`offer-book ${selectedRequiredBook===index ? "selected" : ""}`}
                  onClick={()=>{
                    setSelectedRequiredBook(index)
                    setRequiredBook({
                      bookIWantTitle : book.title,
                      bookIWantOlid : book.olid,
                      bookIWantUrlToImage : book.urlToImage
                    })
                  }}
                  >
                    <img src={book.urlToImage} alt="book" className="book-image" />
                    <p>{book.title}</p>
                  </div>
                );
              })}
            </div>
            <h1>For</h1>
            <div className="books-display">
              {offerBooksForExchange?.map((book, index) => {
                return (
                  <div
                    key={index}
                    className={`offer-book ${selectedMyBook===index ? "selected" : ""}`}
                    onClick={()=>{
                      setSelectedMyBook(index)
                      setMyBook({
                        bookIHaveTitle : book.title,
                        bookIHaveOlid : book.olid,
                        bookIHaveUrlToImage : book.urlToImage
                      })
                    }}
                  >
                    <img src={book.urlToImage} alt="book" className="book-image" />
                    <p>{book.title}</p>
                  </div>
                );
              })}
            </div>
              <input type="text" placeholder="Description" value={description} onChange={(e)=>setDescription(e.target.value)}/>
            </div>
        
        {isLoading ? (
          <h1>LOADING</h1>
        ) : (
          <div className="user-information">
            <div className="profile-picture">
              <img src={image} alt="Profile Picture" />
            </div>
            <div className="user-credentials">
              <div className="info">
                <h3>Username : {userName}</h3>
                <h3>Email : {email} </h3>
                <div className="offer-buttons">
                  <button
                    className="offer-button"
                    onClick={() => navigate(`/profile/offers/${userName}`)}
                  >
                    My Offers
                  </button>
                  {name === userName && (
                    <>
                    <button
                      className="offer-button"
                      onClick={()=>setOpenPlaceOffer(true)}
                    >
                      Add Offer
                    </button>
                    <button className="offer-button" onClick={()=>navigate('/editProfile')}>Edit Profile</button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="user-books">
          <div className="headings">
            <h4
              className={showMyBooks ? "active" : ""}
              onClick={() => setShowMyBooks(true)}
            >
              My Books
            </h4>
            <h4
              className={showMyBooks ? "" : "active"}
              onClick={() => setShowMyBooks(false)}
            >
              Books Required
            </h4>
          </div>
          <div className="user-books-list">
            {showMyBooks
              ? booksForExchange.length > 0 ? booksForExchange.map((book, index) => {
                  return (
                    <Book
                      key={index}
                      urlToImage={book.urlToImage}
                      olid={book.olid}
                      title={book.title}
                    />
                  );
                }) : <h3>No books selected.</h3>
              : booksRequired.length > 0 ? booksRequired.map((book, index) => {
                  return (
                    <Book
                      key={index}
                      urlToImage={book.urlToImage}
                      olid={book.olid}
                      title={book.title}
                    />
                  );
                }) : <h3>No books selected.</h3>
              }
          </div>
        </div>
      </Sidebar>
    </>
  );
};

export default Profile;
