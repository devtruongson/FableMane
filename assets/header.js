document.addEventListener('DOMContentLoaded', function () {
    const links = document.querySelectorAll('.promobar-link');
    const headerDivider = document.querySelector('.header-divider');
    const dropdownSearch = document.querySelector('.site-header__search-bar');
    const headerSearch = document.querySelector('.header-search');
    const searchIconOpen = headerSearch?.querySelector('.search-icon-open');
    const searchIconClose = headerSearch?.querySelector('.search-icon-close');
    const headerMobile = document.querySelector(".header-search-mobile")
    const mobileSearchForm = document.querySelector('.site-header__search-bar-mobile');
    const mobileSearchButton = headerMobile?.querySelector('button');
    const mobileSearchIconClose = headerMobile?.querySelector('.search-icon-close');
    const mobileSearchIconOpen = headerMobile?.querySelector('.search-icon-open');

    // Mobile menu bar elements
    const mobileMenuContent = document.querySelector('.menu-mb');
    const mobileMenuIcon = document.querySelector('.mobile-menu-icon');

    let currentIndex = 0;

    function showNextLink() {
        if (links && links.length > 0) {
            links[currentIndex]?.classList?.remove('opacity-100');
            links[currentIndex]?.classList?.add('opacity-0');

            currentIndex = (currentIndex + 1) % links.length;

            setTimeout(() => {
                links[currentIndex]?.classList?.remove('opacity-0');
                links[currentIndex]?.classList?.add('opacity-100');
            }, 300);
        }
    }

    if (links && links.length > 0) {
        links[currentIndex]?.classList?.remove('opacity-0');
        links[currentIndex]?.classList?.add('opacity-100');

        setInterval(showNextLink, 3500);
    }

    const logoHeader = document.querySelector('.logo-header');
    const logoHeaderSecond = document.querySelector('.logo-header-second');
    if (logoHeader && logoHeaderSecond) {
        const toggleLogo = () => {
            if (window.scrollY > 80) {
                logoHeaderSecond.classList?.add('block');
                logoHeaderSecond.classList?.remove('hidden');

                logoHeader.classList?.add('hidden');
                logoHeader.classList?.remove('block');
            } else {
                logoHeaderSecond.classList?.add('hidden');
                logoHeaderSecond.classList?.remove('block');

                logoHeader.classList?.add('block');
                logoHeader.classList?.remove('hidden');
            }
        }
        toggleLogo();
        window.addEventListener("scroll", toggleLogo);
    }

    document.querySelectorAll('.nav-item').forEach(item => {
        if (!item) return;

        item.addEventListener('mouseenter', () => {
            if (headerDivider) headerDivider.style.display = 'block';
            if (dropdownSearch) dropdownSearch.style.display = 'none';
            if (searchIconClose) searchIconClose.style.display = 'block';
            if (searchIconOpen) searchIconOpen.style.display = 'none';
        });

        item.addEventListener('mouseleave', () => {
            if (headerDivider) headerDivider.style.display = 'none';
        });
    });

    if (headerSearch) {
        const buttonSearchIcon = headerSearch.querySelector('button');
        const inputSearch = dropdownSearch?.querySelector('input');

        if (searchIconOpen) searchIconOpen.style.display = 'none';
        if (searchIconClose) searchIconClose.style.display = 'block';

        let isOpen = false;
        buttonSearchIcon?.addEventListener("click", () => {
            if (isOpen) {
                if (dropdownSearch) dropdownSearch.style.display = 'none';
                if (searchIconClose) searchIconClose.style.display = 'block';
                if (searchIconOpen) searchIconOpen.style.display = 'none';
                if (headerDivider) headerDivider.style.display = 'none';
                isOpen = false;
            } else {
                if (searchIconClose) searchIconClose.style.display = 'none';
                if (searchIconOpen) searchIconOpen.style.display = 'block';
                if (dropdownSearch) dropdownSearch.style.display = 'block';
                if (headerDivider) headerDivider.style.display = 'block';
                if (inputSearch) inputSearch.focus();
                isOpen = true;
            }
        });
    }

    // Mobile menu handling
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.querySelector('.menu-icon');
    const closeIcon = document.querySelector('.close-icon');

    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', function () {
            mobileMenu.classList.toggle('hidden');
            if (menuIcon) menuIcon.classList.toggle('hidden');
            if (closeIcon) closeIcon.classList.toggle('hidden');

            if (!mobileMenu.classList.contains('hidden')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
    }

    document.querySelectorAll('.mobile-dropdown-toggle').forEach(toggle => {
        if (!toggle) return;
        toggle.addEventListener('click', function () {
            const content = this.nextElementSibling;
            const icon = this.querySelector('.mobile-dropdown-icon');
            if (content && icon) {
                content.classList.toggle('hidden');
                icon.textContent = content.classList.contains('hidden') ? '+' : '−';
            }
        });
    });

    // Xử lý dropdown menu cho mobile
    const mobileToggles = document.querySelectorAll('.mobile-dropdown-toggle');

    mobileToggles.forEach(toggle => {
        toggle.addEventListener('click', function (e) {
            e.stopPropagation(); // Ngăn sự kiện lan ra ngoài
        });
    });

    // Mobile menu bar toggle
    if (mobileMenuIcon && mobileMenuContent) {
        let isMobileMenuOpen = false;

        // Initially hide mobile menu
        mobileMenuContent.style.display = 'none';
        mobileMenuContent.classList.remove('open');
        mobileMenuContent.classList.add('hidden');

        mobileMenuIcon.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            console.log('Mobile menu icon clicked'); // Debug log

            if (isMobileMenuOpen) {
                // Close menu
                console.log('Closing menu'); // Debug log
                mobileMenuContent.style.display = 'none';
                mobileMenuContent.classList.remove('open');
                mobileMenuContent.classList.add('hidden');
                isMobileMenuOpen = false;
            } else {
                // Open menu
                console.log('Opening menu'); // Debug log
                mobileMenuContent.classList.remove('hidden');
                mobileMenuContent.style.display = 'block';
                mobileMenuContent.classList.add('open');
                isMobileMenuOpen = true;
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', function (e) {
            if (isMobileMenuOpen && !e.target.closest('.mobile-menu-icon') && !e.target.closest('.menu-mb')) {
                console.log('Closing menu from outside click'); // Debug log
                mobileMenuContent.style.display = 'none';
                mobileMenuContent.classList.remove('open');
                mobileMenuContent.classList.add('hidden');
                isMobileMenuOpen = false;
            }
        });
    } else {
        console.log('Mobile menu elements not found:', { mobileMenuIcon, mobileMenuContent }); // Debug log
    }

    // Mobile search handling
    if (mobileSearchButton && mobileSearchForm) {
        let isMobileSearchOpen = false;

        // Initially hide mobile search form
        mobileSearchForm.style.display = 'none';

        mobileSearchButton.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            if (isMobileSearchOpen) {
                // Close search
                mobileSearchForm.style.display = 'none';
                if (mobileSearchIconClose) mobileSearchIconClose.style.display = 'block';
                if (mobileSearchIconOpen) mobileSearchIconOpen.style.display = 'none';
                isMobileSearchOpen = false;
            } else {
                // Open search
                mobileSearchForm.style.display = 'block';
                if (mobileSearchIconClose) mobileSearchIconClose.style.display = 'none';
                if (mobileSearchIconOpen) mobileSearchIconOpen.style.display = 'block';

                // Focus on input
                const mobileInput = mobileSearchForm.querySelector('input');
                if (mobileInput) {
                    setTimeout(() => mobileInput.focus(), 100);
                }
                isMobileSearchOpen = true;
            }
        });

        // Close search when clicking outside
        document.addEventListener('click', function (e) {
            if (isMobileSearchOpen && !mobileSearchForm.contains(e.target) && !mobileSearchButton.contains(e.target)) {
                mobileSearchForm.style.display = 'none';
                if (mobileSearchIconClose) mobileSearchIconClose.style.display = 'block';
                if (mobileSearchIconOpen) mobileSearchIconOpen.style.display = 'none';
                isMobileSearchOpen = false;
            }
        });
    }
});