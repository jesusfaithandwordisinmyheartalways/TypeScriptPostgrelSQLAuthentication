



import React, { useEffect, useState } from 'react';
import './CSS/Welcome.css'


const Welcome = () => {
  const [username, setUsername] = useState('');

  useEffect(() => {
     const retrieveUserData = async () => {
      const response = await fetch('http://localhost:3001/user', {
        credentials: 'include'
      });
      const data = await response.json();
      setUsername(data.username);
     }
      retrieveUserData()
  })



  return (
    <>
      <div className='welcome-container'>
        <div className='welcome-wrapper'>

        <div> Welcome: <span>{username} </span> </div>



        </div>
      </div>
    
    </>
  )
}



export default Welcome
