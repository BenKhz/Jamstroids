
var Engine = Matter.Engine,
  Render = Matter.Render,
  Runner = Matter.Runner,
  Bodies = Matter.Bodies,
  Composite = Matter.Composite,
  Vertices = Matter.Vertices;

// create an engine
var engine = Engine.create();
engine.gravity.y = 0;


// create a renderer
var render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    width: 800,
    height: 600,
    pixelRatio: 1,
    background: '#fafafa',
    wireframeBackground: '#222',
    hasBounds: false,
    enabled: true,
    wireframes: true,
    showSleeping: true,
    showDebug: true,
    showBroadphase: false,
    showBounds: false,
    showVelocity: true,
    showCollisions: true,
    showSeparations: false,
    showAxes: true,
    showPositions: false,
    showAngleIndicator: true,
    showIds: false,
    showShadows: false,
    showVertexNumbers: true,
    showConvexHulls: false,
    showInternalEdges: false,
    showMousePosition: false
}
});

class Ship extends Bodies.fromVertices {
  constructor() {
    var shape = Vertices.fromPath('0 15 -10 -15 10 -15')
    super(300, 300, shape);
    this.moveShip = (e) => {
      console.log(e.key)
      if(e.key === 'a') {
        Matter.Body.setAngularVelocity(this, -0.025);
      }
      if(e.key === 'd') {
        Matter.Body.setAngularVelocity(this, 0.025);
      }
      if(e.key === 'w') {
        var targetAngle = Matter.Vector.angle(this.position, {x: this.vertices[2].x, y: this.vertices[2].y});
        var force = 0.001;
        Matter.Body.applyForce(this, this.position, {
          x: Math.cos(targetAngle) * force,
          y: Math.sin(targetAngle) * force
        });
      }
    }
    document.addEventListener('keypress', this.moveShip)
  }
}
class Asteroid {
  constructor(posX, posY, sides, radius) {
    return Bodies.polygon(posX, posY, sides, radius)
  }
}

var instantiateBodies = () => { // only starting ship for now
  var initBodies = [];
  initBodies.push(new Ship(400, 300, 3, 20))
  return initBodies;
}
// add all of the bodies to the world
Composite.add(engine.world, instantiateBodies());

// run the renderer
Render.run(render);

// create runner
var runner = Runner.create();

// run the engine
Runner.run(runner, engine);

