import { Bodies, Vertices, Body } from 'matter-js';

class Ship extends Bodies.fromVertices {
  constructor(engine) {
    var shape = Vertices.fromPath('0 15 -10 -15 10 -15')
    var options = {
      label: "ship",
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

class Laser extends Bodies.polygon {
  constructor(ship) {
    var nose = ship.vertices[2];
    var angle = ship.angle + Math.PI * 0.5;
    var speed = 8;
    var options = {
      label: "laser",
      angle: Math.random() * 6.28,
      friction: 0,
      frictionStatic: 0,
      frictionAir: 0,
      restitution: 1,
      lifespan: engine.timing.timestamp + 1000, // governs lifespan of laser
    };
    var laser = super(nose.x, nose.y, 3, 5, options)
    Matter.Body.setVelocity(laser, {
      x: ship.velocity.x + speed * Math.cos(angle),
      y: ship.velocity.y + speed * Math.sin(angle)
    })
    return laser;
  }
}

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
        if (angle >= 2 * Math.PI) {
          break; //stop before it becomes convex
        }
        r = 2 + Math.random() * 2;
        x = Math.round(x + r * Math.cos(angle));
        y = Math.round(y + r * Math.sin(angle));
        polyVector = polyVector.concat(x * size + ' ' + y * size + ' ');
      }
      return polyVector;
    }
    var randVertices = randomConvexPolygon((Math.random() * 30) + 5)
    var shape = Vertices.fromPath(randVertices)
    var options = {
      collisionFilter: {
        category: 0x0002,
        mask: 0x0001
      },
      label: "asteroid",
      angle: Math.random() * Math.PI * 0.5,
      friction: 0,
      frictionStatic: 0,
      frictionAir: 0,
      speed: 20
    }
    var asteroid = super(posX, posY, shape, options)
    asteroid.force = {
      x: Math.cos(asteroid.angle + Math.PI * 0.5) * 0.05,
      y: Math.sin(asteroid.angle + Math.PI * 0.5) * 0.05
    }
    return asteroid
  }
}

// Function to WRAP bodies in the canvas when offscreen
function wrapCanvas(body) {
  var height = render.options.height;
  var width = render.options.width;
  if (body.bounds.max.y <= 1) {
    Matter.Body.translate(body, { x: 0, y: height + (body.bounds.max.y - body.bounds.min.y) });
  }
  if (body.bounds.min.y >= height) {
    Matter.Body.translate(body, { x: 0, y: -height - (body.bounds.max.y - body.bounds.min.y) });
  }
  if (body.bounds.max.x <= 1) {
    Matter.Body.translate(body, { x: width + (body.bounds.max.x - body.bounds.min.x), y: 0 });
  }
  if (body.bounds.min.x >= width) {
    Matter.Body.translate(body, { x: -width - (body.bounds.max.x - body.bounds.min.x), y: 0 });
  }
}

export { Ship, Laser, Asteroid, wrapCanvas };