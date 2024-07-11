let alumnos = [];


fetch("../json/alumnos.json")
    .then(response => response.json())
    .then(data => {
        if (!localStorage.getItem("alumnos")) {
            alumnos = data;
            calcularPromedio(alumnos);
            localStorage.setItem("alumnos", JSON.stringify(alumnos));
        } else {
            alumnos = JSON.parse(localStorage.getItem("alumnos"));
        }
    });



//Funcion para agregar propiedad promedio al arreglo Materias del cada objeto del arreglo Alumnos
function calcularPromedio(alumnos) {
    //Primero accedemos a cada alumno dentro del array alumnos
    alumnos.forEach(alumno => {
        //accedemos al arreglo materias que esta dentro de cada alumno
        alumno.materias.forEach(materia => {
            materia.promedio = Number(((materia.nota1 + materia.nota2 + materia.nota3) / 3).toFixed(2));
        })
    })
}


//En esta seccion traemos los elementos del DOM


const seccionPrincipal = document.getElementById("seccion-principal");
const seccionListaAlumnos = document.querySelector('#seccion-lista-alumnos');
const contenedorListadoAlumnos = document.querySelector('#contenedor-listado-alumnos');
const seccionAlumnos = document.querySelector('#seccion-alumnos');
const contenedorAlumnos = document.getElementById("contenedor-alumnos");
const botonesMenu = document.querySelectorAll('.btn-menu');
const volverListado = document.getElementById("volver-listado");
const volverAlumnos = document.getElementById("volver-alumnos");
const volverRegistro = document.getElementById("volver-registro");
let botonesDarBaja = document.querySelectorAll(".buton-baja");
const seccionFormRegistro = document.querySelector("#div-form-registro");
const formRegistro = document.querySelector('#form-registro');



//Funciones GET y SET

let seccionPrincipalClase;
let seccionListaAlumnosClase;
let seccionAlumnosClase;
let seccionFormRegistroClase;
let seccionPrincialLS;
let seccionAlumnosLS;
let seccionFormRegistroLS;
let seccionListaAlumnosLS;


function setSeccion(nombreSeccionClase, ContenedorSeccion,keyName  ){
    //Esta variable va a contener un valor booleano
    nombreSeccionClase = ContenedorSeccion.classList.contains('disabled');
    localStorage.setItem(keyName, nombreSeccionClase);
}


function getSecciones() {
    seccionPrincialLS = localStorage.getItem('seccion-principal');
    seccionListaAlumnosLS = localStorage.getItem('seccion-lista-alumnos');
    seccionAlumnosLS = localStorage.getItem('seccion-alumnos');
    seccionFormRegistroLS = localStorage.getItem('seccion-form-registro');
}


//Seccion lista alumnos

function mostrarListaAlumnos(alumnos) {
    contenedorListadoAlumnos.innerHTML = '';
    alumnos.forEach((alumno)=>{
        const li = document.createElement('li');
        li.innerHTML = `${alumno.nombre}`;
        contenedorListadoAlumnos.append(li);
    })
    localStorage.setItem("alumnos", JSON.stringify(alumnos));
    setSeccion(seccionListaAlumnosClase, seccionListaAlumnos, 'seccion-lista-alumnos');
    setSeccion(seccionAlumnosClase, seccionAlumnos, 'seccion-alumnos');
    setSeccion(seccionFormRegistroClase, seccionFormRegistro, 'seccion-form-registro');
    setSeccion(seccionPrincipalClase, seccionPrincipal, 'seccion-principal');
    volverASeccionPrincial(volverListado);
}


//Seccion Alumnos Asignaturas

