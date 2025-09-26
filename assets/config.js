window.formatCurrency = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: Shopify.currency.active || "USD",
    trailingZeroDisplay: 'stripIfInteger'
});
const formList = document.querySelectorAll('form[data-id]');
formList.forEach((form) => {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const productId = formData.get('id');

        if (!productId) return;

        // Find submit button in form
        const submitButton = form.querySelector('button[type="submit"], .add-to-cart');
        if (!submitButton) return;

        // Store original content
        const originalContent = submitButton.innerHTML;

        // Show spinner and disable button
        submitButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
        submitButton.disabled = true;
        submitButton.style.opacity = '0.7';

        try {
            const response = await fetch('/cart/add.js', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ id: productId, quantity: 1 })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            // Success feedback
            submitButton.innerHTML = '<i class="fa-solid fa-check"></i>';
            submitButton.style.backgroundColor = '#10b981';

            // Restore original state after 1 second
            setTimeout(() => {
                submitButton.innerHTML = originalContent;
                submitButton.disabled = false;
                submitButton.style.opacity = '1';
                submitButton.style.backgroundColor = '';
            }, 1000);

        } catch (error) {
            console.error('Error adding product to cart:', error);

            // Error feedback
            submitButton.innerHTML = '<i class="fa-solid fa-times"></i>';
            submitButton.style.backgroundColor = '#ef4444';

            // Restore original state after 2 seconds
            setTimeout(() => {
                submitButton.innerHTML = originalContent;
                submitButton.disabled = false;
                submitButton.style.opacity = '1';
                submitButton.style.backgroundColor = '';
            }, 2000);

            alert('There was an error adding the product to the cart.');
        }
    });
});

async function addToCart(event, idVariant, buttonElement) {
    event.stopPropagation();
    if (!idVariant || !buttonElement) return;

    // Store original content
    const originalContent = buttonElement.innerHTML;

    // Show spinner and disable button
    buttonElement.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
    buttonElement.disabled = true;
    buttonElement.style.opacity = '0.7';

    try {
        const response = await fetch('/cart/add.js', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ id: idVariant, quantity: 1 })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        // Success feedback
        buttonElement.innerHTML = '<i class="fa-solid fa-check"></i>';
        buttonElement.style.backgroundColor = '#10b981';

        // Restore original state after 1 second
        setTimeout(() => {
            buttonElement.innerHTML = originalContent;
            buttonElement.disabled = false;
            buttonElement.style.opacity = '1';
            buttonElement.style.backgroundColor = '';
        }, 1000);

    } catch (error) {
        console.error('Error adding product to cart:', error);

        // Error feedback
        buttonElement.innerHTML = '<i class="fa-solid fa-times"></i>';
        buttonElement.style.backgroundColor = '#ef4444';

        // Restore original state after 2 seconds
        setTimeout(() => {
            buttonElement.innerHTML = originalContent;
            buttonElement.disabled = false;
            buttonElement.style.opacity = '1';
            buttonElement.style.backgroundColor = '';
        }, 2000);

        alert('There was an error adding the product to the cart.');
    }
}

const productListInVideoSection = document.querySelectorAll('[data-product-video-section]');
productListInVideoSection.forEach((product) => {
    const config = product.getAttribute('data-product-video-section');
    if (!config) return;
    const productData = JSON.parse(config);
    if (!productData || productData?.length === 0) return;

    const productListHTML = productData.map((item, index) => {
        return `<div class="product-item flex justify-between items-center px-4 py-2 transition-all duration-300 ease-in-out ${index > 0 ? 'collapsed' : ''}" style="border-bottom: 1px solid #eee; overflow: hidden;">
          <div class="flex items-start gap-4">
            <img src="${item.featured_image}" alt="${item.title}" class="max-h-[60px] max-w-[70px] object-cover rounded"/>
            <div class="flex-1">
                <h3 class="font-[SofiaPro-Regular] pt-1 text-sm">${item.title}</h3>
                <p class="text-sm text-black text-md">${window.formatCurrency.format(item.price)}</p>
            </div>
          </div>
          <div class="flex flex-col items-center gap-2">
            ${index === 0 && productData.length > 1 ? `<button type="button" class="expand-toggle transition-transform duration-200">
                <i class="fa-solid fa-chevron-down transition-transform duration-200"></i>
            </button>` : ''
            }
        <button onclick="addToCart(event, ${item?.variants[0]?.id}, this)" class="add-to-cart w-[30px] h-[30px] flex justify-center items-center rounded-full bg-[#ee4d2d] text-[#fff] transition-all duration-200 hover:bg-[#d63916]" data-id="${item.id}">
            <i class="fa-solid fa-plus"></i>
        </button>
          </div>
        </div > `;
    }).join('');

    product.classList.add('bg-white', 'rounded-lg', 'overflow-hidden', 'max-w-md', 'mx-auto', 'my-4');
    product.style.border = '1px solid #ddd';
    product.innerHTML = productListHTML;
    ;

    const style = document.createElement('style');
    style.textContent = `
        .product-item.collapsed {
            max-height: 0 !important;
            opacity: 0;
            padding-top: 0 !important;
            padding-bottom: 0 !important;
            margin-top: 0 !important;
            margin-bottom: 0 !important;
            border: none !important;
        }
        .product-item:not(.collapsed) {
            max-height: 200px;
            opacity: 1;
        }
        .expand-toggle:hover i {
            transform: scale(1.1);
        }
    `;
    document.head.appendChild(style);

    // Add expand/collapse functionality
    const expandToggle = product.querySelector('.expand-toggle');
    const videoElment = product.parentElement.querySelector('.video-wrapper');
    if (expandToggle) {
        let isAnimating = false;

        expandToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (isAnimating) return; // Prevent spam clicks
            isAnimating = true;

            const collapsedItems = product.querySelectorAll('.product-item.collapsed');
            const isExpanded = collapsedItems.length === 0;
            const chevron = expandToggle.querySelector('i');

            // Animate chevron rotation
            chevron.style.transform = isExpanded ? 'rotate(180deg)' : 'rotate(0deg)';

            if (isExpanded) {
                product.classList.add("my-4")
                videoElment.style.display = "block";
                // Collapse: hide all except first
                const itemsToHide = product.querySelectorAll('.product-item:not(:first-child)');
                itemsToHide.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('collapsed');
                    }, index * 50);
                });

                setTimeout(() => {
                    isAnimating = false;
                }, itemsToHide.length * 50 + 300);

            } else {
                videoElment.style.display = "none";
                product.classList.remove("my-4")
                // Expand: show all items
                collapsedItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.remove('collapsed');
                    }, index * 80);
                });

                setTimeout(() => {
                    isAnimating = false;
                }, collapsedItems.length * 80 + 300);
            }
        });
    }
});