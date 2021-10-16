import React from 'react';

const MainModal = () => {
  return (
    <div className="mainmodal">
      <ul id="MainModal">
        <li onClick={() => { prompt("Username")}}>Login</li>
        <li onClick={()=>{
          alert("Todays Highscores! Should fetch from Db")
        }}>HighScore</li>
        <li>Custom Song</li>
        <li> Help </li>
      </ul>
    </div>
  )
}

export default MainModal;