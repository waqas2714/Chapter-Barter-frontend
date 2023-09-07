import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import Sidebar from "../components/Sidebar/Sidebar";
import "../styles/BookInfo.css";
import "../styles/Home.css";
import Offer from "../components/Offer/Offer";
import axios from "axios";
import { backendUrl } from "../utils/URLs";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { toastOptions } from "./Signup";
import { PiChatsCircleBold } from "react-icons/pi";

// bookName urlToImage owners-->{username, image} offers
const BookInfo = () => {
  const [bookOwners, setBookOwners] = useState([]);
  const [bookOffers, setBookOffers] = useState([]);
  const [bookImage, setBookImage] = useState("");
  const [bookName, setBookName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isMyBook, setIsMyBook] = useState(false);
  const [isRequiredBook, setIsRequiredBook] = useState(false);
  const [bookStatus, setBookStatus] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { olid } = useParams();
  const navigate = useNavigate();
  const userId = localStorage.getItem("_id");
  const userName = localStorage.getItem("userName");
  const userImage = localStorage.getItem("image");
  const myBooks = JSON.parse(localStorage.getItem("booksForExchange"));
  const requiredBooks = JSON.parse(localStorage.getItem("booksRequired"));

  const getBook = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.post(`${backendUrl}/api/book/getOneBook`, {
        olid,
      });
      const { urlToImage, name, owners, offers } = data;
      setBookOffers(offers);
      setBookOwners(owners);
      setBookImage(urlToImage);
      setBookName(name);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const addMyBook = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`${backendUrl}/api/user/updateBooksForExchange`, {
        userId,
        title: bookName,
        olid,
      });
      setBookOwners((prevOwners) => [
        ...prevOwners,
        { name: userName, image: userImage },
      ]);
      setIsMyBook(true);
      toast.success("Book Added to My Books Successfully.", toastOptions);
      localStorage.setItem(
        "booksForExchange",
        JSON.stringify([
          ...myBooks,
          { olid, title: bookName, urlToImage: bookImage },
        ])
      );
    } catch (error) {
      console.log(error);
    }
  };

  const removeMyBook = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.patch(
        `${backendUrl}/api/user/removeBooksForExchange`,
        { userId, title: bookName }
      );
      setBookOwners((prevOwners) => {
        const newArr = prevOwners.filter((owner) => {
          return owner.name !== userName;
        });
        return newArr;
      });
      setIsMyBook(false);
      toast.success("Book Removed from My Books Successfully.", toastOptions);
      localStorage.setItem("booksForExchange", JSON.stringify(data));
    } catch (error) {
      console.log(error);
    }
  };

  const addBookRequired = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`${backendUrl}/api/user/updateBooksRequired`, {
        userId,
        title: bookName,
        olid,
      });
      setIsRequiredBook(true);
      toast.success("Book Added to Required Books Successfully.", toastOptions);
      localStorage.setItem(
        "booksRequired",
        JSON.stringify([
          ...requiredBooks,
          { olid, title: bookName, urlToImage: bookImage },
        ])
      );
    } catch (error) {
      console.log(error);
    }
  };

  const removeBookRequired = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.patch(
        `${backendUrl}/api/user/removeBooksRequired`,
        { userId, title: bookName }
      );
      setIsRequiredBook(false);
      toast.success(
        "Book Removed from Required Books Successfully.",
        toastOptions
      );
      localStorage.setItem("booksRequired", JSON.stringify(data));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBook();
  }, []);

  useEffect(() => {
    setBookStatus(false);

    myBooks.map((book) => {
      if (book.title === bookName) {
        setIsMyBook(true);
      }
    });

    requiredBooks.map((book) => {
      if (book.title === bookName) {
        setIsRequiredBook(true);
      }
    });

    setBookStatus(true);
  }, [bookOwners, myBooks, requiredBooks]);

  return (
    <>
      <Navbar />
      <Sidebar open={sidebarOpen}>
      <PiChatsCircleBold size={30} className='deals-icon' onClick={()=>setSidebarOpen((prev)=>!prev)}/>
        {isLoading ? (
          <h1>Loading...</h1>
        ) : (
          <div className="page-padding">
            <div className="book-and-owners">
              <div className="book-info-container">
                <img src={bookImage} alt="Book Image" className="book-photo" />
                <p>{bookName}</p>
                {bookStatus ? (
                  <div className="buttons">
                    {!isMyBook ? (
                      <button className="add-book-btn" onClick={addMyBook}>
                        Add to My Books
                      </button>
                    ) : (
                      <button className="add-book-btn" onClick={removeMyBook}>
                        Remove from My Books
                      </button>
                    )}
                    {!isRequiredBook ? (
                      <button
                        className="add-book-btn"
                        onClick={addBookRequired}
                      >
                        Add to Required Books
                      </button>
                    ) : (
                      <button
                        className="add-book-btn"
                        onClick={removeBookRequired}
                      >
                        Remove from Required Books
                      </button>
                    )}
                  </div>
                ) : (
                  <h3>...</h3>
                )}
              </div>
              <div className="owners">
                <h3>Owners</h3>
                <div className="owner-list">
                  {bookOwners.length > 0 ? (
                    bookOwners.map((owner, index) => {
                      return (
                        <div
                          className="owner"
                          key={index}
                          onClick={() => navigate(`/profile/${owner.name}`)}
                        >
                          <div className="user-img-container">
                            <img
                              src={owner.image}
                              alt=""
                              className="user-img"
                            />
                          </div>
                          <p>{owner.name}</p>
                        </div>
                      );
                    })
                  ) : (
                    <h3>No owners for this book.</h3>
                  )}
                </div>
              </div>
            </div>
            <h3
              style={{ textAlign: "center", margin: "1rem", fontSize: "2rem" }}
            >
              Offers
            </h3>
            <div className="offer-container">
              {bookOffers.length > 0 ? (
                bookOffers.map((offer, index) => {
                  return (
                    <Offer
                      key={index}
                      userName={offer.userName}
                      image={offer.userImage}
                      bookIWantTitle={offer.bookIWant.title}
                      bookIWantUrlToImage={offer.bookIWant.urlToImage}
                      bookIHaveTitle={offer.bookIHave.title}
                      bookIHaveUrlToImage={offer.bookIHave.urlToImage}
                      description={offer.description}
                    />
                  );
                })
              ) : (
                <h3>No Offers have been made for this book.</h3>
              )}
            </div>
          </div>
        )}
      </Sidebar>
    </>
  );
};

export default BookInfo;
