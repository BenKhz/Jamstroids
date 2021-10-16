import Matter from 'matter-js';
import React, { Component } from 'react';

class GameWindow extends Component {
  constructor(props) {
    super(props)
    this.state = {
      lives: 3,
    }
  }
componentDidMount() {
  var engine = Matter.Engine.create({ gravity : { y : 0 }})
  var render = Matter.Render.create({
    element: this.refs.GameWindow,
    engine: engine,
    options: {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
    }
  })
   Matter.Render.run(render)

}

  render() {
    return (
      <div ref="GameWindow" id="GameWindow"/>
    )
  }
}

export default GameWindow;