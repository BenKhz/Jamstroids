import React from 'react';

const Navbar = () => {
  return (
    <div className="navbar">
      <ul className="playback">
        <li><div className="button">Back</div></li>
        <li><div className="button">Play</div></li>
        <li><div className="button">Frwd</div></li>
      </ul>
      <h3 onClick={()=>{
          var modal = document.getElementsByClassName('mainmodal')[0];
          modal.classList.toggle('active')
        }}> Menu</h3>
    </div>
  )
}

export default Navbar;

