// Variables globales
let tiempo = 0;
let intervalo_tiempo = null;
let turno = null;
const posibilidades = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];
let registros = [];

// Función para limpiar localStorage
const limpiarLocalStorage = () => {
    localStorage.removeItem('jugador1');
    localStorage.removeItem('jugador2');
    localStorage.removeItem('registros');
};

// Función para formatear nombre
const formatearNombre = (nombre) => {
    nombre = nombre.trim().toLowerCase();
    return nombre.charAt(0).toUpperCase() + nombre.slice(1);
};

// Función para guardar jugador
const guardarJugador = (e) => {
    const txtJugador = e.target === btnSaveGamer1 ? jugador1 : jugador2;
    const otroJugador = e.target === btnSaveGamer1 ? jugador2 : jugador1;

    let nombreJugador = formatearNombre(txtJugador.value);
    let nombreOtroJugador = formatearNombre(otroJugador.value);

    txtJugador.classList.remove("error");

    if (nombreJugador === "") {
        txtJugador.classList.add("error");
        alert("El nombre del jugador no puede estar vacío.");
    } else if (nombreJugador === nombreOtroJugador) {
        txtJugador.classList.add("error");
        alert("Los nombres de los jugadores no pueden ser iguales.");
    } else {
        localStorage.setItem(txtJugador.id, nombreJugador);
        txtJugador.value = nombreJugador;
    }
};

// Función para asignar roles
const asignarRoles = (rol) => {
    setRol(rol === 1 ? 'X' : 'O', rol === 1 ? 'O' : 'X');
};

// Función para establecer roles
const setRol = (rol1, rol2) => {
    const jugador1 = document.getElementById('gamer1');
    const jugador2 = document.getElementById('gamer2');
    const rol_gamer1 = document.getElementById('rol_gamer1');
    const rol_gamer2 = document.getElementById('rol_gamer2');

    if (jugador1 && jugador2 && rol_gamer1 && rol_gamer2) {
        rol_gamer1.innerHTML = rol1;
        jugador1.classList.add(rol1 === 'X' ? 'rolx' : 'rolo');
        rol_gamer2.innerHTML = rol2;
        jugador2.classList.add(rol2 === 'X' ? 'rolx' : 'rolo');
    } else {
        console.error('Uno o más elementos no fueron encontrados en el DOM.');
    }
};

// Función para iniciar el juego
const inicio_juego = () => {
    const rol = aleatorio(2);
    asignarRoles(rol);
    asignar_turno(true);
    reiniciar_tiempo();

};

// Función para reiniciar el tiempo
const reiniciar_tiempo = () => {
    detener_tiempo();
    tiempo = 0;
    inicio_tiempo();
};


// Función para guardar el ganador
const guardar_ganador = () => {
    const ganador = {
        nombre: document.querySelector(".ganador input[type=text]").value,
        rol: document.querySelector(".ganador .rol").innerHTML,
        tiempo: tiempo
    };
    registros.push(ganador);
    fn_saveData(registros); // Asegúrate de tener esta función en funciones.js
};

// Función para iniciar el tiempo
const inicio_tiempo = () => {
    const timer = document.getElementById('timer');
    if (!timer) {
        console.error('Elemento con id "timer" no encontrado.');
        return;
    }

    if (intervalo_tiempo === null) {
        intervalo_tiempo = setInterval(() => {
            try {
                timer.innerHTML = fn_formatoHMS(tiempo);
                tiempo++;
            } catch (error) {
                console.error('Error al formatear el tiempo:', error);
                detener_tiempo();
            }
        }, 1000);
    }
};

// Función para detener el tiempo
const detener_tiempo = () => {
    if (intervalo_tiempo !== null) {
        clearInterval(intervalo_tiempo);
        intervalo_tiempo = null;
    }
};


// Función para validar jugada
const validar_jugada = () => {
    const zonas = document.querySelectorAll(".zona");

    for (const p of posibilidades) {
        if (zonas[p[0]].innerHTML !== "" &&
            zonas[p[1]].innerHTML !== "" &&
            zonas[p[2]].innerHTML !== "" &&
            zonas[p[0]].innerHTML === zonas[p[1]].innerHTML &&
            zonas[p[0]].innerHTML === zonas[p[2]].innerHTML) {
            zonas[p[0]].classList.add("jugada_ganadora");
            zonas[p[1]].classList.add("jugada_ganadora");
            zonas[p[2]].classList.add("jugada_ganadora");
            return 1;
        }
    }

    const z_jugadas = document.querySelectorAll(".jugado");
    if (z_jugadas.length === 9) {
        for (const zona of z_jugadas) {
            zona.classList.add("jugada_perdedora");
        }
        return 0;
    }

    return -1;
};

