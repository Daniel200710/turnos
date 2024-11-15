let turnos = JSON.parse(localStorage.getItem("turnos")) || [];
let historial = JSON.parse(localStorage.getItem("historial")) || [];
let idCounter = turnos.length > 0 ? Math.max(...turnos.map(t => t.id)) + 1 : 1;

function solicitarTurno(tipo) {
    const turno = {
        id: idCounter++,
        tipo: tipo,
        estado: 'pendiente',
    };
    turnos.push(turno);
    localStorage.setItem("turnos", JSON.stringify(turnos));

    document.getElementById("mensaje").textContent = `Turno ${tipo} solicitado. ID: ${turno.id}. Pasar a caja 1`;
    actualizarLista();
}

function actualizarLista() {
    const listaCaja1 = document.getElementById("lista-turnos-caja1");
    const listaCaja2 = document.getElementById("lista-turnos-caja2");

    if (listaCaja1) {
        listaCaja1.innerHTML = '';
        turnos.forEach(turno => {
            if (turno.estado === 'pendiente') {
                const item = document.createElement("li");
                item.textContent = `Turno ${turno.tipo} - ID: ${turno.id}`;
                
                const btnAtender = document.createElement("button");
                btnAtender.textContent = "Atender";
                btnAtender.onclick = () => atenderTurno(turno.id, "Caja 1");

                const btnRechazar = document.createElement("button");
                btnRechazar.textContent = "Rechazar";
                btnRechazar.onclick = () => rechazarTurno(turno.id);

                item.appendChild(btnAtender);
                item.appendChild(btnRechazar);
                listaCaja1.appendChild(item);
            }
        });
    }

    if (listaCaja2) {
        listaCaja2.innerHTML = '';
        turnos.forEach(turno => {
            if (turno.estado === 'pendiente') {
                const item = document.createElement("li");
                item.textContent = `Turno ${turno.tipo} - ID: ${turno.id}`;

                const btnAtender = document.createElement("button");
                btnAtender.textContent = "Atender";
                btnAtender.onclick = () => atenderTurno(turno.id, "Caja 2");

                const btnRechazar = document.createElement("button");
                btnRechazar.textContent = "Rechazar";
                btnRechazar.onclick = () => rechazarTurno(turno.id);

                item.appendChild(btnAtender);
                item.appendChild(btnRechazar);
                listaCaja2.appendChild(item);
            }
        });
    }
}

function atenderTurno(id, caja) {
    const turno = turnos.find(t => t.id === id);
    if (turno) {
        turno.estado = 'atendido';
        localStorage.setItem("turnos", JSON.stringify(turnos));

        historial.push({ id: turno.id, tipo: turno.tipo, estado: turno.estado, caja: caja });
        localStorage.setItem("historial", JSON.stringify(historial));

        localStorage.setItem("turnoActual", JSON.stringify(turno));
        actualizarLista();

        if (caja === "Caja 1") {
            window.location.href = "boton.html";
        } else if (caja === "Caja 2") {
            window.location.href = "boton2.html";
        }
    }
}

function rechazarTurno(id) {
    const turno = turnos.find(t => t.id === id);
    if (turno) {
        turno.estado = 'rechazado';
        localStorage.setItem("turnos", JSON.stringify(turnos));

        historial.push({ id: turno.id, tipo: turno.tipo, estado: turno.estado, caja: "Rechazado" });
        localStorage.setItem("historial", JSON.stringify(historial));

        actualizarLista();
    }
}

function mostrarTurnoActual() {
    const turnoActual = JSON.parse(localStorage.getItem("turnoActual"));
    if (turnoActual) {
        document.getElementById("turno-actual").textContent = `Turno ${turnoActual.tipo} - ID: ${turnoActual.id} en atención en ${turnoActual.caja}`;
    } else {
        document.getElementById("turno-actual").textContent = "No hay turno en atención actualmente.";
    }
}

function resetearTurnos() {
    turnos = [];
    historial = [];
    idCounter = 1;

    localStorage.removeItem("turnos");
    localStorage.removeItem("turnoActual");
    localStorage.removeItem("historial");

    localStorage.setItem("turnos", JSON.stringify(turnos));
    actualizarLista();

    alert("Todos los turnos han sido reseteados.");
}

if (document.getElementById("lista-turnos-caja1") || document.getElementById("lista-turnos-caja2")) {
    actualizarLista();
}
