// Variables for sharing
let sergio = 0;
let video;
let img1;
let canvas;
let titulo = "Busca una ciudad:\n (Ejemplo: 'Guadalajara')";
let airQuality;
let suggestions;

// Create the sketch
const s = (sketch) => {
  
  sketch.setup = () => {
    canvas = sketch.createCanvas(800, 600);
    canvas.mouseClicked(sketch.miFuncion); 
  };

  sketch.draw = () => {
    sketch.background(203);
    sketch.text(titulo, 50, 50);
    sketch.text(airQuality, 50, 100);
    if (img1) {
      sketch.image(img1, 0, 0, sketch.width, sketch.height);
    }
  };

  sketch.miFuncion = () => {
    console.log("click");
    sketch.image(img1, 900, 900);
  };

  sketch.cambiar = (s) => {
    sergio = s;
  };

  sketch.cargar = (imagenURL) => {
    sketch.loadImage(imagenURL, (img) => {
      img1 = img;
    });
  };

  sketch.ponerTitulo = (texto) => {
    titulo = texto;
  };

  sketch.actualizarCalidadAire = (calidad) => {
    airQuality = calidad;
  };
  
  sketch.mostrarConsejos = (sugerencias) => {
    suggestions = sugerencias;
  };
};


let myp5 = new p5(s, document.getElementById('p5'));
