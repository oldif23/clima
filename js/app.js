const container = document.querySelector('.container');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');

window.addEventListener('load', () => {
    formulario.addEventListener('submit', buscarClima);
})



function buscarClima(e) {
    e.preventDefault();

    //Validar
    const ciudad = document.querySelector('#ciudad').value;
    const pais = document.querySelector('#pais').value;

    if (ciudad === '' || pais === '') {
        //hubo un error
        mostarError('Ambos campos son obligatorios');

        return;
    }
    //Consultar la APPI
    ConsultarAPI(ciudad, pais);
}

function mostarError(mensaje) {
    const alerta = document.querySelector('.bg-red-100');

    if (!alerta) {
        // Crear una alerta
        const alerta = document.createElement('div');

        alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded',
            'max-w-md', 'mx-auto', 'mt-6', 'text-center');

        alerta.innerHTML = `
        <strong class="font-bold">Error</strong>
        <span class="block">${mensaje}</span>      
        `;

        container.appendChild(alerta);

        //se elimine la alerta despues de 5 seg
        setTimeout(() => {
            alerta.remove();
        }, 5000);
    }
}

function ConsultarAPI(ciudad, pais) {

    const appId = 'ea2f80dfdb07de1bfd6d99a22631c1dc';

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`

    spinner(); //muesta un spinner de carga

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(datos => {

            console.log(datos);

            limpiarHTML(); //Limpiar  HTML previo

            if (datos.cod === "404") {
                mostarError('Ciudad no encontrada')
                return;
            }

            //Imprime la respuesta en el HTML
            mostrarClima(datos);
        })
}


function mostrarClima(datos) {
    const { name, main: { temp, temp_max, temp_min } } = datos;

    const centigrados = kevinACentigrados(temp);
    const Max = kevinACentigrados(temp_max);
    const Min = kevinACentigrados(temp_min);

    const nombreCiudad = document.createElement('p');
    nombreCiudad.textContent = `Clima en ${name}`;
    nombreCiudad.classList.add('font-bold', 'text-2xl');

    const actual = document.createElement('p');
    actual.innerHTML = `${centigrados} &#8451`;
    actual.classList.add('font-bold', 'text-6xl');

    const tempMaxima = document.createElement('p');
    tempMaxima.innerHTML = `Max: ${Max} &#8451`;
    tempMaxima.classList.add('text-xl');

    const tempMinima = document.createElement('p');
    tempMinima.innerHTML = `Min: ${Min} &#8451`;
    tempMinima.classList.add('text-xl');

    const resultadoDiv = document.createElement('div');
    resultadoDiv.classList.add('text-center', 'text-white');
    resultadoDiv.appendChild(actual);
    resultadoDiv.appendChild(nombreCiudad);
    resultadoDiv.appendChild(tempMaxima);
    resultadoDiv.appendChild(tempMinima);

    resultado.append(resultadoDiv);
}

const kevinACentigrados = grados => parseInt(grados - 273.15); //Funcion que hace una sola accion, funcion Helper


function limpiarHTML() {
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}

function spinner() {

    limpiarHTML();
    const divSpinner = document.createElement('div');
    divSpinner.classList.add('sk-fading-circle');

    divSpinner.innerHTML = `
  <div class="sk-circle1 sk-circle"></div>
  <div class="sk-circle2 sk-circle"></div>
  <div class="sk-circle3 sk-circle"></div>
  <div class="sk-circle4 sk-circle"></div>
  <div class="sk-circle5 sk-circle"></div>
  <div class="sk-circle6 sk-circle"></div>
  <div class="sk-circle7 sk-circle"></div>
  <div class="sk-circle8 sk-circle"></div>
  <div class="sk-circle9 sk-circle"></div>
  <div class="sk-circle10 sk-circle"></div>
  <div class="sk-circle11 sk-circle"></div>
  <div class="sk-circle12 sk-circle"></div>  
    `;
    resultado.appendChild(divSpinner);
}