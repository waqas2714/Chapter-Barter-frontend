import React, { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import "../styles/Chat.css";
import Contact from "../components/Contact/Contact";
import { MdOutlineDownloadDone } from "react-icons/md";
import axios from "axios";
import { backendUrl } from "../utils/URLs";
import { useNavigate, useParams } from "react-router-dom";
import io from "socket.io-client";
import { toast } from "react-toastify";
import { toastOptions } from "./Signup";

const socket = io(backendUrl);
let isEventListenerAdded = false;

const Chat = () => {
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [selectedContact, setSelectedContact] = useState(0);
  const [chat, setChat] = useState([]);
  const [chatIsLoading, setChatIsLoading] = useState(true);
  const [recipientName, setRecipientName] = useState("");
  const [recipientimage, setRecipientImage] = useState("");
  const [offerDescription, setOfferDescription] = useState("");
  const [ refreshContacts, setRefreshContacts] = useState(false);
  const userName = localStorage.getItem("userName");
  const senderId = localStorage.getItem("_id");
  const { recipientId, offerId } = useParams();
  const containerRef = useRef(null);
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


  const getContacts = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(
        `${backendUrl}/api/user/getContacts/${userName}`
      );
      setContacts(data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const getChat = async () => {
    try {
      setChatIsLoading(true);
      const { data } = await axios.post(`${backendUrl}/api/user/getChat`, {
        senderId,
        recipientId,
        offerId,
      });
      setChat(data);
      setChatIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const getChatUser = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/user/getUserInfo/${recipientId}`
      );
      const { userName, image } = data;
      setRecipientImage(image);
      setRecipientName(userName);
    } catch (error) {
      console.log(error);
    }
  };

  const addChat = async (e) => {
    if (chat.length > 0) {
      e.preventDefault();
    }

    try {
      socket.emit("send-message", { message, recipientId, senderId });
      await axios.patch(`${backendUrl}/api/user/addChat`, {
        userId: senderId,
        userName: recipientName,
        message,
        offerId,
      });
      setChat((prevChat) => [...prevChat, { message, recipient: recipientId }]);
      setMessage("");
    } catch (error) {
      console.log(error);
    }
  };
  
  const dealDone = async ()=>{
    try {
      await axios.post(`${backendUrl}/api/user/doneDeal`, {userId : senderId, offerId, recipientId});
      navigate('/home');
      toast.success("Deal Done!");
    } catch (error) {
      console.log(error);
    }
  }

  const getDescription = async ()=>{
    try {
      const {data} = await axios.get(`${backendUrl}/api/offer/getOfferDescription/${offerId}`);
      setOfferDescription(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    // Define the Socket.io server URL
    socket.emit("add-user", { userId: senderId });

    // Add the event listener only once
    if (!isEventListenerAdded) {
      socket.on("receive-message", ({ message, recipient, sender }) => {
        // Ensure that you only add the message once if it's meant for the current user
        if (recipient === senderId) {
          const isDuplicate = chat.some(
            (chatItem) => chatItem.message === message
          );
          // Only add the message if it's not a duplicate
          if (!isDuplicate) {
            if (recipientId === sender) {
              setChat((prevChat) => [
                ...prevChat,
                { message, recipient },
              ]); 
            }else{
              setTimeout(() => {
                setRefreshContacts((prevState)=>!prevState);
              }, 3000);
            }
          }
        }
      });

      // Set the flag to true to indicate that the event listener has been added
      isEventListenerAdded = true;
    }

    // Connect to the Socket.io server when the component mounts
    socket.connect();

    // Disconnect from the Socket.io server when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, [senderId, chat]);

  useEffect(() => {
    getContacts();
    getDescription();
    getChat();
    getChatUser();
  }, []);

  useEffect(() => {
    getDescription();
    getChat();
    getChatUser();
  }, [recipientId]);

  useEffect(()=>{
    getDescription();
    getChat();
  },[offerId])

  useEffect(() => {
    // Scroll to the bottom when the component is loaded
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [chat]);

  useEffect(()=>{
    getContacts();
  },[refreshContacts])

  return (
    <>
      <Navbar />
      <div className="chat-page-container">
        <div className="contacts-and-chat-container">
          <div className="contacts">
            <h4>Your Contacts</h4>
            <hr
              style={{
                borderColor: "rgb(255, 255, 255, 0.8)",
                width: "100%",
                margin: "auto",
              }}
            />
            {isLoading ? (
              <h3>Loading...</h3>
            ) : (
              <div className="contact-list">
                {
                contacts.length < 1 ? <h4>No contacts yet</h4> :
                contacts.map((contact, index) => {
                  return (
                    <Contact
                      index={index}
                      selected={selectedContact}
                      key={index}
                      image={contact.recipientImage}
                      userName={contact.recipientName}
                      recipientId={contact.recipientId}
                      offerId={contact.offerId}
                    />
                  );
                })}
              </div>
            )}
          </div>
          {chatIsLoading ? (
            <h1>Loading</h1>
          ) : (
            <div className="chat-container">
              <div className="info-bar">
                <div className="info-bar-contact" onClick={()=>navigate(`/profile/${recipientName}`)}>
                  <div className="contact-img-container">
                    <img
                      className="contact-img"
                      src={recipientimage}
                      alt="contact photo"
                    />
                  </div>
                  <p>{recipientName}</p>
                </div>
                <h3 className="description-info">{offerDescription}</h3>
                <MdOutlineDownloadDone size={24} className="deal-done" onClick={dealDone}/>
              </div>
              <div className="chat" ref={containerRef}>
                {chat.map((chat, index) => {
                  return (
                    <div className="message-container" key={index}>
                      <div
                        className={`message ${
                          recipientId === chat.recipient
                            ? "message-received"
                            : "message-sent"
                        }`}
                      >
                        {chat.message}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="search-bar">
                <form onSubmit={addChat}>
                  <input
                    type="text"
                    placeholder="Message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <button className="send-msg" type="submit">
                    Send
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Chat;
