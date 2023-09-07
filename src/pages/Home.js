import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import Sidebar from "../components/Sidebar/Sidebar";
import "../styles/Home.css";
import Offer from "../components/Offer/Offer";
import axios from "axios";
import { backendUrl } from "../utils/URLs";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { toastOptions } from "./Signup";
import { PiChatsCircleBold } from "react-icons/pi";

const Home = () => {
  const [offers, setOffers] = useState([]);
  const [RelevantOffersFound, setRelevantOffersFound] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [gettingAllOffers, setGettingAllOffers] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const booksForExchange = JSON.parse(localStorage.getItem('booksForExchange'));
  const booksRequired = JSON.parse(localStorage.getItem('booksRequired'));
  const userId = localStorage.getItem('_id');
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


  const getOffers = async ()=>{ //Relevant
    try {
      setIsLoading(true);
      const {data} = await axios.post(`${backendUrl}/api/offer/getOffers`, {userId, booksForExchange, booksRequired});
      setOffers(data.offers);
      setRelevantOffersFound(data.RelevantOffersFound);
      if (data.RelevantOffersFound) {
        setGettingAllOffers(false);
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  const getAllOffers = async ()=>{ 
    try {
      setIsLoading(true);
      const {data} = await axios.get(`${backendUrl}/api/offer/getAllOffers/${userId}`);
      setOffers(data);
      setGettingAllOffers(true);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=>{
    getOffers();
  },[])

  return (
    <>
      <Navbar />
      <Sidebar open={sidebarOpen}>
      <PiChatsCircleBold size={30} className='deals-icon' onClick={()=>setSidebarOpen((prev)=>!prev)}/>
        <button className={`all-offers ${RelevantOffersFound ? 'block' : ""}`} onClick={gettingAllOffers ? getOffers :getAllOffers} >{gettingAllOffers ? "Get Relevant Offers": "Get All Offers"}</button>
        {
          isLoading ? <h2>Loading...</h2> : (
            <div className="home">
          {
            RelevantOffersFound ? <h3>{gettingAllOffers ? "These are All Offers." : "Latest Offers For You"} </h3> : <h3>No relevant new offers found, take a look at all offers.</h3>
          }
          <div className="offer-container">
            {
              offers?.length > 0 ?
              offers.map((offer,index)=>{
              return (
                <Offer key={index} 
                  userName={offer.userName} 
                  image={offer.image}
                  bookIWantTitle={offer.bookIWant.title}
                  bookIWantUrlToImage={offer.bookIWant.urlToImage}
                  bookIHaveTitle={offer.bookIHave.title}
                  bookIHaveUrlToImage={offer.bookIHave.urlToImage}
                  description={offer.description}
                  offerId={offer._id}
                  offererId={offer.userId}
                  />
              )
            }) :
              <h2>No Offers Found</h2>
          }
          </div>
        </div>
          )
        }
      </Sidebar>
    </>
  );
};

export default Home;