// Función para asignar turno
const asignar_turno = (b) => {
    turno = b;
    const turnoAnterior = document.querySelector(".activo");
    if (turnoAnterior) {
        turnoAnterior.classList.remove("activo");
    }
    if (b !== null) {
        const cnt = b ? document.querySelector(".rolx") : document.querySelector(".rolo");
        cnt.classList.add("activo");
    }
};

// Función para manejar el clic en una jugada
const click_jugada = (e) => {
    if (turno !== null && e.target.innerHTML === "") {
        e.target.innerHTML = turno ? "X" : "O";
        e.target.classList.add(turno ? "jugadox" : "jugadoo", "jugado");

        const gano = validar_jugada();
        if (gano === -1) {
            asignar_turno(!turno);
        } else if (gano === 1) {
            const ganador = document.querySelector(turno ? ".rolx" : ".rolo");
            ganador.classList.add("ganador");
            guardar_ganador();
            setTimeout(() => {
                const ng = document.querySelector(".ganador input[type=text]");
                alert(`Ganaste ${ng.value}!`);
                fin_juego();
            }, 3000);
        } else {
            setTimeout(() => {
                alert("No hay ganador!");
                fin_juego();
            }, 3000);
        }
    } else if (turno !== null) {
        alert("Ya fue jugado");
    } else {
        alert("No se ha iniciado el juego");
    }
};

// Función para finalizar el juego
const fin_juego = () => {
    detener_tiempo();
    document.getElementById('timer').innerHTML = "00:00:00";
    asignar_turno(null);
    document.querySelector(".rolx").classList.remove("rolx");
    document.querySelector(".rolo").classList.remove("rolo");
    document.getElementById('rol_gamer1').innerHTML = "";
    document.getElementById('rol_gamer2').innerHTML = "";
    document.getElementById('btnSaveGamer1').classList.remove("oculto");
    document.getElementById('btnSaveGamer2').classList.remove("oculto");
    document.getElementById('jugador1').readOnly = false;
    document.getElementById('jugador2').readOnly = false;
    document.getElementById('iniciar').classList.remove("oculto");
    document.getElementById('reiniciar').classList.add("oculto");
    const g = document.querySelector(".ganador");
    if (g) g.classList.remove("ganador");
    document.querySelectorAll(".zona").forEach(z => {
        z.classList.remove("jugado", "jugadox", "jugadoo", "jugada_ganadora", "jugada_perdedora");
        z.innerHTML = "";
    });
};

// Función para renderizar el score
const renderScore = (vr) => {
    let html = "<table><thead><tr><th>#</th><th>Nombre</th><th>Rol</th><th>Tiempo</th></tr></thead><tbody>";
    vr.forEach((jugador, i) => {
        html += `<tr><td>${i + 1}</td><td>${jugador.nombre}</td><td>${jugador.rol}</td><td>${fn_formatoHMS(jugador.tiempo)}</td></tr>`;
    });
    html += "</tbody></table>";
    document.getElementById('data').innerHTML = html;
};

// Inicialización al cargar la página
window.onload = function () {
    limpiarLocalStorage();
    registros = fn_loadData();

    // Inicialización de eventos
    document.getElementById('btnSaveGamer1').onclick = guardarJugador;
    document.getElementById('btnSaveGamer2').onclick = guardarJugador;

    document.getElementById('sortByTime').onchange = function (e) {
        if (e.target.checked) {
            const vr = ordenar_arreglo([...registros]);
            renderScore(vr);
        } else {
            renderScore(registros);
        }
    };

    document.getElementById('iniciar').onclick = function (e) {
        const jd1 = localStorage.getItem("jugador1");
        const jd2 = localStorage.getItem("jugador2");

        if (!jd1 || !jd2 || jd1.trim() === "" || jd2.trim() === "") {
            alert("Guarde los nombres de los jugadores. Ambos nombres no pueden estar vacíos.");
        } else {
            document.getElementById('btnSaveGamer1').classList.add("oculto");
            document.getElementById('btnSaveGamer2').classList.add("oculto");
            document.getElementById('jugador1').readOnly = true;
            document.getElementById('jugador2').readOnly = true;
            document.getElementById('iniciar').classList.add("oculto");
            document.getElementById('reiniciar').classList.remove("oculto");
            inicio_juego();
        }
    };

    document.getElementById('reiniciar').onclick = function (e) {
        fin_juego();
    };

    document.getElementById('resultado').onclick = function (e) {
        document.getElementById('sortByTime').checked = false;
        renderScore(registros);
        document.getElementById('tabla').classList.add("show");
    };

    document.getElementById('cerrar').onclick = function () {
        document.getElementById('tabla').classList.remove("show");
    };

    // Vaciamos los campos de texto
    document.getElementById('jugador1').value = "";
    document.getElementById('jugador2').value = "";

    document.querySelectorAll(".zona").forEach(z => z.onclick = click_jugada);
};