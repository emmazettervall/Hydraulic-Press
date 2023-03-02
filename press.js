import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';
//import './panel';

function setupSimulation() {

// Create a container for the slider and button elements
const container = document.createElement('div');
container.style.position = 'absolute';
container.style.bottom = '10px';
container.style.left = '10px';
container.style.width = '150px';
container.style.padding = '10px';
container.style.background = '#fff';
container.style.border = '1px solid #ccc';
document.body.appendChild(container);

  // button start
  let button=false;
  button=document.createElement('button');
  button.textContent='SMASH IT!';
  //button.style.position='absolute';
  button.style.top='20px';
  button.style.left='30%';
  document.body.appendChild(button);
  container.appendChild(button);

  // button stopp
  let button1=false;
  button1=document.createElement('button');
  button1.textContent='STOP';
  //button1.style.position='absolute';
  button1.style.top='20px';
  button1.style.right='30%';
  document.body.appendChild(button1);
  container.appendChild(button1);

// Create a slider and add it to the container
let slider_force = document.createElement('input');
slider_force.type = 'range';
slider_force.min = '0';
slider_force.max = '20';
slider_force.step = '0.1';
slider_force.value = '1.5';
slider_force.style.width = '100%';
slider_force.style.marginBottom = '10px';
container.appendChild(slider_force);

// Create a label for the slider and add it to the container
let sliderLabel_F = document.createElement('label');
sliderLabel_F.innerHTML = 'Force:';
sliderLabel_F.style.display = 'block';
sliderLabel_F.style.fontWeight = 'bold';
sliderLabel_F.style.marginBottom = '5px';
container.appendChild(sliderLabel_F);

// Create a slider and add it to the container
let slider_radius = document.createElement('input');
slider_radius.type = 'range';
slider_radius.min = '0';
slider_radius.max = '20';
slider_radius.step = '0.1';
slider_radius.value = '1.5';
slider_radius.style.width = '100%';
slider_radius.style.marginBottom = '10px';
container.appendChild(slider_radius);

// Create a label for the slider and add it to the container
let sliderLabel_R = document.createElement('label');
sliderLabel_R.innerHTML = 'Radius:';
sliderLabel_R.style.display = 'block';
sliderLabel_R.style.fontWeight = 'bold';
sliderLabel_R.style.marginBottom = '5px';
container.appendChild(sliderLabel_R);


  // Define constants
  const m = 2.53; // mass of the object in kg
  const k = 5.71; // spring constant in N/m
  const F = 2; // force applied by the press in N
  const dt = 0.01; // time step in seconds
  const r=0.4;
  const h=2.0;
  
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

   // Create point light source
   const light = new THREE.PointLight(0xffffff, 1, 100);
   light.position.set(1, 1, 3);
   scene.add(light);
 
   // Create renderer and add to page
   const renderer = new THREE.WebGLRenderer();
   renderer.setSize(window.innerWidth, window.innerHeight);
   document.body.appendChild(renderer.domElement);

   const controls = new OrbitControls(camera, renderer.domElement);
  //  controls.enableDamping = true;
  //  controls.dampingFactor = 0.5;

   camera.position.z = 5;
   camera.position.y = 2;
   camera.lookAt(table.position); 

  scene.add(table);
  scene.add(press);

// Instantiate a loader
const loader = new GLTFLoader();
let loadedModel, bbox, abox, abs;

// Load a glTF resource
loader.load(
  // resource URL
  'can/simple_cola_can.glb',
  // called when the resource is loaded
  function ( gltf ) {
    
    bbox = new THREE.Box3().setFromObject(gltf.scene);
    console.log("bbox, imprted model ",bbox);
    //console.log(bbox.max.x);
    
    gltf.scene.scale.set(r/bbox.max.x,h/(bbox.max.y-bbox.min.y),r/bbox.max.z);

    abox = new THREE.Box3().setFromObject(gltf.scene);
    abs=(Math.abs(-abox.min.y-abox.max.y));
    
    gltf.scene.position.y=((h/2)+abs/2);
    
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

  let animationRunning = false; // boolean flag to check if the animation is running
  let scaleValue;
  // Add an event listener to the button to start the animation
  button.addEventListener('click', () => {
    animationRunning = true;
    //loadedModel.scene.scale.setY(h/(1.6043490171432497+1.6552369594573977));
    
    console.log("h: ", h);
    console.log("yCan: ", yCan);
    console.log("Scale values: ", loadedModel.scene.scale.x, loadedModel.scene.scale.y, loadedModel.scene.scale.z);
    scaleValue=loadedModel.scene.scale.y;
    animate();
  });

  // Add an event listener to the button to stop the animation
  button1.addEventListener('click', () => {
    animationRunning = false;
  });


  let times=true;

  // Define function to update position of object
  function updatePositionPress() {

    // Read the value of the slider and use it as the force
    const F = parseFloat(slider_force.value);

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

    // Read the value of the slider and use it as the force
    const F = parseFloat(slider_force.value);
    
    const aCan = (F - k * yCan) / m;
    vCan = vCan + aCan * dt;
    yCan = yCan + vCan * dt;

    loadedModel.scene.position.setY((h/2)+abs/2 - yCan / 2);
    loadedModel.scene.scale.setY(scaleValue - scaleValue*(yCan / h));
  
    //loadedModel.scene.position.setY((h/2)+0.011708835726251698- (yCan /h) );
    //loadedModel.scene.scale.setY(h/(1.6043490171432497+1.6552369594573977)-(yCan/(h+1.6043490171432497+1.6552369594573977)));

    //gltf.scene.scale.set(r/0.9074379801750183,h/(1.6043490171432497+1.6552369594573977),r/0.9074379801750183);
    //gltf.scene.position.y=((h/2)+0.011708835726251698);
  }

  // Define function to animate the scene
  function animate() {
    if (animationRunning) { // check if the animation is running
      updatePositionPress();
      controls.update();
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }
  }
 
}

// Call the function to set up the simulation
setupSimulation();
