// ========== COMPLETE myscript.js ==========

document.addEventListener('DOMContentLoaded', function() {

    // ========== 1. LOAD SAVED COLORS FROM STORAGE ==========
    function loadSavedColors() {
        const savedMain = localStorage.getItem('savedMainColor');
        const savedAccent = localStorage.getItem('savedAccentColor');
        const savedFont = localStorage.getItem('savedFontColor');
        
        if (savedMain) {
            const mainPicker = document.getElementById('mainColor');
            if (mainPicker) mainPicker.value = savedMain;
            const mainPreview = document.getElementById('mainPreview');
            if (mainPreview) mainPreview.style.backgroundColor = savedMain;
            const mainHex = document.getElementById('mainHex');
            if (mainHex) mainHex.value = savedMain.toUpperCase();
        }
        
        if (savedAccent) {
            const accentPicker = document.getElementById('accentColor');
            if (accentPicker) accentPicker.value = savedAccent;
            const accentPreview = document.getElementById('accentPreview');
            if (accentPreview) accentPreview.style.backgroundColor = savedAccent;
            const accentHex = document.getElementById('accentHex');
            if (accentHex) accentHex.value = savedAccent.toUpperCase();
        }
        
        if (savedFont) {
            const fontPicker = document.getElementById('fontColor');
            if (fontPicker) fontPicker.value = savedFont;
            const fontPreview = document.getElementById('fontPreview');
            if (fontPreview) fontPreview.style.backgroundColor = savedFont;
            const fontHex = document.getElementById('fontHex');
            if (fontHex) fontHex.value = savedFont.toUpperCase();
        }
        
        return {
            main: savedMain || '#ffb6c1',
            accent: savedAccent || '#e5b3b6',
            font: savedFont || '#ffffff'
        };
    }
    
    let colors = loadSavedColors();
    
    // ========== 2. COUNTRIES DROPDOWN ==========
    fetch('https://restcountries.com/v3.1/all?fields=name')
        .then(response => response.json())
        .then(countries => {
            countries.sort((a, b) => a.name.common.localeCompare(b.name.common));
            
            const dropdown = document.getElementById('country');
            if (dropdown) {
                dropdown.innerHTML = '<option value="">Select your country</option>';
                
                countries.forEach(country => {
                    const option = document.createElement('option');
                    option.value = country.name.common;
                    option.textContent = country.name.common;
                    dropdown.appendChild(option);
                });
            }
        })
        .catch(error => {
            console.error('Error loading countries:', error);
            const dropdown = document.getElementById('country');
            if (dropdown) {
                dropdown.innerHTML = '<option value="">Failed to load countries</option>';
            }
        });
    
    // ========== 3. UPDATE PREVIEW CARD COLORS ==========
    function updatePreviewColors(mainColor, accentColor, fontColor) {
        const previewCard = document.getElementById('previewCard');
        if (previewCard) {
            previewCard.style.backgroundColor = mainColor;
            
            const infoBox = previewCard.querySelector('.profile-info');
            const badges = previewCard.querySelectorAll('.social-badge');
            const avatarPlaceholder = previewCard.querySelector('.avatar-placeholder');
            const interestsSection = previewCard.querySelector('.interests-section');
            
            if (infoBox) infoBox.style.backgroundColor = accentColor;
            if (interestsSection) interestsSection.style.backgroundColor = accentColor + '40';
            badges.forEach(b => b.style.backgroundColor = accentColor);
            if (avatarPlaceholder) avatarPlaceholder.style.borderColor = accentColor;
            
            const allText = previewCard.querySelectorAll('h3, .info-text, .interests-list li, .social-badge, .heart-message, .interests-title');
            allText.forEach(text => text.style.color = fontColor);
        }
    }
    
    // ========== 4. COLOR PICKERS ==========
    const mainColorPicker = document.getElementById('mainColor');
    const accentColorPicker = document.getElementById('accentColor');
    const fontColorPicker = document.getElementById('fontColor');
    
    const mainHex = document.getElementById('mainHex');
    const accentHex = document.getElementById('accentHex');
    const fontHex = document.getElementById('fontHex');
    
    if (mainColorPicker) {
        mainColorPicker.addEventListener('input', function(e) {
            colors.main = e.target.value;
            if (mainHex) mainHex.value = colors.main.toUpperCase();
            const preview = document.getElementById('mainPreview');
            if (preview) preview.style.backgroundColor = colors.main;
            updatePreviewColors(colors.main, colors.accent, colors.font);
            
            const realCard = document.querySelector('.profile-card:not(.preview-card)');
            if (realCard) realCard.style.backgroundColor = colors.main;
            
            localStorage.setItem('savedMainColor', colors.main);
        });
    }
    
    if (accentColorPicker) {
        accentColorPicker.addEventListener('input', function(e) {
            colors.accent = e.target.value;
            if (accentHex) accentHex.value = colors.accent.toUpperCase();
            const preview = document.getElementById('accentPreview');
            if (preview) preview.style.backgroundColor = colors.accent;
            updatePreviewColors(colors.main, colors.accent, colors.font);
            
            const realCard = document.querySelector('.profile-card:not(.preview-card)');
            if (realCard) {
                const infoBox = realCard.querySelector('.profile-info');
                const badges = realCard.querySelectorAll('.social-badge');
                const avatar = realCard.querySelector('.avatar-preview');
                const interestsSection = realCard.querySelector('.interests-section');
                if (infoBox) infoBox.style.backgroundColor = colors.accent;
                if (interestsSection) interestsSection.style.backgroundColor = colors.accent + '40';
                badges.forEach(b => b.style.backgroundColor = colors.accent);
                if (avatar) avatar.style.borderColor = colors.accent;
            }
            
            localStorage.setItem('savedAccentColor', colors.accent);
        });
    }
    
    if (fontColorPicker) {
        fontColorPicker.addEventListener('input', function(e) {
            colors.font = e.target.value;
            if (fontHex) fontHex.value = colors.font.toUpperCase();
            const preview = document.getElementById('fontPreview');
            if (preview) preview.style.backgroundColor = colors.font;
            updatePreviewColors(colors.main, colors.accent, colors.font);
            
            const realCard = document.querySelector('.profile-card:not(.preview-card)');
            if (realCard) {
                const allText = realCard.querySelectorAll('h3, .info-text, .interests-list li, .social-badge, .heart-message, .interests-title');
                allText.forEach(text => text.style.color = colors.font);
            }
            
            localStorage.setItem('savedFontColor', colors.font);
        });
    }
    
    // ========== 4a. HEX INPUT SYNC ==========
    if (mainHex) {
        mainHex.addEventListener('input', function(e) {
            let hex = e.target.value;
            if (!hex.startsWith('#')) hex = '#' + hex;
            if (/^#[0-9A-Fa-f]{6}$/i.test(hex)) {
                hex = hex.toUpperCase();
                if (mainColorPicker) mainColorPicker.value = hex;
                colors.main = hex;
                updatePreviewColors(colors.main, colors.accent, colors.font);
                localStorage.setItem('savedMainColor', hex);
                const preview = document.getElementById('mainPreview');
                if (preview) preview.style.backgroundColor = hex;
            }
        });
    }
    
    if (accentHex) {
        accentHex.addEventListener('input', function(e) {
            let hex = e.target.value;
            if (!hex.startsWith('#')) hex = '#' + hex;
            if (/^#[0-9A-Fa-f]{6}$/i.test(hex)) {
                hex = hex.toUpperCase();
                if (accentColorPicker) accentColorPicker.value = hex;
                colors.accent = hex;
                updatePreviewColors(colors.main, colors.accent, colors.font);
                localStorage.setItem('savedAccentColor', hex);
                const preview = document.getElementById('accentPreview');
                if (preview) preview.style.backgroundColor = hex;
            }
        });
    }
    
    if (fontHex) {
        fontHex.addEventListener('input', function(e) {
            let hex = e.target.value;
            if (!hex.startsWith('#')) hex = '#' + hex;
            if (/^#[0-9A-Fa-f]{6}$/i.test(hex)) {
                hex = hex.toUpperCase();
                if (fontColorPicker) fontColorPicker.value = hex;
                colors.font = hex;
                updatePreviewColors(colors.main, colors.accent, colors.font);
                localStorage.setItem('savedFontColor', hex);
                const preview = document.getElementById('fontPreview');
                if (preview) preview.style.backgroundColor = hex;
            }
        });
    }
    
    // Initial preview update
    updatePreviewColors(colors.main, colors.accent, colors.font);
    
    // ========== 5. SOCIAL MEDIA BUTTONS ==========
    const socialBtns = document.querySelectorAll('.social-btn');
    
    socialBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const social = this.getAttribute('data-social');
            const inputDiv = document.getElementById(`${social}-input`);
            
            document.querySelectorAll('.social-input').forEach(input => {
                if (input.id !== `${social}-input`) {
                    input.classList.add('hidden');
                }
            });
            
            if (inputDiv) {
                inputDiv.classList.toggle('hidden');
            }
        });
    });
    
    // ========== 6. SAVE SOCIAL MEDIA USERNAMES ==========
    const saveBtns = document.querySelectorAll('.save-social');
    
    saveBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const inputDiv = this.parentElement;
            const social = inputDiv.id.replace('-input', '');
            const usernameInput = inputDiv.querySelector('input');
            const username = usernameInput.value.trim();
            
            if (username) {
                let emoji = '';
                if (social === 'instagram') emoji = '[◉¯]';
                if (social === 'tiktok') emoji = '♫';
                if (social === 'twitter') emoji = '𓅆';
                if (social === 'discord') emoji = '🕹';
                
                const socialName = social.charAt(0).toUpperCase() + social.slice(1);
                
                const socialList = document.getElementById('social-list');
                if (socialList) {
                    const existing = document.querySelector(`.saved-item[data-social="${social}"]`);
                    if (existing) {
                        existing.querySelector('.username').textContent = `@${username}`;
                    } else {
                        const newItem = document.createElement('div');
                        newItem.className = 'saved-item';
                        newItem.setAttribute('data-social', social);
                        newItem.innerHTML = `
                            <span>${emoji} ${socialName}: <span class="username">@${username}</span></span>
                            <button class="remove-social">X</button>
                        `;
                        socialList.appendChild(newItem);
                        
                        newItem.querySelector('.remove-social').addEventListener('click', function(e) {
                            e.stopPropagation();
                            newItem.remove();
                        });
                    }
                }
                
                usernameInput.value = '';
                inputDiv.classList.add('hidden');
            }
        });
    });
    
    // ========== 7. AVATAR PICTURE HANDLER ==========
    const fileInput = document.getElementById('fileInput');
    const submitPicBtn = document.getElementById('submitBtn');
    window.selectedAvatar = null;
    
    if (fileInput) {
        fileInput.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const pictureBtn = document.querySelector('button[onclick*="fileInput"]');
                if (pictureBtn) {
                    const originalText = pictureBtn.textContent;
                    pictureBtn.textContent = '✓ Picture selected!';
                    setTimeout(() => {
                        pictureBtn.textContent = originalText;
                    }, 1500);
                }
            }
        });
    }
    
    if (submitPicBtn) {
        submitPicBtn.addEventListener('click', function() {
            if (fileInput && fileInput.files && fileInput.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    window.selectedAvatar = e.target.result;
                    submitPicBtn.textContent = '✓ Avatar saved!';
                    setTimeout(() => {
                        submitPicBtn.textContent = 'Yup that\'s the pic!';
                    }, 1500);
                };
                reader.readAsDataURL(fileInput.files[0]);
            } else {
                alert('Please select a picture first!');
            }
        });
    }
    
    // ========== 8. CLICK OUTSIDE TO CLOSE SOCIAL INPUTS ==========
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.social-row')) {
            document.querySelectorAll('.social-input').forEach(input => {
                input.classList.add('hidden');
            });
        }
    });
    
    // ========== 9. ESCAPE HTML FUNCTION ==========
    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }
    
    // ========== 10. SAVE INFO BUTTON - CREATE PROFILE CARD ==========
    const doneBtn = document.getElementById('done-socials');
    
    if (doneBtn) {
        doneBtn.addEventListener('click', function() {
            let currentMainColor = colors.main;
            let currentAccentColor = colors.accent;
            let currentFontColor = colors.font;
            
            if (mainColorPicker) currentMainColor = mainColorPicker.value;
            if (accentColorPicker) currentAccentColor = accentColorPicker.value;
            if (fontColorPicker) currentFontColor = fontColorPicker.value;
            
            const name = document.getElementById('nameInput')?.value.trim() || 'Someone';
            const gender = document.getElementById('genderInput')?.value.trim() || '';
            const birthday = document.getElementById('birthday')?.value;
            const countrySelect = document.getElementById('country');
            let country = '';
            if (countrySelect && countrySelect.selectedIndex >= 0) {
                country = countrySelect.options[countrySelect.selectedIndex]?.text || '';
            }
            const interests = document.getElementById('interestsInput')?.value || '';
            
            let birthdayDisplay = '';
            if (birthday) {
                const date = new Date(birthday);
                birthdayDisplay = date.toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                });
            }
            
            const allSocials = [];
            document.querySelectorAll('.saved-item').forEach(item => {
                const text = item.innerText.replace('X', '').trim();
                if (text) allSocials.push(text);
            });
            
            let infoHTML = '';
            if (gender) {
                infoHTML += `<div class="info-item"><span class="info-icon">.✦ ݁˖</span><span class="info-text" style="color: ${currentFontColor};">${escapeHtml(gender)}</span></div>`;
            }
            if (birthdayDisplay) {
                infoHTML += `<div class="info-item"><span class="info-icon">.✦ ݁˖</span><span class="info-text" style="color: ${currentFontColor};">${escapeHtml(birthdayDisplay)}</span></div>`;
            }
            if (country && country !== 'Select your country' && country !== 'So many countries' && country !== 'Select your country') {
                infoHTML += `<div class="info-item"><span class="info-icon">.✦ ݁˖</span><span class="info-text" style="color: ${currentFontColor};">${escapeHtml(country)}</span></div>`;
            }
            
            // Build interests section with font color
            let interestsHTML = '';
            if (interests) {
                const interestLines = interests.split('\n').filter(line => line.trim() !== '');
                if (interestLines.length > 0) {
                    interestsHTML = `
                        <div class="interests-section" style="background-color: ${currentAccentColor}40;">
                            <div class="interests-title" style="color: ${currentFontColor};">Interests</div>
                            <ul class="interests-list">
                                ${interestLines.map(line => `<li style="color: ${currentFontColor};">${escapeHtml(line.trim())}</li>`).join('')}
                            </ul>
                        </div>
                    `;
                }
            }
            
            // Build social section with font color
            let socialsHTML = '';
            if (allSocials.length > 0) {
                socialsHTML = `
                    <div class="social-section">
                        <div class="social-links">
                            ${allSocials.map(s => `<div class="social-badge" style="background-color: ${currentAccentColor}; color: ${currentFontColor};">${escapeHtml(s)}</div>`).join('')}
                        </div>
                    </div>
                `;
            }
            
            const cardContent = document.getElementById('card-content');
            if (cardContent) {
                cardContent.innerHTML = `
                    <div class="profile-card" style="background-color: ${currentMainColor}; color: ${currentFontColor};">
                        <div class="avatar-container"></div>
                        <h3 style="color: ${currentFontColor}; text-shadow: 1px 1px 0 ${currentAccentColor};">✧˖° ${escapeHtml(name)}</h3>
                        ${infoHTML ? `<div class="profile-info" style="background-color: ${currentAccentColor}; color: ${currentFontColor};">${infoHTML}</div>` : ''}
                        ${interestsHTML}
                        ${socialsHTML}
                        <div class="heart-message" style="color: ${currentFontColor};"> Nice to meet you!✧˖°</div>
                    </div>
                `;
                
                if (window.selectedAvatar) {
                    const avatarContainer = cardContent.querySelector('.avatar-container');
                    if (avatarContainer) {
                        const img = document.createElement('img');
                        img.src = window.selectedAvatar;
                        img.className = 'avatar-preview';
                        img.style.borderColor = currentAccentColor;
                        avatarContainer.appendChild(img);
                    }
                }
            }
            
            localStorage.setItem('savedMainColor', currentMainColor);
            localStorage.setItem('savedAccentColor', currentAccentColor);
            localStorage.setItem('savedFontColor', currentFontColor);
        });
    }
    
    // ========== 11. DOWNLOAD PROFILE CARD AS IMAGE ==========
    const downloadBtn = document.getElementById('downloadCardBtn');

    if (downloadBtn) {
        downloadBtn.addEventListener('click', async function() {
            const profileCard = document.querySelector('.profile-card:not(.preview-card)');
            
            if (!profileCard) {
                alert('Please create your profile card first by clicking "Save info!"');
                return;
            }
            
            const originalText = downloadBtn.textContent;
            downloadBtn.textContent = 'Generating image...';
            downloadBtn.disabled = true;
            
            try {
                const cardBg = profileCard.style.backgroundColor || '#ffb6c1';
                const canvas = await html2canvas(profileCard, {
                    scale: 3,
                    backgroundColor: cardBg,
                    logging: false,
                    useCORS: true,
                    allowTaint: false
                });
                
                const link = document.createElement('a');
                link.download = 'my-profile-card.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
                
                downloadBtn.textContent = 'Downloaded!';
                downloadBtn.disabled = false;
                setTimeout(() => {
                    downloadBtn.textContent = originalText;
                }, 2000);
                
            } catch (error) {
                console.error('Error:', error);
                alert('Sorry, there was an error generating the image. Please try again.');
                downloadBtn.textContent = originalText;
                downloadBtn.disabled = false;
            }
        });
    }
    
});