//Funcion para mostrar listado de alumnos en el DOM
function cargarAlumnosAsignaturas(alumnos) {
    console.log(alumnos);
    contenedorAlumnos.innerHTML = "";  
    //Accedemos al arreglo 
    alumnos.forEach(alumno => {
        const divAlumno = document.createElement("div");
        divAlumno.classList.add("alumno");
        divAlumno.innerHTML = `
        <h3>${alumno.nombre}</h3>
        `;
        const divMaterias = document.createElement("div");
        divMaterias.classList.add("materias");

        alumno.materias.forEach(materia => {
            const divMateria = document.createElement("div");
            divMateria.classList.add("materia");
            divMateria.innerHTML = `
                        <h3>Materia: ${materia.materia}</h3>
                        <p>Primer trimestre: ${materia.nota1}</p>
                        <p>Segundo trimestre: ${materia.nota2}</p>
                        <p>Tercer trimestre: ${materia.nota3}</p>
                        <p>Promedio general: ${materia.promedio}</p>
        `;
            divMaterias.appendChild(divMateria);
        })

        divAlumno.appendChild(divMaterias);

        const botonBaja = document.createElement("button");
        botonBaja.classList.add("buton-baja");
        botonBaja.setAttribute("id", `${alumno.id}`);
        botonBaja.textContent = "Dar de baja";

        divAlumno.appendChild(botonBaja);
        contenedorAlumnos.appendChild(divAlumno);

    })

    actualizarBotonesDarBaja();
    //Guardamos en el localStorage el arreglo alumnos al final de la funcion
    localStorage.setItem("alumnos", JSON.stringify(alumnos));
    setSeccion(seccionListaAlumnosClase, seccionListaAlumnos, 'seccion-lista-alumnos');
    setSeccion(seccionAlumnosClase, seccionAlumnos, 'seccion-alumnos');
    setSeccion(seccionFormRegistroClase, seccionFormRegistro, 'seccion-form-registro');
    setSeccion(seccionPrincipalClase, seccionPrincipal, 'seccion-principal');
    volverASeccionPrincial(volverAlumnos);
}



const actualizarBotonesDarBaja = () => {
    //hacemos esto porque los botones recien existen en el DOM cuando cargamos los alumnos
    botonesDarBaja = document.querySelectorAll(".buton-baja");

    //y los traemos para poder darles eventos
    //con un ForEach ponemos un escuchador para cada boton 
    botonesDarBaja.forEach(boton => {
        boton.addEventListener("click", darDeBajaAlumno);
    })
}



