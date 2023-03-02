import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';


function setupSimulation() {


  // Define constants
  const m = 2.53; // mass of the object in kg
  const k = 5.71; // spring constant in N/m
  const F = 2; // force applied by the press in N
  const dt = 0.01; // time step in seconds
  const r=0.4;
  const h=1.5;
  
  // Define initial values
  let yCan = 0; // initial position of the object in meters
  let vCan = 0; // initial velocity of the object in m/s
  let yPress = 0; // initial position of the object in meters
  let vPress = 0; // initial velocity of the object in m/s

 
  
  // Create table
  const tableGeometry = new THREE.BoxGeometry(4, 0.1, 4);
  const tableMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
  const table = new THREE.Mesh(tableGeometry, tableMaterial);
  table.position.y = -0.05;

  // Create object to be pressed (a can)
  const geometry = new THREE.CylinderGeometry(r, r, h, 32, 1, false); // Set the last argument to true to cap the bottom
  const material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
  const can = new THREE.Mesh(geometry, material);
  can.position.y = h/2; // Raise the can so that it sits on the table
  can.position.x=1;

  // Create press
  const pressGeometry = new THREE.BoxGeometry(2, 0.5, 2);
  const pressMaterial = new THREE.MeshPhongMaterial({ color: 0x87CEFA });
  const press = new THREE.Mesh(pressGeometry, pressMaterial);
  press.position.y = h+0.25; // position press above can
 

  
  // Create scene and camera
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;
  camera.position.y = 2;
  camera.lookAt(table.position);
   // Create point light source
   const light = new THREE.PointLight(0xffffff, 1, 100);
   light.position.set(1, 1, 3);
   scene.add(light);
 
   // Create renderer and add to page
   const renderer = new THREE.WebGLRenderer();
   renderer.setSize(window.innerWidth, window.innerHeight);
   document.body.appendChild(renderer.domElement);

  scene.add(table);
  scene.add(press);

// Instantiate a loader
const loader = new GLTFLoader();
let loadedModel;
// Load a glTF resource
loader.load(
  // resource URL
  'can/simple_cola_can.glb',
  // called when the resource is loaded
  function ( gltf ) {
    
    var bbox = new THREE.Box3().setFromObject(gltf.scene);
    console.log(bbox);
    
    gltf.scene.scale.set(r/0.9074379801750183,h/(1.6043490171432497+1.6552369594573977),r/0.9074379801750183);
    gltf.scene.position.y=((h/2)+0.011708835726251698);
    var abox = new THREE.Box3().setFromObject(gltf.scene);
    console.log(abox);
    loadedModel=gltf;

    scene.add( loadedModel.scene );

    
    // Call the renderScene function after the object is loaded
    renderScene();
  },
  // called while loading is progressing
  function ( xhr ) {
    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
  },
  // called when loading has errors
  function ( error ) {
    console.log( 'An error happened' );
  }
);

function renderScene() {
 
  renderer.render(scene, camera);
}

  
  
   
  // button start
  let button=false;
  button=document.createElement('button');
  button.textContent='KÖÖÖÖÖR';
  button.style.position='absolute';
  button.style.top='20px';
  button.style.left='30%';
  document.body.appendChild(button);

  // button stopp
  let button1=false;
  button1=document.createElement('button');
  button1.textContent='STOPP';
  button1.style.position='absolute';
  button1.style.top='20px';
  button1.style.right='30%';
  document.body.appendChild(button1);

  let animationRunning = false; // boolean flag to check if the animation is running
  
  // Add an event listener to the button to start the animation
  button.addEventListener('click', () => {
    animationRunning = true;
    
    animate();
  });

  // Add an event listener to the button to stop the animation
  button1.addEventListener('click', () => {
    animationRunning = false;
  });


  let times=true;

  // Define function to update position of object
  function updatePositionPress() {
    const aPress = (F - k * yPress) / m;
    vPress = vPress + aPress * dt;
    yPress = yPress + vPress * dt;
    
    press.position.y = h+0.25 - yPress; // move press down with can

    if(vPress<0){
      times=false;
    }

    if(vPress>0 && times==true){
      updatePositionCan();
    }

    // Define bounding boxes for the can, table, and press
    const tableBoundingBox = new THREE.Box3().setFromObject(table);
    const pressBoundingBox = new THREE.Box3().setFromObject(press);

    // Check for collisions with the press
    const pressCollision = tableBoundingBox.intersectsBox(pressBoundingBox);
    if (pressCollision) {
      // Move the can up to the surface of the press
      //y = pressBoundingBox.max.y - tableBoundingBox.min.y;
      // Reverse the velocity to bounce off the press
      vPress = -vPress;
    }
  }

  function updatePositionCan(){
    const aCan = (F - k * yCan) / m;
    vCan = vCan + aCan * dt;
    yCan = yCan + vCan * dt;

    loadedModel.scene.position.setY((h/2)+0.011708835726251698-yCan / 2);
    loadedModel.scene.scale.setY(1 - yCan /h);
  
  }

  // Define function to animate the scene
  function animate() {
    if (animationRunning) { // check if the animation is running
      updatePositionPress();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
  }
 
}

// Call the function to set up the simulation
setupSimulation();
