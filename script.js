const celdas = document.querySelectorAll(".grid-cell");
let cronometro = document.getElementById("cronometro");

/*CRONOMETRO*/

let started = false;
let startTime;
let intervalId;
let ganar = false;
let time = 0;

celdas.forEach(celda => {
  celda.addEventListener('click', () => {
    if (!started) {
      started = true;
      startTime = new Date().getTime();
      intervalId = setInterval(updateCronometro, 1000);
      cronometro.style.color = "red";
      setTimeout(() => {
        cronometro.style.color = "";
      }, 500);

    }
  });
});

function updateCronometro() {
  const currentTime = new Date().getTime();
  const elapsedTime = new Date(currentTime - startTime);
  const minutes = elapsedTime.getUTCMinutes();
  const seconds = elapsedTime.getUTCSeconds();
  if (!ganar) {
    document.getElementById("cronometro").textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    time = cronometro.textContent;
  } else {
    cronometro.textContent = "¡COMPLETADO EN " + time + " !"
    cronometro.style.color = "yellow";
    cronometro.style.textShadow = "1px 1px 2px #00000010"
  }
}

/*HOVER A LA CELDA*/

celdas.forEach((celda) => {
  celda.addEventListener("mouseover", () => {
    if(celda.textContent == " "){
    //celda.style.backgroundColor = "#fdff8a";
    celda.style.boxShadow  = "inset 0 0 0 1000px #fdff8a70";
  }
  });
  celda.addEventListener("mouseout", () => {
    //celda.style.backgroundColor = "";
    celda.style.boxShadow  = "";
  });
});

/*JUEGO DE MEMORIA*/

const valores = Array.from({ length: 32 }, (_, index) => Math.floor(index / 2) + 1);
let primeraCelda = null;
let segundaCelda = null;
let bloqueo = false;
let parejasEncontradas = 0;

function barajarArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

barajarArray(valores);

celdas.forEach((celda, index) => {
  celda.dataset.value = valores[index];
  celda.textContent = " ";

  celda.addEventListener("click", () => {
    if(!celda.classList.contains("correcto")){
    if (bloqueo || celda === primeraCelda || celda === segundaCelda) return;
    flip(celda,1);

    setTimeout(() => {
      celda.textContent = celda.dataset.value;
  }, 200);
    

    if (!primeraCelda) {
      primeraCelda = celda;
    } else {
      segundaCelda = celda;
      bloqueo = true;

      if (primeraCelda.dataset.value === segundaCelda.dataset.value) {
        setTimeout(() => {
          primeraCelda.removeEventListener("click", voltearCelda);
          segundaCelda.removeEventListener("click", voltearCelda);

          primeraCelda.classList.add("correcto");
          segundaCelda.classList.add("correcto");
          primeraCelda = null;
          segundaCelda = null;
          bloqueo = false;
          parejasEncontradas++;

          if (parejasEncontradas === valores.length / 2) {
            ganar = true;
          }
        }, 1000);
      } else {
        setTimeout(() => {
          flip(primeraCelda,0);
          flip(segundaCelda,0);
        setTimeout(() => {
          primeraCelda.textContent = " ";
          segundaCelda.textContent = " ";
          primeraCelda = null;
          segundaCelda = null;
          bloqueo = false;
        }, 200);
        }, 1000);
        
      }
    }
  }else{
    console.log("esa ya fue acertada");
  }
  });
});

function voltearCelda(event) {
  const celda = event.currentTarget;
  celda.textContent = celda.dataset.value;
}

function flip(celda, mov){
  celda.style.transition = "transform 0.3s ease-in-out";
    celda.style.transform = "rotateY(90deg)";
    setTimeout(() => {
        celda.style.transform = "rotateY(0deg)";
        if(mov ==1){
          celda.style.backgroundImage = "url('./carta 2.png')"
        }else{
          celda.style.backgroundImage = "url('./carta.png')"
        }
    }, 300);
}
