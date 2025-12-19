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
        const setValidationStyle = (el, isValid) => { if (el) el.style.border = isValid ? "1px solid #e0e0e0" : "2px solid #ff4d4d"; };
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
            } else alert("Veuillez remplir correctement les informations de paiement.");
        });
    }

    if (closeModal && modal) closeModal.addEventListener('click', () => modal.style.display = 'none');
    if (modal) window.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });
    if (finalConfirm) {
        finalConfirm.addEventListener('click', () => {
            const modalContent = document.querySelector('.modal-content');
            const closeModalBtn = document.getElementById('close-modal');
            if (closeModalBtn) closeModalBtn.remove();
            modalContent.innerHTML = `
                <div class="success-icon-wrap" style="margin-top: 20px;"><img src="/data/checker.png" alt="Success" style="width: 100px; height: 100px;"></div>
                <h2 class="success-title" style="margin-top: 20px; color: #121A4B;">Commande Confirmée</h2>
                <p class="success-text" style="color: #666;">Votre exercice a été soumis avec succès.</p>
                <div class="modal-progress-container" style="height: 4px; background: #eee; border-radius: 10px; overflow: hidden; margin: 20px auto; width: 80%;">
                    <div class="progress-fill" id="success-bar" style="width: 0%; height: 100%; background: #22c55e; transition: width 5s linear;"></div>
                </div>`;
            modalContent.classList.add('success');
            setTimeout(() => { const bar = document.getElementById('success-bar'); if (bar) bar.style.width = '100%'; }, 100);
            setTimeout(() => { window.location.href = 'exercices.html'; }, 5000);
        });
    }

    const filterTabs = document.querySelectorAll('.filter-tab');
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const currentActive = document.querySelector('.filter-tab.active');
            if (currentActive) currentActive.classList.remove('active');
            this.classList.add('active');
        });
    });

    const videoCards = document.querySelectorAll('.video-card');
    videoCards.forEach(card => {
        card.addEventListener('click', (event) => {
            if (event.target.classList.contains('ignore-click')) return; 
            const url = card.getAttribute('data-video-url');
            const title = card.querySelector('h4').textContent;
            if (url) window.location.href = `${url}?title=${encodeURIComponent(title)}`;
        });
    });

    const relatedCards = document.querySelectorAll('.related-card');
    relatedCards.forEach(card => {
        card.style.cursor = "pointer";
        card.addEventListener('click', function() {
            const url = this.getAttribute('data-video-url');
            const title = this.querySelector('h4').textContent;
            const prof = this.querySelector('.related-prof span').textContent;
            const img = this.querySelector('.related-thumb img').getAttribute('src');
            window.location.href = `${url}?title=${encodeURIComponent(title)}&prof=${encodeURIComponent(prof)}&img=${encodeURIComponent(img)}`;
        });
    });

    const urlParams = new URLSearchParams(window.location.search);
    const vTitle = urlParams.get('title');
    const pName = urlParams.get('prof');
    const iSrc = urlParams.get('img');

    if (vTitle) {
        const tEl = document.querySelector('.video-title');
        if (tEl) { tEl.textContent = vTitle; document.title = vTitle; }
    }
    if (pName) {
        const pEl = document.querySelector('.author-text h3');
        if (pEl) pEl.textContent = pName;
    }
    if (iSrc) {
        const mImg = document.querySelector('.main-video-player img');
        if (mImg) mImg.src = iSrc;
    }

    const commentInput = document.getElementById('comment-input');
    const commentsSection = document.querySelector('.comments-section');
    if (commentInput && commentsSection) {
        commentInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && this.value.trim() !== "") {
                const commentText = this.value;
                const newComment = document.createElement('div');
                newComment.style.cssText = "display: flex; gap: 15px; margin-top: 20px; animation: fadeIn 0.3s;";
                newComment.innerHTML = `
                    <div class="user-initials" style="background:#eee; width:40px; height:40px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:bold;">UN</div>
                    <div>
                        <div style="font-weight:bold; font-size:0.9rem;">User Name <span style="font-weight:normal; color:#888; margin-left:10px;">À l'instant</span></div>
                        <p style="margin-top:5px; color:#444;">${commentText}</p>
                    </div>`;
                commentsSection.appendChild(newComment);
                this.value = "";
            }
        });
    }

    const likeBtn = document.querySelector('.btn-like');
    const dislikeBtn = document.querySelector('.btn-dislike');
    function toggleIcon(btn, isActive) {
        const icon = btn.querySelector('i');
        if (isActive) { icon.classList.replace('far', 'fas'); } 
        else { icon.classList.replace('fas', 'far'); }
    }
    if (likeBtn && dislikeBtn) {
        likeBtn.addEventListener('click', function() {
            if (!this.classList.contains('active')) {
                dislikeBtn.classList.remove('active');
                toggleIcon(dislikeBtn, false);
            }
            this.classList.toggle('active');
            toggleIcon(this, this.classList.contains('active'));
        });
        dislikeBtn.addEventListener('click', function() {
            if (!this.classList.contains('active')) {
                likeBtn.classList.remove('active');
                toggleIcon(likeBtn, false);
            }
            this.classList.toggle('active');
            toggleIcon(this, this.classList.contains('active'));
        });
    }

    const playBtn = document.getElementById('play-pause-btn');
    const progressFilled = document.querySelector('.progress-filled');
    let isPlaying = false, progressVal = 0, videoInterval;
    if (playBtn) {
        playBtn.addEventListener('click', function() {
            const icon = this.querySelector('i');
            if (!isPlaying) {
                isPlaying = true;
                icon.classList.replace('fa-play', 'fa-pause');
                videoInterval = setInterval(() => {
                    if (progressVal < 100) {
                        progressVal += 0.5;
                        progressFilled.style.width = progressVal + "%";
                    } else {
                        clearInterval(videoInterval);
                        isPlaying = false;
                        icon.classList.replace('fa-pause', 'fa-play');
                    }
                }, 100);
            } else {
                isPlaying = false;
                icon.classList.replace('fa-pause', 'fa-play');
                clearInterval(videoInterval);
            }
        });
    }

    const homeCourseCards = document.querySelectorAll('.course-card');
    homeCourseCards.forEach(card => {
        card.style.cursor = "pointer";
        card.addEventListener('click', function() {
            const title = this.querySelector('.course-title').textContent;
            const prof = this.querySelector('.professor-name').textContent;
            const img = this.querySelector('.thumbnail-image').getAttribute('src');
            const destination = 'cours2.html';
            window.location.href = `${destination}?title=${encodeURIComponent(title)}&prof=${encodeURIComponent(prof)}&img=${encodeURIComponent(img)}`;
        });
    });
});