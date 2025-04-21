const widthSlider = document.getElementById('widthSlider') as HTMLInputElement;
const heightSlider = document.getElementById('heightSlider') as HTMLInputElement;
const orientationToggle = document.getElementById('orientationToggle') as HTMLButtonElement;
const documentEl = document.getElementById('document') as HTMLDivElement;

let isLandscape = false;

// Slider Steuerung
widthSlider.oninput = () => {
  documentEl.style.width = `${widthSlider.value}px`;
};

heightSlider.oninput = () => {
  documentEl.style.height = `${heightSlider.value}px`;
};

// Hoch-Querformat umschalten
orientationToggle.onclick = () => {
  isLandscape = !isLandscape;
  if (isLandscape) {
    documentEl.style.width = '1123px';
    documentEl.style.height = '794px';
    orientationToggle.textContent = 'Hochformat';
    widthSlider.value = '1123';
    heightSlider.value = '794';
  } else {
    documentEl.style.width = '794px';
    documentEl.style.height = '1123px';
    orientationToggle.textContent = 'Querformat';
    widthSlider.value = '794';
    heightSlider.value = '1123';
  }
};


