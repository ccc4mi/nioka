let highestZIndex = 10; // Inicia con el valor base más alto

document.addEventListener('DOMContentLoaded', function () {
    const dragItems = document.querySelectorAll('.drag-item','drag-container');
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
});

/* Hamburguesa */
document.addEventListener('DOMContentLoaded', function () {
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    menuToggle.addEventListener('click', function () {
        mobileMenu.classList.toggle('active');
        menuToggle.classList.toggle('active'); // Rotación del ícono
    });
});
