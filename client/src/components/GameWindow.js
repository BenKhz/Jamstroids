import Matter from 'matter-js';
import React, { Component } from 'react';

/// /// ///  TODOs here
import {Ship, Laser, Asteroid} from './GameUtils';

class GameWindow extends Component {
  constructor(props) {
    super(props)
    this.state = {
      lives: 3,
      asteroids: [],
      lasers: [],
    }
  }
componentDidMount() {
  var centerX = document.documentElement.clientWidth / 2;
  var centerY = document.documentElement.clientHeight / 2;
  var engine = Matter.Engine.create({ gravity : { y : 0 }})
  var render = Matter.Render.create({
    element: this.refs.GameWindow,
    engine: engine,
    options: {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
    }
  })
  var keys = [];
// Global listeners for key presses
  document.body.addEventListener("keydown", function(e) {
    keys[e.keyCode] = true;
  });
  document.body.addEventListener("keyup", function(e) {
    keys[e.keyCode] = false;
  });

  // Refactor into class later
  // Create a triangle from vertices for ship.
  // var boxA = Matter.Bodies.fromVertices(centerX, centerY, [
  //   {x:0, y:0},
  //   {x:10, y:-30},
  //   {x:20, y:0}])

    var boxA = new Ship(engine);


  // When 'beforeRender' event emitted from render object.
  Matter.Events.on(render, 'beforeRender', () => {
    var player = engine.world.bodies[0];
    if (keys[38] || keys[87]) { //forward thrust
      player.force = {
        x: -Math.cos(player.angle + Math.PI * 0.5) * 0.0001,
        y: -Math.sin(player.angle + Math.PI * 0.5) * 0.0001
      }
    }
    if (keys[40] || keys[83]) { //reverse thrust
      player.force = {
        x: Math.cos(player.angle + Math.PI * 0.5) * 0.0001,
        y: Math.sin(player.angle + Math.PI * 0.5) * 0.0001
      };
    }
    if ((keys[37] || keys[65])) {
      player.torque -= 0.001;
    }
    if ((keys[39] || keys[68])) {
      player.torque += 0.001;
    }
    wrapCanvas(player)

  })
  function wrapCanvas(body) { // Function to WRAP bodies in the canvas when offscreen
    var height = render.options.height;
    var width = render.options.width;
    if(body.bounds.max.y <= 1){
        Matter.Body.translate(body,{ x:0, y: height + (body.bounds.max.y - body.bounds.min.y) });
    }
    if(body.bounds.min.y >= height){
        Matter.Body.translate(body,{ x:0, y: -height - (body.bounds.max.y - body.bounds.min.y) });
    }
    if(body.bounds.max.x <= 1){
        Matter.Body.translate(body,{ x:width + (body.bounds.max.x - body.bounds.min.x), y: 0 });
    }
    if(body.bounds.min.x >= width){
        Matter.Body.translate(body,{ x:-width - (body.bounds.max.x - body.bounds.min.x), y: 0 });
    }
  }
  //Add Body to world here.
  Matter.World.add(engine.world, [boxA])
  //Runner (Matter.Engine -> deprecated) controls engine simulation
  Matter.Runner.run(engine)
  // Render controls rendering bodies to canvas
  Matter.Render.run(render)

}

  render() {
    return (
      <div ref="GameWindow" id="GameWindow"/>
    )
  }
}

export default GameWindow;