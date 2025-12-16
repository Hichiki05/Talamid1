document.addEventListener('DOMContentLoaded', function() {

    const currentPath = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.sidebar .nav-item');

    navLinks.forEach(item => {
        const linkHref = item.getAttribute('href');
        
        if (linkHref) {
            const linkFileName = linkHref.split('/').pop();

            if (currentPath === linkFileName) {
                navLinks.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
            }
        }
    });

    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('menu-open');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                sidebar.classList.remove('menu-open');
            });
        });
    }

    const regularButtons = document.querySelectorAll('.button-group:not(.service-type-section) .choice-button');

    regularButtons.forEach(button => {
        button.addEventListener('click', function() {
            const groupContainer = button.closest('.button-group');
            if (groupContainer) {
                groupContainer.querySelectorAll('.choice-button').forEach(btn => {
                    btn.classList.remove('selected');
                });
                button.classList.add('selected');
            }
        });
    });

    const dropdownContainers = document.querySelectorAll('.service-dropdown-container');
    const serviceGroup = document.querySelector('.button-group[data-group="service"]');

    dropdownContainers.forEach(container => {
        const toggleButton = container.querySelector('.service-toggle');
        const subOptions = container.querySelector('.sub-options');

        toggleButton.addEventListener('click', function(e) {
            e.stopPropagation(); 
            
            dropdownContainers.forEach(otherContainer => {
                if (otherContainer !== container) {
                    otherContainer.classList.remove('dropdown-open');
                    const otherToggle = otherContainer.querySelector('.service-toggle');
                    otherToggle.classList.remove('selected');
                    otherToggle.textContent = otherToggle.dataset.baseValue;
                }
            });

            serviceGroup.querySelectorAll('.choice-button:not(.service-toggle)').forEach(btn => {
                btn.classList.remove('selected');
            });
            
            container.classList.toggle('dropdown-open');
        });

        subOptions.querySelectorAll('.sub-option').forEach(subOption => {
            subOption.addEventListener('click', function() {
                subOptions.querySelectorAll('.sub-option').forEach(opt => opt.classList.remove('selected'));
                subOption.classList.add('selected');
                
                toggleButton.classList.add('selected');
                
                container.classList.remove('dropdown-open');
                
                toggleButton.textContent = subOption.textContent;
            });
        });
    });

    document.addEventListener('click', function(e) {
        dropdownContainers.forEach(container => {
            if (!container.contains(e.target)) {
                container.classList.remove('dropdown-open');
            }
        });
    });
});