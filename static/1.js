let highestZIndex = 10; // Inicia con el valor base más alto

document.addEventListener('DOMContentLoaded', function () {
    const dragItems = document.querySelectorAll('.drag-item , drag-container');
    let offsetX, offsetY;
    let isDragging = false;
    let activeItem = null;

    // Desactivar el enlace por defecto
    const links = document.querySelectorAll('.drag-link');
    links.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault(); // Prevenir que el enlace funcione en clics normales
        });

        link.addEventListener('dblclick', function () {
            // Solo permitir la navegación en doble clic
            window.location.href = this.href;
        });
    });

    // Configurar el arrastre de los elementos completos (imagen + título)
    dragItems.forEach(item => {
        item.addEventListener('mousedown', function (e) {
            isDragging = true;
            activeItem = item;

            // Calcular el offset relativo dentro del elemento
            offsetX = e.clientX - item.getBoundingClientRect().left;
            offsetY = e.clientY - item.getBoundingClientRect().top;

            // Aumentar el z-index para que esté sobre los demás
            highestZIndex++;
            item.style.zIndex = highestZIndex;
        });
    });

    document.addEventListener('mousemove', function (e) {
        if (isDragging && activeItem) {
            const newX = e.clientX - offsetX;
            const newY = e.clientY - offsetY;

            activeItem.style.left = newX + 'px';
            activeItem.style.top = newY + 'px';
        }
    });

    document.addEventListener('mouseup', function () {
        if (isDragging && activeItem) {
            isDragging = false;
            activeItem = null;
        }
    });

    /* Hamburguesa */
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    menuToggle.addEventListener('click', function () {
        mobileMenu.classList.toggle('active');
        menuToggle.classList.toggle('active'); // Rotación del ícono
    });

    /* POPUP */
    const popup = document.getElementById('popup');

    if (popup) {
        // Obtener el valor de data-mostrar-popup y convertirlo en booleano
        const mostrarPopup = popup.getAttribute('data-mostrar-popup') === "true";

        if (mostrarPopup) {
            popup.style.display = 'flex'; // Mostrar el popup
        }
    }

    // Configurar el carrusel
    const images = document.querySelectorAll('.carousel-image');
    let currentImageIndex = 0;

    // Función para mostrar la imagen activa
    function showImage(index) {
        images.forEach((img, i) => {
            img.classList.remove('active');
            if (i === index) {
                img.classList.add('active');
            }
        });
    }

    // Función para cambiar a la siguiente imagen
    document.getElementById('nextBtn').addEventListener('click', function() {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        showImage(currentImageIndex);
    });

    // Función para cambiar a la imagen anterior
    document.getElementById('prevBtn').addEventListener('click', function() {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        showImage(currentImageIndex);
    });

    // Cerrar el popup
    document.getElementById('acceptBtn').addEventListener('click', function() {
        popup.style.display = 'none'; // Ocultar el popup
    });


    /*--------------swipe del carrousel----------*/
    // Variables para el control del swipe
    let startX = 0;
    let endX = 0;

    // Detectar el inicio del toque
    document.querySelector('.carousel').addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
    });

    // Detectar el movimiento del toque
    document.querySelector('.carousel').addEventListener('touchmove', function(e) {
        endX = e.touches[0].clientX;
    });

    // Detectar cuando se suelta el toque y determinar la dirección del swipe
    document.querySelector('.carousel').addEventListener('touchend', function() {
        let diff = startX - endX;

        if (Math.abs(diff) > 50) { // Umbral mínimo para detectar un swipe
            if (diff > 0) {
                // Swipe hacia la izquierda → Siguiente imagen
                currentImageIndex = (currentImageIndex + 1) % images.length;
            } else {
                // Swipe hacia la derecha → Imagen anterior
                currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
            }
            showImage(currentImageIndex);
        }
    });


    /*----------------------ir arriba--------------------*/
    
    const scrollableDiv = document.querySelector(".scrollable-window");
    const scrollToTopBtn = document.getElementById("scrollToTopBtn");

    if (!scrollableDiv || !scrollToTopBtn) {
        console.error("No se encontraron los elementos scrollable-window o scrollToTopBtn");
        return;
    }

    scrollableDiv.addEventListener("scroll", function () {
        console.log("scrollTop actual:", scrollableDiv.scrollTop); // Verifica si se detecta el scroll

        if (scrollableDiv.scrollTop > 100) {
            console.log("Mostrando botón");
            scrollToTopBtn.style.display = "block";
        } else {
            console.log("Ocultando botón");
            scrollToTopBtn.style.display = "none";
        }
    });

    scrollToTopBtn.addEventListener("click", function () {
        console.log("Botón presionado, volviendo arriba");
        scrollableDiv.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
    
    
});


