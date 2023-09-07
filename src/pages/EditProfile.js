import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar/Navbar'
import Sidebar from '../components/Sidebar/Sidebar'
import '../styles/EditProfile.css'
import axios from 'axios'
import { backendUrl } from '../utils/URLs'
import { useNavigate } from 'react-router-dom'
import { PiChatsCircleBold } from 'react-icons/pi'

const EditProfile = () => {  
    const [profileImage, setProfieImage] = useState("");
    const [userImage, setUserImage] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const name = localStorage.getItem('userName');
    const image = localStorage.getItem('image');
    const userId = localStorage.getItem('_id');
    const navigate = useNavigate();
    
    useEffect(()=>{
        setProfieImage(image);
    },[])

    const handleImageChange = (e) => {
        const selectedImage = e.target.files[0];
        if (selectedImage) {
            setUserImage(selectedImage);
          // Read the selected image and set it as the new profile image
          const reader = new FileReader();
          reader.onload = (event) => {
            setProfieImage(event.target.result);
          };
          reader.readAsDataURL(selectedImage);
        }
      };

      
  const handleEditProfile = async () => {
    try {
        const formData = new FormData();
        formData.append('userId', userId);
      if (profileImage) {
        formData.append('image', userImage);
      }

      const response = await axios.put(`${backendUrl}/api/user/updateProfile`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Update the component state with the response data
      setProfieImage(response.data.image);

      // Optionally, you can also update localStorage with the new data
      localStorage.setItem('image', response.data.image);
      navigate(`/home`);
    } catch (error) {
        console.log(error);
    }
  };

  return (
    <>
        <Navbar />
        <Sidebar open={sidebarOpen}>
        <PiChatsCircleBold size={30} className='deals-icon' onClick={()=>setSidebarOpen((prev)=>!prev)}/>
            <div className="edit-profile-container">
                <div className="edit-info-container">
                    <div className="edit-image-container">
                        <div className="edit-image">
                        <img src={profileImage} alt="User Image" />
                        </div>
                        <input type="file" name="image" onChange={handleImageChange} />
                    </div>
                    <button className="btn-edit" onClick={handleEditProfile}>Edit Profile</button>
                </div>
            </div>
        </Sidebar>
    </>
  )
}

export default EditProfile