import React from "react";
import { BsFillChatFill } from 'react-icons/bs';
import { MdDelete } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { backendUrl } from "../../utils/URLs";
import { toast } from "react-toastify";

const Offer = ({
  userName,
  image,
  bookIWantTitle,
  bookIWantUrlToImage,
  bookIHaveTitle,
  bookIHaveUrlToImage,
  description,
  offererId,
  offerId
}) => {
  const navigate = useNavigate();
  const name = localStorage.getItem('userName');

  const deleteOffer =async()=>{
    try {
      const {data} = await axios.delete(`${backendUrl}/api/offer/removeOffer/${offerId}`);
      if (data.deleted) {
       toast.success("Offer Deleted Successfully");
       navigate(`/profile/${name}`);
      }else{
        toast.error("Offer could not be deleted.");
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="offer">
      <div className="user-info-and-chat">
        <div className="user-info"  onClick={()=>navigate(`/profile/${userName}`)}>
          <img
            src={image}
            alt="User Proflie Picture"
            className="user-image"
          />
          <h4>{userName}</h4>
        </div>
        <div className="chat-btn" >
          <BsFillChatFill size={20} className="chat-icon" onClick={()=>navigate(`/chat/${offererId}/${offerId}`)}/>
          {
            userName === name && <MdDelete size={24} className="delete-icon" onClick={deleteOffer}/>
          }
        </div>
      </div>
      <div className="books">
        <div className="book">
          <img src={bookIWantUrlToImage} alt="book1" className="book-image" />
          <p>{bookIWantTitle}</p>
        </div>
        <div className="for">For</div>
        <div className="book">
          <img src={bookIHaveUrlToImage} alt="book2" className="book-image" />
          <p>{bookIHaveTitle}</p>
        </div>
      </div>
      <div className="description">
        <h4>Description:</h4>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default Offer;
