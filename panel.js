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

// Create a slider and add it to the container
let slider = document.createElement('input');
slider.type = 'range';
slider.min = '0';
slider.max = '20';
slider.step = '0.1';
slider.value = '1.5';
slider.style.width = '100%';
slider.style.marginBottom = '10px';
container.appendChild(slider);

// Create a label for the slider and add it to the container
let sliderLabel = document.createElement('label');
sliderLabel.innerHTML = 'Force:';
sliderLabel.style.display = 'block';
sliderLabel.style.fontWeight = 'bold';
sliderLabel.style.marginBottom = '5px';
container.appendChild(sliderLabel);