let highestZIndex = 10; // Inicia con el valor base más alto

document.addEventListener('DOMContentLoaded', function () {
    const dragItems = document.querySelectorAll('.drag-item , .drag-container');
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

    /* ----------------------------------POPUP ----------------------------------------*/
    const popup = document.getElementById('popup');

    if (popup) {
        // Obtener el valor de data-mostrar-popup y convertirlo en booleano
        const mostrarPopup = popup.getAttribute('data-mostrar-popup') === "true";

        if (mostrarPopup) {
            popup.style.display = 'flex'; // Mostrar el popup
        }
    }

    // Configurar el carrusel
    const images = document.querySelectorAll('#popup .carousel-image');
    const acceptBtn = document.getElementById('acceptBtn');
    let currentImageIndex = 0;

    // Ocultar el botón de cerrar al inicio
    acceptBtn.style.display = 'none';

    // Función para mostrar la imagen activa
    function showImage(index) {
        images.forEach((img, i) => {
            img.classList.toggle('active', i === index);
        });

        // Mostrar el botón solo si es el último slide
        if (index === images.length - 1) {
            acceptBtn.style.display = 'block';
        } else {
            acceptBtn.style.display = 'none';
        }
    }

    // Función para cambiar a la siguiente imagen
    document.getElementById('nextBtn').addEventListener('click', function () {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        showImage(currentImageIndex);
    });

    // Función para cambiar a la imagen anterior
    document.getElementById('prevBtn').addEventListener('click', function () {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        showImage(currentImageIndex);
    });

    // Cerrar el popup
    acceptBtn.addEventListener('click', function () {
        popup.style.display = 'none'; // Ocultar el popup
        restartGif();
    });

    // Popup móvil
    const popupMobile = document.getElementById('popup-mobile');
    if (popupMobile) {
        // Mostrar popup si corresponde
        const mostrarPopupMobile = popupMobile.getAttribute('data-mostrar-popup') === "true";
        if (mostrarPopupMobile) {
            popupMobile.style.display = 'flex';
        }

        const mobileImages = popupMobile.querySelectorAll('.carousel-image');
        const dots = popupMobile.querySelectorAll('.dot');
        const acceptBtnMobile = document.getElementById('acceptBtnMobile');
        let currentMobileIndex = 0;

        // Ocultar el botón de cerrar al inicio
        acceptBtnMobile.style.display = 'none';

        // Función para actualizar la diapositiva y los puntitos
        function showMobileSlide(index) {
            if (index < 0 || index >= mobileImages.length) return;

            mobileImages.forEach((img, i) => {
                img.classList.toggle('active', i === index);
            });
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });

            currentMobileIndex = index;

            // Mostrar el botón solo si es el último slide
            if (index === mobileImages.length - 1) {
                acceptBtnMobile.style.display = 'block';
            } else {
                acceptBtnMobile.style.display = 'none';
            }
        }

        // Agregar evento de clic a cada dot
        dots.forEach(dot => {
            dot.addEventListener('click', function () {
                const index = parseInt(this.getAttribute('data-index'), 10);
                showMobileSlide(index);
            });
        });

        // Swipe para cambiar de diapositiva
        let startXMobile = 0;
        let endXMobile = 0;
        const carouselMobile = popupMobile.querySelector('.carousel');

        carouselMobile.addEventListener('touchstart', function (e) {
            startXMobile = e.touches[0].clientX;
        });

        carouselMobile.addEventListener('touchmove', function (e) {
            endXMobile = e.touches[0].clientX;
        });

        carouselMobile.addEventListener('touchend', function () {
            const diff = startXMobile - endXMobile;
            if (Math.abs(diff) > 50) { // Umbral para detectar swipe
                if (diff > 0) {
                    // Swipe izquierda: siguiente imagen
                    const nextIndex = (currentMobileIndex + 1) % mobileImages.length;
                    showMobileSlide(nextIndex);
                } else {
                    // Swipe derecha: imagen anterior
                    const prevIndex = (currentMobileIndex - 1 + mobileImages.length) % mobileImages.length;
                    showMobileSlide(prevIndex);
                }
            }
        });

        // Cerrar popup al hacer clic en el botón de aceptar
        acceptBtnMobile.addEventListener('click', function () {
            popupMobile.style.display = 'none';
            restartGif();
        });
    }

    /*---------------------------- Reiniciar GIF ------------------------*/
    function restartGif() {
        let gif = document.getElementById("gif");
        if (gif) {
            let src = gif.src.split("?")[0]; // Limpia cualquier parámetro viejo
            gif.src = src + "?t=" + new Date().getTime(); // Fuerza la recarga
        }
    }
    
    /* Reiniciar el GIF al cargar la página */
    window.onload = restartGif;
    
    /* Reiniciar el GIF al cerrar el popup */
    document.getElementById('acceptBtn').addEventListener('click', function () {
        document.getElementById('popup').style.display = 'none';
        restartGif();
    });
    
    /* Para la versión móvil */
    document.getElementById('acceptBtnMobile').addEventListener('click', function () {
        document.getElementById('popup-mobile').style.display = 'none';
        restartGif();
    });

});
