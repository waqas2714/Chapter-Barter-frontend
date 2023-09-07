import React from "react";
import {useNavigate} from 'react-router-dom';

const Deal = ({recipient, offerId, name, description}) => {
  const navigate = useNavigate();
  return (
    <div className="deal" onClick={()=>navigate(`/chat/${recipient}/${offerId}`)}>
      <h5>{name}</h5>
      <div className="description">
        <p>{description}</p>
      </div>
    </div>
  );
};

export default Deal;