const darDeBajaAlumno = (e) => {
    //obetenemos el id del boton y lo parseamos porque nos devuelve un tipo de dato en forma de string
    const idBotonBaja = Number(e.currentTarget.id);
    const alumnoaEliminar = alumnos.find(alumno => alumno.id === idBotonBaja);
    Swal.fire({
        title: "Eliminar del listado",
        text:`¿Estas seguro que deseas dar de baja al alumno ${alumnoaEliminar.nombre}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "rgb(122, 3, 3)",
        cancelButtonColor: "orange",
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar",
        iconColor: "rgb(122, 3, 3)",
        color: "white",
        background: "rgb(7, 7, 41)",
    }).then((result) => {
        if (result.isConfirmed) {
            //obetenemos el index
        const index = alumnos.findIndex(alumno => alumno.id === idBotonBaja);
        //eliminamos el elemento de alumnos
        alumnos.splice(index, 1);
        console.log(alumnos);
        cargarAlumnosAsignaturas(alumnos);
        Toastify({
            text: "Alumno eliminado.",
            duration: 3000,
            gravity: "bottom",
            position: "right",
            style: {
                background: "rgb(122, 3, 3)",
                color: "orange"
            }
        }).showToast();
        }
    })
    
}




//Seccion Registro Alumno

const nombreAlumno = document.querySelector("#nombre-alumno");
const nota1M = document.querySelector("#primer-trimestreM");
const nota2M = document.querySelector("#segundo-trimestreM");
const nota3M = document.querySelector("#tercer-trimestreM");


const nota1L = document.querySelector("#primer-trimestreL");
const nota2L = document.querySelector("#segundo-trimestreL");
const nota3L = document.querySelector("#tercer-trimestreL");

const nota1C = document.querySelector("#primer-trimestreC");
const nota2C = document.querySelector("#segundo-trimestreC");
const nota3C = document.querySelector("#tercer-trimestreC");

const mostrarRegistoAlumno = () =>{
    seccionFormRegistro.classList.remove("disabled");
    seccionPrincipal.classList.add("disabled");
    setSeccion(seccionListaAlumnosClase, seccionListaAlumnos, 'seccion-lista-alumnos');
    setSeccion(seccionAlumnosClase, seccionAlumnos, 'seccion-alumnos');
    setSeccion(seccionFormRegistroClase, seccionFormRegistro, 'seccion-form-registro');
    setSeccion(seccionPrincipalClase, seccionPrincipal, 'seccion-principal');
    volverASeccionPrincial(volverRegistro);

}



//Funcion para agregar un alumno mas al array de alumnos. A traves del formulario de registro
const agregarAlumno = () =>{
    let idAlumnoNuevo;
    if (alumnos.length != 0) {
        console.log(alumnos);
        const lastAlumno = alumnos[alumnos.length - 1];
        idAlumnoNuevo = lastAlumno.id + 1;
        console.log(idAlumnoNuevo);
    } else {
        idAlumnoNuevo = 0;
    }
    

    class Materia{
        constructor (nombre, nota1, nota2, nota3) {
            this.materia = nombre,
            this.nota1 = nota1.value,
            this.nota2 = nota2.value,
            this.nota3 = nota3.value
        }
    }


    const materia1 = new Materia('Matematica', nota1M, nota2M, nota3M);
    const materia2 = new Materia('Lengua', nota1L, nota2L, nota3L);
    const materia3 = new Materia('Ciencias', nota1C, nota2C, nota3C);
    
    const materias = [
        materia1,
        materia2,
        materia3
    ];

    const alumno = {
        id: idAlumnoNuevo,
        nombre: nombreAlumno.value,
        materias: materias,
    };
    alumno.materias.forEach(materia => {
        materia.promedio = ((Number(materia.nota1) + Number(materia.nota2) + Number(materia.nota3))/3).toFixed(2);
    })
    console.log(alumno);
    alumnos.push(alumno);
    console.log(alumnos);
    localStorage.setItem("alumnos", JSON.stringify(alumnos));
    
}





//EVENTO:  enviar los valores del form registro y agregar el alumno al array alumnos

formRegistro.addEventListener("submit", (e) =>{
    e.preventDefault();
    agregarAlumno();
    Swal.fire({
        icon: "success",
        title: "Alumno registrado",
        text: "El alumno ha sido añadido al listado con éxito.",
        iconColor: "rgb(7, 7, 41)",
        color: "white",
        background: "orange",
        confirmButtonColor: "rgb(7, 7, 41)"
        
    })
    formRegistro.reset();
});

//EVENTOS: Botones del menu

botonesMenu.forEach((boton)=>{
    boton.addEventListener('click', (e)=>{
        if (e.currentTarget.id === 'listado-alumnos') {
            seccionPrincipal.classList.add('disabled');
            seccionListaAlumnos.classList.remove('disabled');
            verificarSiExisteLS();
            mostrarListaAlumnos(alumnos);
            

        } else if (e.currentTarget.id === 'alumnos-asignaturas') {
            console.log(e.currentTarget.id);
            seccionPrincipal.classList.add('disabled');
            seccionAlumnos.classList.remove('disabled');
            verificarSiExisteLS();
            cargarAlumnosAsignaturas(alumnos);

        }else if (e.currentTarget.id === 'registrar-alumno') {
            console.log(e.currentTarget.id);
            mostrarRegistoAlumno();

        }
    })
})




//Funcion para obetener los datos del LocalStorage

function getAlumnosStorage() {
    //los parseamos porque estaban en formaton JSON
    const alumnosLS = JSON.parse(localStorage.getItem("alumnos"));
    return alumnosLS
}


function verificarSiExisteLS(params) {
    const alumnosLs = getAlumnosStorage();
    //verificamos q dentro de alumnos storage haya algo y no este vacio
    if (alumnosLs) {
        //cargamos los datos de alumnosStorage dentro de alumnos
        alumnos = alumnosLs;
    }
}

function volverASeccionPrincial(botonVolver) {
    botonVolver.addEventListener('click', ()=>{
        seccionPrincipal.classList.remove('disabled');
        seccionListaAlumnos.classList.add('disabled');
        seccionAlumnos.classList.add('disabled');
        seccionFormRegistro.classList.add('disabled');
        setSeccion(seccionListaAlumnosClase, seccionListaAlumnos, 'seccion-lista-alumnos');
        setSeccion(seccionAlumnosClase, seccionAlumnos, 'seccion-alumnos');
        setSeccion(seccionFormRegistroClase, seccionFormRegistro, 'seccion-form-registro');
        setSeccion(seccionPrincipalClase, seccionPrincipal, 'seccion-principal');
    })
}

//EVENTO y FUNCION al recargar el DOM

function retomarSeccion() {
    getSecciones();
    if (seccionListaAlumnosLS === 'false') {
        seccionPrincipal.classList.add('disabled');
        seccionListaAlumnos.classList.remove('disabled');
        verificarSiExisteLS();
        mostrarListaAlumnos(alumnos);
    }else if (seccionAlumnosLS === 'false') {
        seccionPrincipal.classList.add('disabled');
        seccionAlumnos.classList.remove('disabled');
        verificarSiExisteLS();
        cargarAlumnosAsignaturas(alumnos);
    }else if (seccionFormRegistroLS === 'false') {
        seccionPrincipal.classList.add('disabled');
        seccionFormRegistro.classList.remove('disabled');
        verificarSiExisteLS();
        mostrarRegistoAlumno()
    }
}

document.addEventListener('DOMContentLoaded', retomarSeccion);