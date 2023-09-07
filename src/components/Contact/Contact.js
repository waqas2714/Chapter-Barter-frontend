import React from "react";
import { useNavigate } from "react-router-dom";

const Contact = ({image, userName, recipientId, offerId, index, selected}) => {
  const navigate = useNavigate();
  return (
    <div className="contact" onClick={()=>navigate(`/chat/${recipientId}/${offerId}`)}>
      <div className="contact-img-container">
        <img className="contact-img" src={image} alt="contact photo" />
      </div>
      <p>{userName}</p>
    </div>
  );
};

export default Contact;
