/* TODO on my version
======================
    - simplify saveToLocal function, a.k.a. the "save library to local storage" method
    - make new function that generate the div paletts for the Library instead of copy pasting code
 */

let swatches = document.querySelectorAll(".color");
let colorCode = document.querySelectorAll(".color h2");
let adjustBtn = document.querySelectorAll(".adjust");
let lockBtn = document.querySelectorAll(".lock");
let sliderPanels = document.querySelectorAll(".sliders");
let sliders = document.querySelectorAll(".sliders input");

let randomBtn = document.querySelector(".generateBtn");
let saveBtn = document.querySelector(".saveBtn");
let paletteName = document.querySelector(".palette-name");
let libraryBtn = document.querySelector(".libraryBtn");
let closeBtns = document.querySelectorAll(".closeBtn");
let yesBtn = document.querySelector(".yesBtn");
let noBtn = document.querySelector(".noBtn");

//popup selectors
let copyContainer = document.querySelector(".copy-container");
let copyPopup = document.querySelector(".copy-popup");
let saveContainer = document.querySelector(".save-container");
let savePopup = document.querySelector(".save-popup");
let libraryContainer = document.querySelector(".library-container");
let libraryPopup = document.querySelector(".library-popup");
let overwriteContainer = document.querySelector(".overwrite-container");
let overwritePopup = document.querySelector(".overwrite-popup");

// refferance variables
let libraryList = [];
let currentPalette = [];

// event listeners

randomBtn.addEventListener("click", random);

adjustBtn.forEach((button) => {
  button.addEventListener("click", (adjustBtn) => {
    let swatch = adjustBtn.target.getAttribute("data-index");

    if (sliderPanels[swatch].classList.contains("active")) {
      sliderPanels[swatch].classList.remove("active");
      swatches[swatch].classList.remove("active");
    } else{
      sliderPanels.forEach((e, index) => {
        e.classList.remove("active");
        swatches[index].classList.remove("active");
      });

      sliderPanels[swatch].classList.add("active");
      swatches[swatch].classList.add("active");
    }
  });
});

lockBtn.forEach((lock, index) => {
  lock.addEventListener("click", (button) => {
    lockColor(button, index);
  });
});

colorCode.forEach((colorCode) => {
  colorCode.addEventListener("click", (event) => {
    coppyHex(event);
  });
});

swatches.forEach((swatch) => {
  swatch.addEventListener("change", (e) => {
    let hexCode = e.target.querySelector("h4");
    let icons = e.target.querySelector("h4");
  });
});

sliders.forEach((swatchSliders) => {
  swatchSliders.addEventListener("change", adjustSwatch);
});

// popup events
closeBtns.forEach((btn) => {
  btn.addEventListener("click", closePopup);
});

saveBtn.addEventListener("click", savePalette);
libraryBtn.addEventListener("click", openLibrary);
// functions

function generateColor() {
  let randomColor = chroma.random();

  return randomColor;
}

function random() {
  swatches.forEach((swatch, index) => {
    let swatchSliders = swatch.querySelectorAll(`.sliders input`);

    let hue = swatchSliders[0];
    let luminance = swatchSliders[1];
    let saturation = swatchSliders[2];

    let color = generateColor();
    let hexCode = colorCode[index];

    slidersColorize(color, hue, luminance, saturation);

    if (!swatch.classList.contains("locked")) {
      swatch.style.backgroundColor = color;

      hexCode.innerText = chroma(color).hex();

      updateSliders(color, hue, luminance, saturation);
      updater(index);
      // currentPalette[index] = color;
    }
  });
}

function updater(index) {
  let currentSwatch = swatches[index];
  let color = currentSwatch.style.backgroundColor;
  let currentHex = currentSwatch.querySelector("h2");

  colorCode[index].innerText = chroma(color).hex();

  currentPalette[index] = color;

  contrast(color, currentHex);
  contrast(color, lockBtn[index]);
  contrast(color, adjustBtn[index]);
}

function contrast(color, text) {
  let luminance = chroma(color).get("hsl.l");

  if (luminance <= 0.5) {
    text.style.color = "white";
  } else{
    text.style.color = "black";
  }
}

