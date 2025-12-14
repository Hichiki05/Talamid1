document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const navLinks = document.querySelectorAll('.sidebar .nav-item');

    // Toggle the menu when the hamburger icon is clicked
    menuToggle.addEventListener('click', function() {
        sidebar.classList.toggle('menu-open');
    });

    // Close the menu when any link is clicked (1C requirement)
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            sidebar.classList.remove('menu-open');
        });
    });
});