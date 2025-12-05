
const mapa = document.getElementById("mapa");

function generarMapa() {
    if (!mapa) return;

    mapa.innerHTML = ""; // limpiar por si acaso

    for (let i = 0; i < 126; i++) {
        const celda = document.createElement("div");
        celda.classList.add("cuadricula");
        celda.dataset.index = i.toString();
        mapa.appendChild(celda);
    }
}

generarMapa();

function mostrarEnPagina(id: string, texto: string) {
    const div = document.getElementById(id);
    if (div) div.innerHTML = texto;
}

function rand(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

class personaje{
    nombre:string;
    vida: number;
    fuerza:number;
    agilidad:number;
    suerte:number;

    constructor(nombre ="NoDefinidoAun", vida=3, fuerza=3,agilidad=3, suerte=3)
    {
        this.nombre=nombre;
        this.vida=vida;
        this.fuerza=fuerza;
        this.agilidad=agilidad;
        this.suerte=suerte;
    }
   
    mostrarStats(id: string) {
        mostrarEnPagina(id,
            `${this.nombre}<br>
            Vida: ${this.vida}<br>
            Fuerza: ${this.fuerza}<br>
            Agilidad: ${this.agilidad}<br>
            Suerte: ${this.suerte}`
        );
    }
}

class Jugador extends personaje {
  constructor() {
    super("Jugador", 10, 2, 2, 17);
  }

  subirNivel() {
    this.vida += 5;
    this.fuerza += 1;
    this.agilidad += 1;
  }
}

class Enemigo extends personaje {

  constructor() {
    const vidaE1 = rand(4, 12);
    const fuerzaE1 = rand(4, 8);
    const agilidadE1 = rand(1, 5);
    const suerteE1 = rand(1, 3);
    super("Goblin", vidaE1, fuerzaE1, agilidadE1, suerteE1);
  }
}

let jugador1 = new Jugador();
jugador1.mostrarStats("stats-player");
const enemyBlock = document.getElementById("enemyBlock");//busca el id que vamos a modificar/cambiar
 let enemigos: Enemigo[] = [];


function generarEnemigos(){

const numEnemigos = Math.floor(Math.random() * 6) + 1;// Número aleatorio de enemigos entre 1 y 6
  
  for (let i = 0; i < numEnemigos; i++) {
      const enemigo = new Enemigo();
      enemigo.nombre=`Goblin ${i+1}`;
      enemigos.push(enemigo);

      // Crear el div para este enemigo
      const enemyDiv = document.createElement("div");
      enemyDiv.id = `stats-enemy${i + 1}`;
      enemyDiv.classList.add("stats-enemy");

      // Añadirlo al bloque principal
      enemyBlock?.appendChild(enemyDiv);

      // Mostrar stats dentro del div recién creado
      enemigo.mostrarStats(enemyDiv.id);
  }
}

function guardarEnemigos() {
    // Convertimos el array de objetos a string JSON
    localStorage.setItem("enemigos", JSON.stringify(enemigos));
}

/*COMPROBAR Y ENTENDER COMO FUNCIONA EL SIGUIENTE CODIGO DE ABAJO*/ 
function cargarEnemigos() {
    const datos = localStorage.getItem("enemigos");
    if (!datos) return;

    const enemigosGuardados = JSON.parse(datos);

    enemigos = enemigosGuardados.map((e: any, i: number) => {
        const enemigo = new Enemigo();
        enemigo.nombre = e.nombre;
        enemigo.vida = e.vida;
        enemigo.fuerza = e.fuerza;
        enemigo.agilidad = e.agilidad;
        enemigo.suerte = e.suerte;

        // Crear div y mostrar stats
        const div = document.createElement("div");
      
        div.id = `stats-enemy${i + 1}`;  // <-- usar i, no enemigos.length
        div.classList.add("stats-enemy");
        enemyBlock?.appendChild(div);
        enemigo.mostrarStats(div.id);

        return enemigo;
    });
}

function atacarEnemigos(){
 if (enemigos.length === 0){return;}

  const indice = Math.floor(Math.random() * enemigos.length);
  const enemigoSeleccionado = enemigos[indice];
  console.log("Enemigo elegido:",enemigoSeleccionado.nombre);

  enemigoSeleccionado.vida -= 3; //daño que se hace, hay que hacer una formula basada en la fuerza del personaje y algo mas

  console.log("Y su vida ahora es de:",enemigoSeleccionado.vida);

  if (enemigoSeleccionado.vida <= 0) {
        console.log("Fue derrotado:", enemigoSeleccionado.nombre);
        // Opcional: eliminarlo del array
        enemigos.splice(indice, 1);
       actualizarNombres(); // si quieres renumerar enemigos
       guardarEnemigos()
    }
     guardarEnemigos();
    enemigoSeleccionado.mostrarStats(`stats-enemy${indice + 1}`);
  
  if (enemigos.length === 0) {
        const enemyBlock = document.getElementById("enemyBlock");
        if (enemyBlock) enemyBlock.innerHTML = "<strong>¡Todos los enemigos han sido eliminados!</strong>";
    }
}

function actualizarNombres() {
    enemigos.forEach((enemigo, i) => {
        //enemigo.nombre = `Goblin ${i + 1}`;
        enemigo.mostrarStats(`stats-enemy${i + 1}`);
        window.location.reload();
    });
}

// Flujo principal
if (localStorage.getItem("enemigos")) {
    cargarEnemigos();
} else {
      generarEnemigos();
    }

function borrarEncuentro(){  
localStorage.removeItem("enemigos");
}

