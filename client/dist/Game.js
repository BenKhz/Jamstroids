// Matter.js aliases here for ease.
var Engine = Matter.Engine,
  Events = Matter.Events,
  Render = Matter.Render,
  Runner = Matter.Runner,
  Bodies = Matter.Bodies,
  Composite = Matter.Composite,
  Vertices = Matter.Vertices;

// create an engine
var engine = Engine.create();
engine.gravity.y = 0;


// create a renderer THIS MAKES A Canvas obj, that we can grab context from.
// Most of these can be deleted but left useful options on for debugging.
var render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    width: 800,
    height: 600,
    pixelRatio: 1,
    background: '#fafafa',
    wireframeBackground: '#222',
    enabled: true,
    wireframes: true,
    showSleeping: true,
    showVelocity: true,
    showCollisions: true,
    showAxes: true,
    showAngleIndicator: true,
    showVertexNumbers: true
  }
});

// define ship class with necessary game attributes
class Ship extends Bodies.fromVertices {
  constructor() {
    var shape = Vertices.fromPath('0 15 -10 -15 10 -15')
    var options = {
    dead: false,
    thrust: 0.0002,
    yaw: 0.00133,
    rotationLimit: 0.05,
    angularFriction: 0.9,
    durability: 1,
    lastLaser: engine.timing.timestamp,
    }
    super(300, 300, shape, options);
  }
}

// define asteroid class with attributes
class Asteroid extends Bodies.fromVertices {
  constructor(posX, posY) {
    // Helper function for generating random convex vertex paths
    function randomConvexPolygon(size) { //returns a string of vectors that make a convex polygon
      var polyVector = '';
      var x = 0;
      var y = 0;
      var r = 0;
      var angle = 0;
      for (var i = 1; i < 60; i++) {
        angle += 0.1 + Math.random(); //change in angle in radians
        if (angle > 2 * Math.PI) {
          break; //stop before it becomes convex
        }
        r = 2 + Math.random() * 2;
        x = Math.round(x + r * Math.cos(angle));
        y = Math.round(y + r * Math.sin(angle));
        polyVector = polyVector.concat(x * size + ' ' + y * size + ' ');
      }
      return polyVector;
    }
    var randVertices = randomConvexPolygon(40)
    var shape = Vertices.fromPath(randVertices)
    super(posX, posY, shape)
  }
}
// define laser class
class Laser extends Bodies.polygon {
  constructor(ship) {
    var nose = ship.vertices[2];
    var angle = ship.angle + Math.PI * 0.5;
    var speed = 8;
    var options = {
      angle: Math.random() * 6.28,
      friction: 0,
      frictionStatic: 0,
      frictionAir: 0,
      restitution: 1,
      lifespan: engine.timing.timestamp + 1000, // governs lifespan of laser
    };
    var laser = super(nose.x, nose.y, 3, 5, options )
    Matter.Body.setVelocity(laser, {
      x: ship.velocity.x + speed * Math.cos(angle),
      y: ship.velocity.y + speed * Math.sin(angle)
    })
    // lasers.push(laser);
    return laser;
  }
}

var instantiateBodies = () => { // only starting ship for now
  var initBodies = [];
  initBodies.push(new Ship(400, 300, 3, 20))
  // initBodies.push(new Asteroid(100, 100))
  // initBodies.push(new Asteroid(200, 50))
  return initBodies;
}

// add all of the bodies to the world

// add any boundaries or static items

// add player ship

// add random asteroids
Composite.add(engine.world, instantiateBodies());

var instantiateBodies = () => { // only starting ship for now
  var initBodies = [];
  initBodies.push(new Ship(400, 300, 3, 20))
  initBodies.push(new Asteroid(100, 100))
  initBodies.push(new Asteroid(200, 50))
  return initBodies;
}

// Global array for keypress tracking
var keys = [];
// Global listeners for key presses
  document.body.addEventListener("keydown", function(e) {
    keys[e.keyCode] = true;
  });
  document.body.addEventListener("keyup", function(e) {
    keys[e.keyCode] = false;
  });
// keypress to ship control updates.
function manageControls() {
  var player = engine.world.bodies[0]
  if (!player.dead) {
    if (keys[32] && engine.timing.timestamp - player.lastLaser > 150 ){ // Needs cool down?
      var nose = player.vertices[2];
      player.lastLaser = engine.timing.timestamp
      Composite.add(engine.world, new Laser(player))
    }
    if (keys[38] || keys[87]) { //forward thrust
      player.force.x += player.thrust * Math.cos(player.angle + Math.PI * 0.5);
      player.force.y += player.thrust * Math.sin(player.angle + Math.PI * 0.5);
    } else if (keys[40] || keys[83]) { //reverse thrust

      player.force = {
        x: -player.thrust * 0.5 * Math.cos(player.angle + Math.PI * 0.5),
        y: -player.thrust * 0.5 * Math.sin(player.angle + Math.PI * 0.5)
      };
    }
    //rotate left and right
    if ((keys[37] || keys[65])) {
      player.torque = -player.yaw;
    } else if ((keys[39] || keys[68])) {
      player.torque = player.yaw;
    }
    // dampen excessive angular velocity if too great.
    if (Math.abs(player.angularVelocity) > player.rotationLimit) {
      Matter.Body.setAngularVelocity(player, player.angularVelocity * player.angularFriction);
    }
  }
}
// global array for lasers
const lasers = [];
// laser cleanup and lifespan function
function manageLasers() {
  engine.world.bodies.forEach((laser, i) => {
    if(laser.lifespan < engine.timing.timestamp){
      Composite.remove(engine.world, laser)
      // lasers.splice(i)
    }
  })
}
// run the renderer
Render.run(render);
// List Events below
Events.on(render, "beforeRender", manageControls)
Events.on(render, "beforeRender", manageLasers)
// Add collsion events below
// Events.on(render, 'onCollision', cb)

// create runner
var runner = Runner.create();

// run the engine
Runner.run(runner, engine);

