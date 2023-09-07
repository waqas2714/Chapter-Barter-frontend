import React, { useEffect, useState } from 'react'
import './Sidebar.css'
import Deal from '../Deal/Deal'
import axios from 'axios';
import { backendUrl } from '../../utils/URLs';

const Sidebar = ({open, children}) => {
  const [deals, setDeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const userId = localStorage.getItem('_id');

  const getDeals = async()=>{
    try {
      setIsLoading(true)
      const {data} = await axios.get(`${backendUrl}/api/user/getDeals/${userId}`);
      setDeals(data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=>{
    getDeals();
  },[])

  return (
    <nav className='sidebar'>
        <div className={`sidebar-elements ${open ? 'translate-back' : ''}`}>
            <h4 style={{marginTop : "1rem"}}>Welcome User! </h4>
            <h4>Your Current ongoing deals are:</h4>
            {
              isLoading ? <h2>Loading...</h2>:
              <div className="deals">
              {
                deals.length > 0 ?
                deals.map((deal, index)=>{
                  return (
                    <Deal key={index} 
                    name={deal.name} 
                    recipient={deal.recipient} 
                    description={deal.description} 
                    offerId={deal.offerId}
                    />
                  )
                }) : <h4>You have no ongoing deals.</h4>
              }
            </div>
            }
            
        </div>
        <div className="children">
            {children}
        </div>
    </nav>
  )
}

export default Sidebar