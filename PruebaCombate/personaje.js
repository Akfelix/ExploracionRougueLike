var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var mapa = document.getElementById("mapa");
function generarMapa() {
    if (!mapa)
        return;
    mapa.innerHTML = ""; // limpiar por si acaso
    for (var i = 0; i < 126; i++) {
        var celda = document.createElement("div");
        celda.classList.add("cuadricula");
        celda.dataset.index = i.toString();
        mapa.appendChild(celda);
    }
}
generarMapa();
function mostrarEnPagina(id, texto) {
    var div = document.getElementById(id);
    if (div)
        div.innerHTML = texto;
}
function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
var personaje = /** @class */ (function () {
    function personaje(nombre, vida, fuerza, agilidad, suerte) {
        if (nombre === void 0) { nombre = "NoDefinidoAun"; }
        if (vida === void 0) { vida = 3; }
        if (fuerza === void 0) { fuerza = 3; }
        if (agilidad === void 0) { agilidad = 3; }
        if (suerte === void 0) { suerte = 3; }
        this.nombre = nombre;
        this.vida = vida;
        this.fuerza = fuerza;
        this.agilidad = agilidad;
        this.suerte = suerte;
    }
    personaje.prototype.mostrarStats = function (id) {
        mostrarEnPagina(id, "".concat(this.nombre, "<br>\n            Vida: ").concat(this.vida, "<br>\n            Fuerza: ").concat(this.fuerza, "<br>\n            Agilidad: ").concat(this.agilidad, "<br>\n            Suerte: ").concat(this.suerte));
    };
    return personaje;
}());
var Jugador = /** @class */ (function (_super) {
    __extends(Jugador, _super);
    function Jugador() {
        return _super.call(this, "Jugador", 10, 2, 2, 17) || this;
    }
    Jugador.prototype.subirNivel = function () {
        this.vida += 5;
        this.fuerza += 1;
        this.agilidad += 1;
    };
    return Jugador;
}(personaje));
var Enemigo = /** @class */ (function (_super) {
    __extends(Enemigo, _super);
    function Enemigo() {
        var vidaE1 = rand(4, 12);
        var fuerzaE1 = rand(4, 8);
        var agilidadE1 = rand(1, 5);
        var suerteE1 = rand(1, 3);
        return _super.call(this, "Goblin", vidaE1, fuerzaE1, agilidadE1, suerteE1) || this;
    }
    return Enemigo;
}(personaje));
var jugador1 = new Jugador();
jugador1.mostrarStats("stats-player");
var enemyBlock = document.getElementById("enemyBlock"); //busca el id que vamos a modificar/cambiar
var enemigos = [];
function generarEnemigos() {
    var numEnemigos = Math.floor(Math.random() * 6) + 1; // Número aleatorio de enemigos entre 1 y 6
    for (var i = 0; i < numEnemigos; i++) {
        var enemigo = new Enemigo();
        enemigo.nombre = "Goblin ".concat(i + 1);
        enemigos.push(enemigo);
        // Crear el div para este enemigo
        var enemyDiv = document.createElement("div");
        enemyDiv.id = "stats-enemy".concat(i + 1);
        enemyDiv.classList.add("stats-enemy");
        // Añadirlo al bloque principal
        enemyBlock === null || enemyBlock === void 0 ? void 0 : enemyBlock.appendChild(enemyDiv);
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
    var datos = localStorage.getItem("enemigos");
    if (!datos)
        return;
    var enemigosGuardados = JSON.parse(datos);
    enemigos = enemigosGuardados.map(function (e, i) {
        var enemigo = new Enemigo();
        enemigo.nombre = e.nombre;
        enemigo.vida = e.vida;
        enemigo.fuerza = e.fuerza;
        enemigo.agilidad = e.agilidad;
        enemigo.suerte = e.suerte;
        // Crear div y mostrar stats
        var div = document.createElement("div");
        div.id = "stats-enemy".concat(i + 1); // <-- usar i, no enemigos.length
        div.classList.add("stats-enemy");
        enemyBlock === null || enemyBlock === void 0 ? void 0 : enemyBlock.appendChild(div);
        enemigo.mostrarStats(div.id);
        return enemigo;
    });
}
function atacarEnemigos() {
    if (enemigos.length === 0) {
        return;
    }
    var indice = Math.floor(Math.random() * enemigos.length);
    var enemigoSeleccionado = enemigos[indice];
    console.log("Enemigo elegido:", enemigoSeleccionado.nombre);
    enemigoSeleccionado.vida -= 3; //daño que se hace, hay que hacer una formula basada en la fuerza del personaje y algo mas
    console.log("Y su vida ahora es de:", enemigoSeleccionado.vida);
    if (enemigoSeleccionado.vida <= 0) {
        console.log("Fue derrotado:", enemigoSeleccionado.nombre);
        // Opcional: eliminarlo del array
        enemigos.splice(indice, 1);
        actualizarNombres(); // si quieres renumerar enemigos
        guardarEnemigos();
    }
    guardarEnemigos();
    enemigoSeleccionado.mostrarStats("stats-enemy".concat(indice + 1));
    if (enemigos.length === 0) {
        var enemyBlock_1 = document.getElementById("enemyBlock");
        if (enemyBlock_1)
            enemyBlock_1.innerHTML = "<strong>¡Todos los enemigos han sido eliminados!</strong>";
    }
}
function actualizarNombres() {
    enemigos.forEach(function (enemigo, i) {
        //enemigo.nombre = `Goblin ${i + 1}`;
        enemigo.mostrarStats("stats-enemy".concat(i + 1));
        window.location.reload();
    });
}
// Flujo principal
if (localStorage.getItem("enemigos")) {
    cargarEnemigos();
}
else {
    generarEnemigos();
}
function borrarEncuentro() {
    localStorage.removeItem("enemigos");
}
