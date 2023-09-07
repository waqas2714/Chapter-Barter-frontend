import React from 'react'
import {
  Routes,
  Route,
  BrowserRouter
} from "react-router-dom";
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Offers from './pages/Offers';
import SearchResults from './pages/SearchResults';
import Chat from './pages/Chat';
import Genres from './pages/Genres';
import BookInfo from './pages/BookInfo';
import EditProfile from './pages/EditProfile';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/home' element={<Home />} />
        <Route path='/profile/:userName' element={<Profile />} />
        <Route path='/profile/offers/:userName' element={<Offers />} />
        <Route path='/search/:search' element={<SearchResults />} />
        <Route path='/genres' element={<Genres />} />
        <Route path='/chat/:recipientId/:offerId' element={<Chat />} />
        <Route path='/bookInfo/:olid' element={<BookInfo />} />
        <Route path='/editProfile' element={<EditProfile />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App