function lockColor(button, index) {
  let icon = button.target.children[0];

  let currentSwatch = swatches[index];

  let currentSwatchSliders = currentSwatch.querySelectorAll(".sliders input");
  let hue = currentSwatchSliders[0];
  let saturation = currentSwatchSliders[2];
  let luminance = currentSwatchSliders[1];

  if (icon.classList.contains("fa-lock-open")) {
    icon.classList.remove("fa-lock-open");
    icon.classList.add("fa-lock");

    currentSwatch.classList.add("locked");

    hue.disabled = true;
    saturation.disabled = true;
    luminance.disabled = true;
  } else{
    icon.classList.remove("fa-lock");
    icon.classList.add("fa-lock-open");

    swatches[index].classList.remove("locked");

    hue.disabled = false;
    saturation.disabled = false;
    luminance.disabled = false;
  }
}

function slidersColorize(color, hue, luminance, saturation) {
  let colourDsaturated = chroma(color).set("hsl.s", 0);
  let colourSaturated = chroma(color).set("hsl.s", 1);

  hue.style.backgroundImage = `linear-gradient(to right, rgb(204,75,75),rgb(204,204,75),rgb(75,204,75),rgb(75,204,204),rgb(75,75,204),rgb(204,75,204),rgb(204,75,75))`;
  luminance.style.backgroundImage = `linear-gradient(to right, black,${color},white)`;
  saturation.style.backgroundImage = `linear-gradient(to right, ${colourDsaturated}, ${colourSaturated})`;
}

function updateSliders(color, hue, luminance, saturation) {
  
  let colorHue = chroma(color).get("hsl.h");
  let colorSat = chroma(color).get("hsl.s");
  let colorluminance = chroma(color).get("hsl.l");

  hue.value = colorHue;
  luminance.value = colorluminance;
  saturation.value = colorSat;
}

function adjustSwatch(e) {
  let index = e.target.getAttribute("data-index");
  let swatch = swatches[index];

  let currentSwatchSliders = swatch.querySelectorAll(".sliders input");
  let hue = currentSwatchSliders[0];
  let saturation = currentSwatchSliders[2];
  let luminance = currentSwatchSliders[1];

  let bgColor = currentPalette[index];

  let color = chroma(bgColor)
    .set("hsl.h", hue.value)
    .set("hsl.s", saturation.value)
    .set("hsl.l", luminance.value);

  swatch.style.backgroundColor = color;

  currentPalette[index] = chroma(color).hex();

  slidersColorize(color, hue, luminance, saturation);
  updater(index);
}

//popup functions
function closePopup(element) {
  let elemets = element.target.parentElement.parentElement;
  if (elemets.classList.contains("active")) {
    element.target.parentElement.classList.remove("active");
    element.target.parentElement.parentElement.classList.remove("active");
  }
}

function openLibrary() {
  if (libraryContainer.classList.contains("active")) {
    libraryContainer.classList.remove("active");
    libraryPopup.classList.remove("active");
  } else{
    libraryContainer.classList.add("active");
    libraryPopup.classList.add("active");
  }
}

function coppyHex(event) {
  let tempSelect = document.querySelector(".colors");
  let tempArea = document.createElement("textarea");

  tempSelect.appendChild(tempArea);
  tempArea.value = event.target.innerText;

  tempArea.select();
  tempArea.setSelectionRange(0, 99999); /*For mobile devices*/

  /* Copy the text inside the text field */
  document.execCommand("copy");

  tempArea.remove();

  copyContainer.classList.add("active");
  copyPopup.classList.add("active");

  copyContainer.addEventListener("transitionend", () => {
    copyContainer.classList.remove("active");
    copyPopup.classList.remove("active");
  });
}

function savePalette() {
  let name = paletteName.value;
  let color = [];
  let paletteNmbr = libraryList.length;
  let gettingLib = false;  
  let muitiplesExist = false;

  currentPalette.forEach((swatch) => {
    color.push(swatch);
  });

  //this code compairs names and finds the selected name

  if(libraryList.length > 0){
    for(let index = 0; index < paletteNmbr; index++){

      if (libraryList[index].name.includes(name) == true){          
        muitiplesExist = true;
        checking(libraryList[index]);
        break;

      } if(index == paletteNmbr - 1 && libraryList[index].name.includes(name) == false){
        checking();
      }
    }
  }
  
  if(libraryList.length == 0){
    checking ();
  }
    

  function checking (palette){

    if (muitiplesExist == true){
      
      yesBtn.addEventListener("click",(button) =>{
        let nmbr = palette.nmbr;
        // gets the coppie's object within the Library and changes the color array
        palette.color = color;
        // gets updated library and saves to local storage
        localStorage.setItem("palettes", JSON.stringify(libraryList));
        // updates library
        libraryList[nmbr].color.forEach((color,index) => {
          let libPalette = libraryPopup.querySelectorAll(".saved-palette");
          let swatches = libPalette[nmbr].querySelectorAll(".swatches");
          swatches[index].style.backgroundColor = color;
        });

        closePopup(button);
      });

      noBtn.addEventListener("click",(button) =>{
        closePopup(button);
      });
      
      overwriteContainer.classList.add("active");
      overwritePopup.classList.add("active");
      
    } else{
      let libraryObj = { name, color, nmbr: paletteNmbr };
      libraryList.push(libraryObj);
      
      savePopup.children[1].innerText = name;
      saveLocaly(libraryObj);
      createLibrary(paletteNmbr, gettingLib); 

      saveContainer.classList.add("active");
      savePopup.classList.add("active"); 
    }
  }
  // END OF NAME COMPAIR

}

