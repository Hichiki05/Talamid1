document.addEventListener('DOMContentLoaded', function() {

    const currentPath = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.sidebar .nav-item');

    navLinks.forEach(item => {
        const linkHref = item.getAttribute('href');
        
        if (linkHref) {
            const linkFileName = linkHref.split('/').pop();

            if (currentPath.includes(linkFileName) && linkFileName.length > 0) {
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

    const regularButtons = document.querySelectorAll(
        '.button-group .choice-button:not(.service-toggle)'
    );

    regularButtons.forEach(button => {
        button.addEventListener('click', function() {
            const groupContainer = button.closest('.button-group');
            if (groupContainer) {
                groupContainer.querySelectorAll('.choice-button:not(.service-toggle)').forEach(btn => {
                    btn.classList.remove('selected');
                });
                button.classList.add('selected');
                
                document.querySelectorAll('.service-dropdown-container').forEach(container => {
                    container.classList.remove('dropdown-open');
                    const otherToggle = container.querySelector('.service-toggle');
                    
                    if (otherToggle) {
                        otherToggle.classList.remove('selected');
                        otherToggle.textContent = otherToggle.dataset.baseValue || 'Sélectionner';
                    }
                });
            }
        });
    });

    const dropdownContainers = document.querySelectorAll('.service-dropdown-container');
    const serviceGroup = document.querySelector('.button-group[data-group="service"]');

    dropdownContainers.forEach(container => {
        const toggleButton = container.querySelector('.service-toggle');
        const subOptions = container.querySelector('.sub-options');

        if (toggleButton) {
            if (!toggleButton.dataset.baseValue) {
                toggleButton.dataset.baseValue = toggleButton.textContent;
            }

            toggleButton.addEventListener('click', function(e) {
                e.stopPropagation(); 
                
                dropdownContainers.forEach(otherContainer => {
                    if (otherContainer !== container) {
                        otherContainer.classList.remove('dropdown-open');
                    }
                });

                if (serviceGroup) {
                    serviceGroup.querySelectorAll('.choice-button:not(.service-toggle)').forEach(btn => {
                        btn.classList.remove('selected');
                    });
                }
                
                container.classList.toggle('dropdown-open');
            });
        }

        if (subOptions) {
            subOptions.querySelectorAll('.sub-option').forEach(subOption => {
                subOption.addEventListener('click', function() {
                    subOptions.querySelectorAll('.sub-option').forEach(opt => opt.classList.remove('selected'));
                    subOption.classList.add('selected');
                    
                    if (toggleButton) {
                        toggleButton.classList.add('selected');
                        toggleButton.textContent = subOption.textContent;
                    }

                    container.classList.remove('dropdown-open');
                });
            });
        }
    });

    document.addEventListener('click', function(e) {
        dropdownContainers.forEach(container => {
            if (!container.contains(e.target)) {
                container.classList.remove('dropdown-open');
            }
        });
    });

    const nextStepButton = document.getElementById('next-step-button');

    function validateStep1() {
        const requiredGroups = document.querySelectorAll('.button-group');
        let allGroupsValid = true;
        
        requiredGroups.forEach(group => {
            const hasSelection = group.querySelector('.choice-button.selected') || 
                                 group.querySelector('.sub-option.selected');

            if (!hasSelection) {
                group.classList.add('validation-error');
                allGroupsValid = false;
            } else {
                group.classList.remove('validation-error');
            }
        });

        return allGroupsValid;
    }


    if (nextStepButton) {
        nextStepButton.addEventListener('click', function(e) {
            e.preventDefault(); 
            
            if (validateStep1()) {
                window.location.href = '/html/exercices-page2.html'; 
            } else {
                alert("Veuillez sélectionner une option pour CHAQUE question (Niveau, Matière, Type de service) avant de continuer.");
                
                const firstError = document.querySelector('.validation-error');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        });
    }

    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const fileListContainer = document.getElementById('file-list');
    const browseBtn = document.querySelector('.browse-btn');

    if (dropZone && fileInput && fileListContainer) {

        if (browseBtn) {
            browseBtn.addEventListener('click', function() {
                fileInput.click();
            });
        }

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            handleFiles(files);
        }

        function handleFiles(files) {
            [...files].slice(0, 5).forEach(uploadFile); 
        }

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, preventDefaults, false);
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => dropZone.classList.add('dragover'), false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => dropZone.classList.remove('dragover'), false);
        });
        
        dropZone.addEventListener('drop', handleDrop, false);

        fileInput.addEventListener('change', function(e) {
            handleFiles(e.target.files);
        });

        let fileIdCounter = 3; 

        function uploadFile(file) {
            const fileId = fileIdCounter++;
            const fileSizeKB = (file.size / 1024).toFixed(0);
            const fileName = file.name;

            const fileItemHTML = `
                <div class="file-item uploading" data-file-id="${fileId}">
                    <div class="file-info">
                        <i class="fas fa-file-pdf"></i>
                        <span class="file-name">${fileName}</span>
                        <span class="file-size">0 KB of ${fileSizeKB} KB</span>
                    </div>
                    <div class="progress-bar-wrap">
                        <div class="progress-text">Uploading...</div>
                        <div class="progress-track">
                            <div class="progress-fill" style="width: 0%;"></div>
                        </div>
                    </div>
                    <i class="fas fa-times-circle remove-file"></i>
                </div>
            `;

            fileListContainer.insertAdjacentHTML('beforeend', fileItemHTML);
            const newFileItem = fileListContainer.querySelector(`[data-file-id="${fileId}"]`);
            const progressBar = newFileItem.querySelector('.progress-fill');
            const progressText = newFileItem.querySelector('.progress-text');
            const fileSizeSpan = newFileItem.querySelector('.file-size');

            let progress = 0;
            const uploadInterval = setInterval(() => {
                progress += 10;
                if (progress <= 100) {
                    progressBar.style.width = progress + '%';
                    fileSizeSpan.textContent = `${Math.min(progress, 100) / 100 * fileSizeKB} KB of ${fileSizeKB} KB`;
                }

                if (progress >= 100) {
                    clearInterval(uploadInterval);
                    newFileItem.classList.remove('uploading');
                    newFileItem.classList.add('completed');
                    progressBar.style.backgroundColor = '#4CAF50';
                    progressText.textContent = 'Completed';
                    progressText.classList.add('completed');
                    newFileItem.querySelector('.remove-file').className = 'fas fa-trash-alt remove-file';
                    fileSizeSpan.textContent = `${fileSizeKB} KB of ${fileSizeKB} KB`;
                }
            }, 300);
        }

        fileListContainer.addEventListener('click', function(e) {
            const removeBtn = e.target.closest('.remove-file');
            if (removeBtn) {
                const fileItem = removeBtn.closest('.file-item');
                if (fileItem) {
                    fileItem.remove();
                }
            }
        });
    }

});