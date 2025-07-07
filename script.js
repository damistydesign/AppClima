// Obtenemos los elementos del DOM
const formulario = document.getElementById('formulario');
const inputCiudad = document.getElementById('inputCiudad');
const button = document.getElementById('btnBuscar');
const resultadosContainer = document.getElementById('resultados');
const errorMensaje = document.getElementById('error__msg');


// Ciudad [DOM]
const ciudadElemento = document.getElementById('ciudad');
// Temperatura [DOM]
const temperaturaElemento = document.getElementById('temperatura');
// Estado del Clima [DOM]
const estadoElemento = document.getElementById('estado');

// Escuchamos el evento click
button.addEventListener('click', (e) => {
    // Prevenimos su comportamiento por defecto (recargar)
    e.preventDefault()

    console.log('Me hiciste click!');
    
    // Sí el input está vacío, que muestre un mensaje de error
    if(inputCiudad.value == ''){
        errorMensaje.style.display = "block";
    }else{
        // En caso contrario, guardamos la ciudad actual en una variable, y le pasamos a la función
        // getDatosClima() la ciudad
        let ciudadActual = inputCiudad.value;
        console.log(ciudadActual);
        getDatosClima(ciudadActual);

        // Por las dudas de que esté mostrando el contenedor de error, lo quitamos
        errorMensaje.style.display = "none";
    }
})

async function getDatosClima(ciudad) {
  try {
    // Hacemos la petición a la API y le pasamos la ciudad que recibamos
    const respuesta = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=66b0eeb5c6c06c9cf1d864dc262bf0a5&units=metric&lang=es`);

    // En caso de obtener un error en la petición, que despliegue un mensaje
    if (!respuesta.ok) {
        throw new Error("No se pudo obtener la respuesta")
    };

    // Guardamos los datos en una variable 'datos' y lo convertimos a un formato JSON
    const datos = await respuesta.json();
    console.log(datos); 
    
    // Obtenemos la temperatura
    let temperaturaActual = Math.round(datos.main.temp) + '°C';
    console.log(temperaturaActual);

    // Obtenemos el estado del clima
    let estado = datos.weather[0].main;
    console.log(estado);

    // Obtenemos la ciudad actual
    let ciudadAct = datos.name;

    renderClima(temperaturaActual, estado, ciudadAct);

    // Por las dudas de que esté mostrando el contenedor de error, lo quitamos
    errorMensaje.style.display = "none";

    // Sí ocurre un error, mostramos en consola el error, y mostramos el div con el error
    } catch (error) {
        console.error("Ocurrió un error personalizado:", error.message);
        errorMensaje.style.display = "block";
  }
}

// Al cargar la página, recuperamos la última ciudad buscada
window.addEventListener('DOMContentLoaded', () => {
    const ciudadGuardada = JSON.parse(localStorage.getItem('ciudadStorage'));
    if (ciudadGuardada) {
        // Llenamos el input y mostramos automáticamente el clima de esa ciudad
        inputCiudad.value = ciudadGuardada;
        getDatosClima(ciudadGuardada);
    }
});


// Función para renderizar el clima
// obtenemos los párametros
function renderClima(temperatura, estado, ciudad){
    // Apuntamos cada variable con su párametro
    temperatura = temperatura;
    estado = estado;
    ciudad = ciudad;
    let icono;

    // Sí el estado coincide con alguno de ellos, le cambiamos a español su estado
    // le agregamos un icono, y una clase al body que tendrá de fondo un gif dependiendo
    // del estado
    if(estado === "Clear"){
        document.body.classList.toggle('soleado');
        estado = 'Despejado';
        icono = "☀️";
    }
    else if(estado === "Rain"){
        document.body.classList.toggle('lloviendo');
        estado = 'Lluvioso';
        icono = "🌧️";
    }
    else if(estado === "Clouds"){
        document.body.classList.toggle('nublado');
        estado = 'Nublado';
        icono = "☁️";
    }
    else if(estado === "Snow"){
        document.body.classList.toggle('nevando');
        estado = 'Nevando';
        icono = "🌨️";
    }else{
        console.log('ni idea pa del estado, ninguno coincide');
    }

    // Luego creamos de forma dinámica el resultado, añadiendole al HTML la ciudad, temperatura,
    // estado, icono
    resultadosContainer.innerHTML = `
            <div class="container__resultados ciudad__style">
                <p>Ciudad actual: <br><span id="ciudad">${ciudad}</span></p>
            </div>
            <div class="container__resultados temperatura__style">
                <p>Temperatura actual: <br><span id="temperatura">${temperatura}</span></p>
            </div>
            <div class="container__resultados estado__style">
                <p>Estado del clima: <br><span id="estado">${estado} ${icono}</span></p>
            </div>
    `;

    // Reseteamos el valor del input
    inputCiudad.value = "";
}