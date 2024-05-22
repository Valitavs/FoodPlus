/*Animacion de seccion comentario===============================================================================================*/

var counter = 1;
setInterval(function(){
    document.getElementById('radio' + counter).checked = true;
    counter++;
    if(counter > 4){
        counter = 1
    }
}, 5000);

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

/*Carrito=========================================================================================================================*/

const cartInfo= document.querySelector('.orden-comida')
const rowProduct =  document.querySelector('.ordenes-comida')

// Lista de todos los contenedores de productos
const productsList = document.querySelector('.container-comidastop')

// Variable de arreglos de productos
let allProducts = []

const valorTotal = document.querySelector('.precio')


productsList.addEventListener('click', e => {
    if(e.target.classList.contains('ordenar1')){
        const product = e.target.parentElement

        const infoProduct = {
            quantity: 1,
            title: product.querySelector('h1').textContent,
            img: product.querySelector('img').getAttribute('src'),
            price: product.querySelector('h4').textContent,
        }

        const exist = allProducts.some(product => product.title === infoProduct.title)

        if(exist){
            const products = allProducts.map(product => {
                if(product.title === infoProduct.title){
                    product.quantity++;
                    return product
                }else{
                    return product
                }
            })
            allProducts = [...products]
        }else{
            allProducts= [...allProducts, infoProduct];
        }

        

        showHtml();

    }

    
});

rowProduct.addEventListener('click', e => {
    if(e.target.classList.contains('x')){
        const product = e.target.parentElement
        const title = product.querySelector('h1').textContent

        allProducts = allProducts.filter(
            product => product.title !== title
        );

        showHtml()
    }
})

//Funcion para mostrar html
const showHtml = () => {

    
    //Limpiar Html
    rowProduct.innerHTML = '';

    let total = 0;

    allProducts.forEach(product =>{
        const containerProduct = document.createElement('div')
        containerProduct.classList.add('orden-comida')

        containerProduct.innerHTML = `
            <img class="pizza-carrito" src="${product.img}" alt="">
            <div>
                <div class="porciones">
                    <h1 class="nom-comida">${product.title}</h1>
                </div>
                <h6>Fast Food</h6>
                <h1 class="orden-precio">${product.price}</h1>
            </div>
            <h1 class="por">x${product.quantity}</h1>
            <img class="x" src="./imagenes/x.png" alt="">
            
        `;

        rowProduct.append(containerProduct);

        total = total + parseInt(product.quantity * product.price.slice(1))

    });

    valorTotal.innerText = `$${total}`;

};

//SEARCH

inputSearch = document.getElementById("inputSearch")
box_search = document.getElementById("box-search")

//Creando filtrado de busqueda

document.getElementById("inputSearch").addEventListener("keyup", buscador_interno);

function buscador_interno (){
    filter = inputSearch.value.toUpperCase();
    li = box_search.getElementsByTagName("li");

    //Recorriendo elementos a filtrar mediante los "li"
    for(i = 0; i < li.length; i++){
        a = li[i].getElementsByTagName("a")[0];
        textValue = a.textContent || a.innerText;

        if(textValue.toUpperCase().indexOf(filter) > -1){
            li[i].style.display = "";
            box_search.style.display = "block";

            if(inputSearch.value === ""){
                box_search.style.display = "none";
            }

        }else{
            li[i].style.display = "none";
        }
    }
}
