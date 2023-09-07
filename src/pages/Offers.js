import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import Sidebar from "../components/Sidebar/Sidebar";
import "../styles/Home.css";

import Offer from "../components/Offer/Offer";
import axios from "axios";
import { backendUrl } from "../utils/URLs";
import { useParams } from "react-router-dom";
import { toastOptions } from "./Signup";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { PiChatsCircleBold } from "react-icons/pi";

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userImage, setUserImage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const {userName} = useParams();
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
    isVerified();
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      toast.error("Not Authorized.", toastOptions);
    } 
  },[])


  const getOffers = async ()=>{
    try {
      setIsLoading(true);
      const {data} = await axios.get(`${backendUrl}/api/offer/getUserOffers/${userName}`);
      setOffers(data.offers);
      console.log(data.offers);
      setUserImage(data.userImage);
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
        <div className="home">
          <h3>Latest Offers by User </h3>
          <div className="offer-container">
            {
              isLoading ? <h1>Loading...</h1> : 
              offers.length>0 ?
              offers.map((offer, index)=>{
                return (
                  <Offer key={index} 
                  userName={userName} 
                  image={userImage}
                  bookIWantTitle={offer.bookIWant.title}
                  bookIWantUrlToImage={offer.bookIWant.urlToImage}
                  bookIHaveTitle={offer.bookIHave.title}
                  bookIHaveUrlToImage={offer.bookIHave.urlToImage}
                  description={offer.description}
                  offerId={offer._id}
                  offererId={offer.userId}
                  />
                )
              }) : <h2>{userName} Has made no offers.</h2>
            }
          </div>
        </div>
      </Sidebar>
    </>
  );
};

export default Offers;
