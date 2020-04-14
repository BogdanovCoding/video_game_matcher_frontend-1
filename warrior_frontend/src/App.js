import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import Registration from './components/Registration';
import UserAPI from './api/UserAPI';
import LandingPage from './components/LandingPage/LandingPage';
import Profile from './components/Profile/Profile';
import Navigation from './components/Navigation';
import Messages from './components/Chat/Messages'
import FriendshipsPage from './components/FriendshipsPage/FriendshipsPage'
import Messages from './components/Chat/Messages';

function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userProfileInfo, setUserProfileInfo] = useState([])

  const fetchUserProfileInfo = async (userId) => {
    let res = await fetch(`http://localhost:8000/profile/${userId}/details/`)
    let data = await res.json()
    setUserProfileInfo(data)
    console.log('userProfInfoData: ', data)
  }

  const renderLandingPage = () => {
    return (
    <LandingPage
      handleLogin = {handleLogin}
    />
    )
  }

  const handleLogin = async (e) => {
    e.preventDefault()

    const loginCredentials = {
      'email' : e.target.email.value,
      'password' : e.target.password.value,
    }

    let data = await UserAPI.fetchUserToken(loginCredentials)
    console.log(data)

    if (data['auth_token']) {
      localStorage.setItem('token', data['auth_token'])
      localStorage.setItem('stream_token', data['stream_token'])
      localStorage.setItem('isAuthenticated', true)
      setIsAuthenticated(true)
    }

    let res = await fetch('http://localhost:8000/auth/current_user/', {
      method : 'GET',
      headers : {
        'Accept' : 'application/json',
        'content-type' : 'application/json',
        'Authorization' : `token ${localStorage.getItem('token')}`
      }
    })
    let current_user = await res.json()
    localStorage.setItem('current_user', current_user['username'])
<<<<<<< HEAD
    localStorage.setItem('id', current_user['id'])
=======
    localStorage.setItem('current_user_id', current_user['id'])
>>>>>>> random
    console.log('this is the current_user: ', current_user)
    fetchUserProfileInfo(current_user['id'])

  }

  const handleRegistration = async (e) => {
    e.preventDefault()
    try {

      let newUser = {
        'email' : e.target.email.value,
        'username' : e.target.username.value,
        'first_name' : e.target.firstName.value,
        'last_name' : e.target.lastName.value,
        'password' : e.target.password.value,
        're_password' : e.target.passwordCheck.value
      }
      let data = await UserAPI.createNewUser(newUser)
      console.log(data)

      let res = await UserAPI.linkUserToProfile(data.id)
      

    } catch (err) {
      console.log('e: ', err)
    }
  }

  const renderRegistration = () => {
    return (
      <Registration handleRegistration = {handleRegistration} />
    )
  }

  const handleLogout = () => {
    localStorage.clear()
    setIsAuthenticated(false)
  }

  const renderProfile = () => {
    return (
      <Profile
        fetchUserProfileInfo = {fetchUserProfileInfo}
        userProfileInfo = {userProfileInfo}
      />
    )
  }


  return (
    <div >
      <Router>
        <Navigation 
          isAuthenticated = {isAuthenticated}
          handleLogout = {handleLogout}
        />

        <Switch>
          <Route exact path = '/' render = {renderLandingPage} />
<<<<<<< HEAD
          <Route exact path = '/profile' component = {Profile} />
          <Route exact path = '/profile/friendships' component = {FriendshipsPage} />
=======
          <Route exact path = '/profile' render = {renderProfile} />
          <Route exact path = '/profile/:userId/edit' />
>>>>>>> random
          <Route exact path = '/registration' render = {renderRegistration} />
          <Route exact path = '/chat' component = {Messages} isAuthenticated = {isAuthenticated} />
        </Switch>
      </Router>
    </div>

  );

}

export default App;
