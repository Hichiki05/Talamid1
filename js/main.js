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
        menuToggle.addEventListener('click', () => sidebar.classList.toggle('menu-open'));
        navLinks.forEach(link => {
            link.addEventListener('click', () => sidebar.classList.remove('menu-open'));
        });
    }


    const regularButtons = document.querySelectorAll('.button-group .choice-button:not(.service-toggle)');

    regularButtons.forEach(button => {
        button.addEventListener('click', function() {
            const groupContainer = button.closest('.button-group');
            if (groupContainer) {
                groupContainer.querySelectorAll('.choice-button:not(.service-toggle)').forEach(btn => {
                    btn.classList.remove('selected');
                });
                button.classList.add('selected');
            }
        });
    });

    const dropdownContainers = document.querySelectorAll('.service-dropdown-container');
    dropdownContainers.forEach(container => {
        const toggleButton = container.querySelector('.service-toggle');
        const subOptions = container.querySelector('.sub-options');

        if (toggleButton) {
            if (!toggleButton.dataset.baseValue) {
                toggleButton.dataset.baseValue = toggleButton.textContent;
            }

            toggleButton.addEventListener('click', function(e) {
                e.stopPropagation(); 
                container.classList.toggle('dropdown-open');
            });
        }

        if (subOptions) {
            subOptions.querySelectorAll('.sub-option').forEach(subOption => {
                subOption.addEventListener('click', function() {
                    if (toggleButton) {
                        toggleButton.classList.add('selected');
                        toggleButton.textContent = subOption.textContent;
                    }
                    container.classList.remove('dropdown-open');
                });
            });
        }
    });

    /* --- 3. EXERCICES STEP 1: VALIDATION --- */
    const nextStepButton = document.getElementById('next-step-button');
    if (nextStepButton) {
        nextStepButton.addEventListener('click', (e) => {
            e.preventDefault();
            const requiredGroups = document.querySelectorAll('.button-group');
            let allGroupsValid = true;
            requiredGroups.forEach(group => {
                const hasSelection = group.querySelector('.selected');
                if (!hasSelection) {
                    group.style.border = "2px solid #ff4d4d";
                    allGroupsValid = false;
                } else {
                    group.style.border = "none";
                }
            });
            if (allGroupsValid) window.location.href = 'exercices-page2.html';
            else alert("Veuillez sélectionner une option pour chaque question.");
        });
    }

    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const fileListContainer = document.getElementById('file-list');
    const browseBtn = document.querySelector('.browse-btn');
    const nextStepPage2 = document.getElementById('next-step-page2');

    if (dropZone && fileInput && fileListContainer) {
        if (browseBtn) browseBtn.addEventListener('click', () => fileInput.click());

        const preventDefaults = (e) => { e.preventDefault(); e.stopPropagation(); };
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(evt => dropZone.addEventListener(evt, preventDefaults));

        fileInput.addEventListener('change', (e) => {
            [...e.target.files].slice(0, 5).forEach(uploadFile);
        });

        function uploadFile(file) {
            const fileId = Date.now();
            const fileSizeKB = (file.size / 1024).toFixed(0);
            const fileItemHTML = `
                <div class="file-item uploading" data-file-id="${fileId}">
                    <div class="file-info"><i class="fas fa-file-pdf"></i><span class="file-name">${file.name}</span><span class="file-size">0 KB of ${fileSizeKB} KB</span></div>
                    <div class="progress-bar-wrap"><div class="progress-track"><div class="progress-fill" style="width: 0%;"></div></div></div>
                    <i class="fas fa-times-circle remove-file"></i>
                </div>`;
            fileListContainer.insertAdjacentHTML('beforeend', fileItemHTML);
            const newFileItem = fileListContainer.querySelector(`[data-file-id="${fileId}"]`);
            const progressBar = newFileItem.querySelector('.progress-fill');
            let progress = 0;
            const uploadInterval = setInterval(() => {
                progress += 20;
                progressBar.style.width = progress + '%';
                if (progress >= 100) {
                    clearInterval(uploadInterval);
                    newFileItem.classList.replace('uploading', 'completed');
                    newFileItem.querySelector('.remove-file').className = 'fas fa-trash-alt remove-file';
                }
            }, 150);
        }

        fileListContainer.addEventListener('click', (e) => {
            const btn = e.target.closest('.remove-file');
            if (btn) btn.closest('.file-item').remove();
        });
    }

    if (nextStepPage2) {
        nextStepPage2.addEventListener('click', function(e) {
            const subject = document.getElementById('subject');
            const description = document.getElementById('description');
            const completedFiles = fileListContainer ? fileListContainer.querySelectorAll('.file-item.completed') : [];
            const setStyle = (el, valid) => el.style.border = valid ? "1px solid #e0e0e0" : "2px solid #ff4d4d";

            let valid = true;
            if (!subject || subject.value.trim() === "") { valid = false; setStyle(subject, false); } else setStyle(subject, true);
            if (!description || description.value.trim() === "") { valid = false; setStyle(description, false); } else setStyle(description, true);
            
            if (completedFiles.length === 0) {
                valid = false;
                if (dropZone) dropZone.style.border = "2px dashed #ff4d4d";
            } else {
                if (dropZone) dropZone.style.border = "2px dashed #ccc";
            }

            if (valid) window.location.href = 'exercices-page3.html';
            else alert("Veuillez remplir l'objet, la description et ajouter au moins un fichier.");
        });
    }

    
    const finishStepBtn = document.getElementById('finish-step');
    const modal = document.getElementById('confirmation-modal');
    const closeModal = document.getElementById('close-modal');
    const finalConfirm = document.getElementById('final-confirm-btn');

    if (finishStepBtn) {
        const cardNumInput = document.getElementById('card-number');
        const cardExpiryInput = document.getElementById('card-expiry');
        const cardCvcInput = document.getElementById('card-cvc');
        const countrySelect = document.getElementById('country-select');
        const cardPayRadio = document.getElementById('card-pay');
        const paymentBox = document.querySelector('.payment-method-selector');

        const setValidationStyle = (el, isValid) => {
            if (el) el.style.border = isValid ? "1px solid #e0e0e0" : "2px solid #ff4d4d";
        };

        
        if (cardNumInput) cardNumInput.addEventListener('input', (e) => e.target.value = e.target.value.replace(/\D/g, '').substring(0, 16));
        if (cardCvcInput) cardCvcInput.addEventListener('input', (e) => e.target.value = e.target.value.replace(/\D/g, '').substring(0, 3));
        if (cardExpiryInput) {
            cardExpiryInput.addEventListener('input', (e) => {
                let v = e.target.value.replace(/\D/g, '');
                if (v.length >= 2) v = v.substring(0, 2) + '/' + v.substring(2, 4);
                e.target.value = v.substring(0, 5);
            });
        }

        finishStepBtn.addEventListener('click', function(e) {
            let isValid = true;

           
            if (!cardPayRadio || !cardPayRadio.checked) {
                isValid = false;
                if (paymentBox) paymentBox.style.border = "2px solid #ff4d4d";
            } else if (paymentBox) paymentBox.style.border = "1px solid transparent";

            if (!cardNumInput || !/^\d{16}$/.test(cardNumInput.value)) { isValid = false; setValidationStyle(cardNumInput, false); } else setValidationStyle(cardNumInput, true);
            if (!cardExpiryInput || !/^\d{2}\/\d{2}$/.test(cardExpiryInput.value)) { isValid = false; setValidationStyle(cardExpiryInput, false); } else setValidationStyle(cardExpiryInput, true);
            if (!cardCvcInput || !/^\d{3}$/.test(cardCvcInput.value)) { isValid = false; setValidationStyle(cardCvcInput, false); } else setValidationStyle(cardCvcInput, true);
            if (!countrySelect || countrySelect.value === "") { isValid = false; setValidationStyle(countrySelect, false); } else setValidationStyle(countrySelect, true);

            if (isValid) {
                
                const totalPrice = document.querySelector('.total-price')?.textContent || "50.00 DH";
                const modalAmount = document.getElementById('modal-amount');
                if (modalAmount) modalAmount.textContent = totalPrice;
                
                if (modal) modal.style.display = 'flex';
            } else {
                alert("Veuillez remplir correctement les informations de paiement.");
            }
        });
    }

   
    if (closeModal && modal) {
        closeModal.addEventListener('click', () => modal.style.display = 'none');
    }

    if (modal) {
        window.addEventListener('click', (e) => {
            if (e.target === modal) modal.style.display = 'none';
        });
    }

  
if (finalConfirm) {
    finalConfirm.addEventListener('click', () => {
        const modalContent = document.querySelector('.modal-content');
        const closeModalBtn = document.getElementById('close-modal');
        
        
        if (closeModalBtn) closeModalBtn.remove();

        
        modalContent.innerHTML = `
            <div class="success-icon-wrap" style="margin-top: 20px;">
                <img src="/data/checker.png" alt="Success" style="width: 100px; height: 100px;">
            </div>
            <h2 class="success-title" style="margin-top: 20px; color: #121A4B;">Commande Confirmée</h2>
            <p class="success-text" style="color: #666;">Votre exercice a été soumis avec succès.</p>
            <div class="modal-progress-container" style="height: 4px; background: #eee; border-radius: 10px; overflow: hidden; margin: 20px auto; width: 80%;">
                <div class="progress-fill" id="success-bar" style="width: 0%; height: 100%; background: #22c55e; transition: width 5s linear;"></div>
            </div>
        `;

        modalContent.classList.add('success');

       
        setTimeout(() => {
            const bar = document.getElementById('success-bar');
            if (bar) bar.style.width = '100%';
        }, 100);

        
        setTimeout(() => {
            window.location.href = 'exercices.html'; 
        }, 5000);
    });
}
});