
function cargarElemento(url, elemento){
    var request = new XMLHttpRequest();
    request.open("GET", url, false)
    request.send(null)
    elemento.innerHTML = request.responseText
}

function cargarPagina1(){
    cargarElemento("/Menu", document.getElementById("contenidodinamico"))
}


const targets = document.querySelectorAll('[data-target]')
const content = document.querySelectorAll('[data-content]')

targets.forEach(target => {
    target.addEventListener('click', () => {

        content.forEach(c => {
            c.classList.remove('active')
        })

        const t = document.querySelector(target.dataset.target)
        t.classList.add('active')
    })
})


/*Abrir overlay=======================================================================================================*/

const open = document.getElementById('open');
const modal_container = document.getElementById('modal_container');
const close = document.getElementById('close');

open.addEventListener('click', () => {
    modal_container.classList.add('show');
});

close.addEventListener('click', () => {
    modal_container.classList.remove('show');
});
