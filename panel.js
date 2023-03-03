export function setPanel(){
    
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
  
// Create a label for the slider and add it to the container
let sliderLabel_F = document.createElement('label');
sliderLabel_F.innerHTML = 'Force:';
sliderLabel_F.style.display = 'block';
sliderLabel_F.style.fontWeight = 'bold';
sliderLabel_F.style.marginBottom = '5px';
container.appendChild(sliderLabel_F);

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
let sliderLabel_R = document.createElement('label');
sliderLabel_R.innerHTML = 'Radius:';
sliderLabel_R.style.display = 'block';
sliderLabel_R.style.fontWeight = 'bold';
sliderLabel_R.style.marginBottom = '5px';
container.appendChild(sliderLabel_R);

// Create a slider and add it to the container
let slider_radius = document.createElement('input');
slider_radius.type = 'range';
slider_radius.min = '0';
slider_radius.max = '5';
slider_radius.step = '0.1';
slider_radius.value = '0.8';
slider_radius.style.width = '100%';
slider_radius.style.marginBottom = '10px';
container.appendChild(slider_radius);
}