function getLibrary() {
  let localPalettes;
  let gettingLib = true;

  if (localStorage.getItem("palettes") === null) {
    localPalettes = [];
  } else{
    localPalettes = JSON.parse(localStorage.getItem("palettes"));
  }
  libraryList = localPalettes;

  let index = libraryList.length;
  localStorage.setItem("palettes", JSON.stringify(localPalettes));
  createLibrary(index, gettingLib);
}

function saveLocaly(libraryObj) {
  let localPalettes;

  localPalettes = JSON.parse(localStorage.getItem("palettes"));
  localPalettes.push(libraryObj);
  let index = libraryObj.length;

  localStorage.setItem("palettes", JSON.stringify(localPalettes));
}

function createLibrary(index , gettingLib) {
  if(gettingLib == true){

    for (let i = 0; i < index; i++) {

      let objNmbr = libraryList[i].nmbr;
      let savedLibraryPalette = document.createElement("div");
      savedLibraryPalette.classList.add("saved-palette");
      savedLibraryPalette.setAttribute("data-index", objNmbr);

      let title = document.createElement("h3");
      title.innerText = libraryList[objNmbr].name;

      let preview = document.createElement("div");
      preview.classList.add("preview");

      libraryList[objNmbr].color.forEach((color) => {
        let swatch = document.createElement("div");
        swatch.classList.add("swatches");
        swatch.style.backgroundColor = color;
        preview.appendChild(swatch);
      });

      savedLibraryPalette.addEventListener("click",(element) =>{

        clickablePalettes(element);
        
        libraryContainer.classList.remove("active");
        libraryPopup.classList.remove("active");
      });
      
      savedLibraryPalette.appendChild(title);
      savedLibraryPalette.appendChild(preview);
      libraryPopup.appendChild(savedLibraryPalette);  
        
    }
  } else{

      let objNmbr = libraryList[index].nmbr;
      let savedLibraryPalette = document.createElement("div");
      savedLibraryPalette.classList.add("saved-palette");
      savedLibraryPalette.setAttribute("data-index", objNmbr);

      let title = document.createElement("h3");
      title.innerText = libraryList[objNmbr].name;

      let preview = document.createElement("div");
      preview.classList.add("preview");

      libraryList[objNmbr].color.forEach((color) => {
        let swatch = document.createElement("div");
        swatch.classList.add("swatches");
        swatch.style.backgroundColor = color;
        preview.appendChild(swatch);
      });

      savedLibraryPalette.addEventListener("click",(element) =>{

        clickablePalettes(element);
        
        libraryContainer.classList.remove("active");
        libraryPopup.classList.remove("active");
      });

      savedLibraryPalette.appendChild(title);
      savedLibraryPalette.appendChild(preview);
      libraryPopup.appendChild(savedLibraryPalette);
    }
}

function clickablePalettes(element){
  
  let index = element.target.getAttribute("data-index");
  let name = element.target.children[0].innerText;
  let replaceCurrentPalette = [];

  libraryList[index].color.forEach( (color,index) =>{
    let swatch = swatches[index];

    let swatchSliders = swatch.querySelectorAll(`.sliders input`);
    
    let hue = swatchSliders[0];
    let luminance = swatchSliders[1];
    let saturation = swatchSliders[2];

    replaceCurrentPalette.push(color);
    paletteName.value = name;
    swatches[index].style.backgroundColor = color;

    updateSliders(color, hue, luminance, saturation);
    slidersColorize(color, hue, luminance, saturation);
    updater(index);

  });

  currentPalette = replaceCurrentPalette;
  
}
getLibrary();
random();
