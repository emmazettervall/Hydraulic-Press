import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

function setupSimulation() {
  // Create a container for the slider and button elements
  const container = document.createElement("div");
  container.style.position = "absolute";
  container.style.bottom = "10px";
  container.style.left = "10px";
  container.style.width = "150px";
  container.style.padding = "10px";
  container.style.background = "#fff";
  container.style.border = "1px solid #ccc";
  document.body.appendChild(container);

  // button start
  let button = false;
  button = document.createElement("button");
  button.textContent = "SMASH IT!";
  button.style.top = "20px";
  button.style.left = "30%";
  document.body.appendChild(button);
  container.appendChild(button);

  // button stopp
  let button1 = false;
  button1 = document.createElement("button");
  button1.textContent = "STOP";
  button1.style.top = "20px";
  button1.style.right = "30%";
  document.body.appendChild(button1);
  container.appendChild(button1);

  // Create a label for the slider and add it to the container
  let sliderLabel_F = document.createElement("label");
  sliderLabel_F.innerHTML = "Force (N):";
  sliderLabel_F.style.display = "block";
  sliderLabel_F.style.fontWeight = "bold";
  sliderLabel_F.style.marginBottom = "5px";
  container.appendChild(sliderLabel_F);

  // Create a slider and add it to the container
  let slider_force = document.createElement("input");
  slider_force.type = "number";
  slider_force.min = "-20";
  slider_force.max = "20";
  slider_force.step = "0.1";
  slider_force.value = -0.3; //"1.5";
  slider_force.style.width = "100%";
  slider_force.style.marginBottom = "10px";
  container.appendChild(slider_force);

  // Create a label for the slider and add it to the container
  let sliderLabel_R = document.createElement("label");
  sliderLabel_R.innerHTML = "Radius (m):";
  sliderLabel_R.style.display = "block";
  sliderLabel_R.style.fontWeight = "bold";
  sliderLabel_R.style.marginBottom = "5px";
  container.appendChild(sliderLabel_R);

  // Create a slider and add it to the container
  let slider_radius = document.createElement("input");
  slider_radius.type = "number";
  slider_radius.min = "0";
  slider_radius.max = "5";
  slider_radius.step = "0.01";
  slider_radius.value = 0.03; //"0.8";
  slider_radius.style.width = "100%";
  slider_radius.style.marginBottom = "10px";
  container.appendChild(slider_radius);

  // Create a label for the slider and add it to the container
  let sliderLabel_h = document.createElement("label");
  sliderLabel_h.innerHTML = "Height (m):";
  sliderLabel_h.style.display = "block";
  sliderLabel_h.style.fontWeight = "bold";
  sliderLabel_h.style.marginBottom = "5px";
  container.appendChild(sliderLabel_h);

  // Create a slider and add it to the container Height
  let slider_h = document.createElement("input");
  slider_h.type = "number";
  slider_h.min = "0";
  slider_h.max = "0.14";
  slider_h.step = "0.01";
  slider_h.value = 0.1; //"2.5";
  slider_h.style.width = "100%";
  slider_h.style.marginBottom = "10px";
  container.appendChild(slider_h);

  // Define constants
  const m = 0.763; //2.53; // mass of the object in kSg
  const k = 3.57; //5.71; // spring constant in N/m
  const dt = 0.001; // time step in seconds
  const b = 3;
  let r = parseFloat(slider_radius.value);
  let h = parseFloat(slider_h.value);

  // Define initial values
  let yCan = h; //0; // initial position of the object in meters
  let vCan = 0; // initial velocity of the object in m/s
  let yPress = h; // initial position of the object in meters
  let vPress = 0; // initial velocity of the object in m/s

  // Create press
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load("rocky_texture.jpg");
  const material = new THREE.MeshPhongMaterial({
    map: texture,
    color: 0x555555,
  });
  const pressGeometry = new THREE.BoxGeometry(0.15, 0.05, 0.15); //(2, 0.5, 2);
  const press = new THREE.Mesh(pressGeometry, material);
  press.position.set(0, 0, 0);

  const pressStångGeometry = new THREE.CylinderGeometry(0.025, 0.025, 6);
  const stång = new THREE.Mesh(pressStångGeometry, material);
  stång.position.set(0, 3.025, 0);

  const group = new THREE.Object3D();
  group.add(stång);
  group.add(press);

  // Create table
  const tableGeometry = new THREE.BoxGeometry(0.25, 0.05, 0.25);
  const tableMaterial = new THREE.MeshPhongMaterial({ color: 0x8b4513 });
  const table = new THREE.Mesh(tableGeometry, material);
  table.position.y = -0.025;

  // Create scene and camera
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  scene.background = new THREE.Color(0xffffff);

  // Create point light source
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const spotLight = new THREE.PointLight(0xffffff, 0.8);
  spotLight.position.set(0, 20, 20);
  spotLight.castShadow = true;
  scene.add(spotLight);

  // Create renderer and add to page
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);

  camera.position.z = 0.5;
  camera.position.y = 0.2;
  camera.lookAt(table.position);

  scene.add(table);
  scene.add(group);

  // Instantiate a loader
  const loader = new GLTFLoader();

  let numModelsLoaded = 0;
  let loadedModel, loadedPress, bbox, abox, abs, loadedGarage, workBench;

  // Load the model of the garage
  loader.load(
    // resource URL
    "./glb_filer/garage.glb",
    // called when the resource is loaded
    function (gltf) {
      loadedGarage = gltf.scene;

      // Add the model to the scene
      loadedGarage = gltf.scene;
      loadedGarage.scale.set(0.75, 0.75, 0.75); // set scale to 5 times bigger
      loadedGarage.position.x = 1.25;
      loadedGarage.position.y = -0.82;
      loadedGarage.position.z = 1.2;
      scene.add(loadedGarage);

      // Increment the model counter
      numModelsLoaded++;

      // Call renderScene() if all the models have finished loading
      if (numModelsLoaded === 2) {
        renderScene();
      }
    }
  );

  // Load the model of the garage
  loader.load(
    // resource URL
    "./glb_filer/bench.glb",
    // called when the resource is loaded
    function (gltf) {
      // Add the model to the scene
      workBench = gltf.scene;
      workBench.scale.set(0.65, 0.8375, 0.65); // set scale to 5 times bigger
      workBench.position.x = 0;
      workBench.position.y = -0.809;
      workBench.position.z = 0;
      scene.add(workBench);

      // Increment the model counter
      numModelsLoaded++;

      // Call renderScene() if all the models have finished loading
      if (numModelsLoaded === 2) {
        renderScene();
      }
    }
  );

  // Load the first model - the can
  loader.load(
    // resource URL
    "can/simple_cola_can.glb",
    // called when the resource is loaded
    function (gltf) {
      // Manipulate the model
      bbox = new THREE.Box3().setFromObject(gltf.scene);
      gltf.scene.scale.set(
        r / bbox.max.x,
        h / (bbox.max.y - bbox.min.y),
        r / bbox.max.z
      );
      abox = new THREE.Box3().setFromObject(gltf.scene);
      abs = Math.abs(-abox.min.y - abox.max.y);
      gltf.scene.position.y = h / 2 + abs / 2;

      // Add the model to the scene
      loadedModel = gltf;
      scene.add(loadedModel.scene);

      renderScene();
    }
  );

  function renderScene() {
    renderer.render(scene, camera);

    animate();
  }

  let animationRunning = false; // boolean flag to check if the animation is running
  let scaleValue;
  // Add an event listener to the button to start the animation
  button.addEventListener("click", () => {
    animationRunning = true;
    scaleValue = loadedModel.scene.scale.y;
    // remove the button from the DOM
    button.remove();
    sliderLabel_F.remove();
    slider_force.remove();
    sliderLabel_R.remove();
    slider_radius.remove();
    sliderLabel_h.remove();
    slider_h.remove();
  });

  // Add an event listener to the button to stop the animation
  button1.addEventListener("click", () => {
    animationRunning = false;
  });

  let firstTime = false;
  let secondTime = false;
  let thirdTime = false;
  // Define function to update position of object
  function updatePositionPress() {
    if (secondTime != true) {
      // Read the value of the slider and use it as the force
      const F = parseFloat(slider_force.value);
      //const aPress = (F - k * yPress) / m;
      let FkP = k * (Math.abs(yPress) - h) * (yPress / Math.abs(yPress));
      let FbP = b * vPress;
      let aPress = (F - FkP - FbP) / m;
      vPress = vPress + aPress * dt;
      yPress = yPress + vPress * dt;

      group.position.y = yPress + 0.025; // move press down with can
    }

    if (vPress > 0 && thirdTime == false) {
      firstTime = true;
      //aPress = (F - k * yCan) / m;
      vPress = 0.17;
      yPress = yPress + vPress * dt;
      group.position.y = yPress + 0.025;

      if (group.position.y > 0.15) {
        thirdTime = true;
      }
    }

    if (vPress < 0 && firstTime == false) {
      updatePositionCan();
    }
    if (firstTime == true && vPress > 0) {
      secondTime = true;
    }

    // Define bounding boxes for the can, table, and press
    const tableBoundingBox = new THREE.Box3().setFromObject(table);
    const pressBoundingBox = new THREE.Box3().setFromObject(group);

    // Check for collisions with the press
    const pressCollision = tableBoundingBox.intersectsBox(pressBoundingBox);
    if (pressCollision) {
      // Reverse the velocity to bounce off the press
      vPress = -vPress;
    }
  }

  function updatePositionCan() {
    // Read the value of the slider and use it as the force
    const F = parseFloat(slider_force.value);

    //const aCan = (F - k * yCan) / m;

    const Fk = k * (Math.abs(yCan) - h) * (yCan / Math.abs(yCan));
    const Fb = b * vCan;
    const aCan = (F - Fk - Fb) / m;

    vCan = vCan + aCan * dt;
    yCan = yCan + vCan * dt;

    loadedModel.scene.position.setY(abs / 2 + yCan / 2); // h / 2 + abs / 2 - yCan / 2
    loadedModel.scene.scale.setY(scaleValue - scaleValue * ((h - yCan) / h)); //yCan) / h
  }

  // Define function to animate the scene
  function animate() {
    if (animationRunning) {
      // check if the animation is running
      updatePositionPress();
    } else {
      r = parseFloat(slider_radius.value);
      h = parseFloat(slider_h.value);
      yPress = h;
      yCan = h;
      loadedModel.scene.scale.set(
        r / bbox.max.x,
        h / (bbox.max.y - bbox.min.y),
        r / bbox.max.z
      );
      loadedModel.scene.position.y = h / 2 + abs / 2;
      group.position.y = h + 0.025; // move press down with can
    }

    controls.update();
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
}

// Call the function to set up the simulation
setupSimulation();
