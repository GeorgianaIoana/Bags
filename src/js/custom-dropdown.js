export function initCustomDropdowns() {
    const selects = document.querySelectorAll('.product-options select');
    
    selects.forEach(select => {
        if (select.parentElement.classList.contains('custom-dropdown-wrapper')) {
            return;
        }

        const wrapper = document.createElement('div');
        wrapper.className = 'custom-dropdown-wrapper';
        
        const display = document.createElement('div');
        display.className = 'custom-dropdown-display';
        display.textContent = select.options[select.selectedIndex]?.text || 'Choose option';
        
        const dropdown = document.createElement('div');
        dropdown.className = 'custom-dropdown-menu';
        dropdown.style.display = 'none';
        
        Array.from(select.options).forEach((option, index) => {
            const optionEl = document.createElement('div');
            optionEl.className = 'custom-dropdown-option';
            if (index === select.selectedIndex) {
                optionEl.classList.add('selected');
            }
            optionEl.textContent = option.text;
            optionEl.dataset.value = option.value;
            
            optionEl.addEventListener('click', (e) => {
                e.stopPropagation();
                select.value = option.value;
                display.textContent = option.text;
                dropdown.querySelectorAll('.custom-dropdown-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                optionEl.classList.add('selected');
                dropdown.style.display = 'none';
                display.classList.remove('active');
                
                const changeEvent = new Event('change', { bubbles: true });
                select.dispatchEvent(changeEvent);
            });
            
            dropdown.appendChild(optionEl);
        });
        
        display.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = dropdown.style.display === 'block';
            dropdown.style.display = isOpen ? 'none' : 'block';
            display.classList.toggle('active', !isOpen);
            
            if (!isOpen) {
                display.textContent = select.options[select.selectedIndex]?.text || 'Choose option';
            }
        });
        
        const closeHandler = (e) => {
            if (!wrapper.contains(e.target)) {
                dropdown.style.display = 'none';
                display.classList.remove('active');
            }
        };
        
        setTimeout(() => {
            document.addEventListener('click', closeHandler, true);
        }, 0);
        
        const originalParent = select.parentElement;
        wrapper.appendChild(display);
        wrapper.appendChild(dropdown);
        select.style.position = 'absolute';
        select.style.opacity = '0';
        select.style.pointerEvents = 'none';
        select.style.width = '1px';
        select.style.height = '1px';
        select.style.overflow = 'hidden';
        select.style.clip = 'rect(0,0,0,0)';
        originalParent.insertBefore(wrapper, select);
        wrapper.appendChild(select);
    });
}
