import React from'react'
import ReactDOM from 'react-dom'
import NavBar from './src/components/NavBar.js'
import MainModal from './src/components/MainModal'
import Controls from './src/components/Controls'
// require('./src/components/Game.js')


ReactDOM.render(
 <div>
   <NavBar/>
   <MainModal/>
   <Controls/>
 </div>,
  document.getElementById('app')
)
