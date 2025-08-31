let interval = null;
let tiempoRestante = 0;
let activo = false;
let vueltas = [];

const btnStart = document.querySelector(".start-button")
const btnReset = document.querySelector(".reset-button")
const contador = document.querySelector(".contador")
const listaVueltas = document.getElementById("listaVueltas")

window.addEventListener("load", () => {
    const guardadas = localStorage.getItem("vueltas")
    if (guardadas) {
        vueltas = JSON.parse(guardadas);
        mostrarVueltas();
    }
});

btnStart.addEventListener("click", () => {
    if (!activo && tiempoRestante === 0) {
        let min = parseInt(document.getElementById("minutos").value) || 0
        let sec = parseInt(document.getElementById("segundos").value) || 0
        tiempoRestante = (min * 60) + sec
    }
    if (!activo) {
        iniciarContador();
        setTextos("Vuelta", "Parar")
        activo = true
    } else {
        marcarVuelta();
    }
});

btnReset.addEventListener("click", () => {
    if (activo) {
        clearInterval(interval)
        activo = false
        setTextos("Empezar", "Reiniciar");
    } else {
        clearInterval(interval)
        tiempoRestante = 0
        contador.textContent = "0:00"
        vueltas = [];
        renderVueltas();
        localStorage.removeItem("vueltas");
    }
});

function iniciarContador() {
    interval = setInterval(() => {
        let m = Math.floor(tiempoRestante / 60)
        let s = tiempoRestante % 60;
        if (s < 10) s = "0" + s;

        contador.textContent = `${m}:${s}`;

        if (tiempoRestante <= 0) {
            clearInterval(interval)
            activo = false;
            setTextos("Empezar", "Reiniciar")
            tiempoRestante = 0
        }
        tiempoRestante--;
    }, 1000);
}

function setTextos(txtStart, txtReset) {
    btnStart.textContent = txtStart;
    btnReset.textContent = txtReset;
}

function marcarVuelta() {
    let m = Math.floor(tiempoRestante / 60)
    let s = tiempoRestante % 60;
    if (s < 10) s = "0" + s;

    const vuelta = {
        numero: vueltas.length + 1,
        tiempo: `${m}:${s}`
    };

    vueltas.push(vuelta)
    saveVueltas()
    renderVueltas()
}

function renderVueltas() {
    listaVueltas.innerHTML = ""
    vueltas.forEach(v => {
        const li = document.createElement("li");
        li.textContent = `Vuelta ${v.numero}: ${v.tiempo}`;
        listaVueltas.appendChild(li);
    });
}

function saveVueltas() {
    localStorage.setItem("vueltas", JSON.stringify(vueltas))
}
