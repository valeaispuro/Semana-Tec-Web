// Variables for sharing
let sergio = 0;
let video;
let img1;
let canvas;
let titulo = "Busca una ciudad:\n (Ejemplo: 'Guadalajara')";
let airQuality;
let suggestions;
let aqi = 0;


const s = (sketch) => {
  
  sketch.setup = () => {
    canvas = sketch.createCanvas(500, 300);
    canvas.mouseClicked(sketch.miFuncion); 
  };

  sketch.draw = () => {
    let bgColor;
    if (aqi <= 50) {
      bgColor = sketch.color(0, 255, 0);
    } else if (aqi <= 100) {
      bgColor = sketch.color(255, 255, 0);
    } else {
      bgColor = sketch.color(255, 0, 0);
    }
    sketch.background(bgColor);
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
    const match = airQuality.match(/AQI: (\d+)/);
    aqi = match ? parseInt(match[1]) : 0;
  };
  
  sketch.mostrarConsejos = (sugerencias) => {
    suggestions = sugerencias;
  };
};


let myp5 = new p5(s, document.getElementById('p5'));
