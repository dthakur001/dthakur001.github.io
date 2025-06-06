//////////////////////////////////////////////////
// ############################################ //
/////////// JS FOR FAQ.HTML /////////////////////
/* ---------- 1.  DATA  ---------- */
const FAQ_SECTION_DATA = {
    1: [ // Delivery Timing & Options
        ['How long does flower delivery take?',
            'We offer same-day delivery for orders placed before 2 PM. Orders placed after will be delivered the next day.'],
        ['Do you deliver on weekends or holidays?',
            'Yes, we deliver 7 days a week including most holidays. Availability may vary by region.'],
        ['Do you offer same-day delivery?',
            'Yes, for orders placed before 2 PM local time. Otherwise, your flowers will arrive the next day.'],
        ['Can I choose a specific delivery time?',
            'While we can’t guarantee exact times, you can select a preferred delivery window (morning, afternoon, evening).'],
        ['Can I schedule a delivery in advance?',
            'Definitely. You can select a future delivery date at checkout, up to 30 days in advance.'],
        ['What happens if the recipient isn’t home?',
            'We’ll leave the bouquet safely at the doorstep or with a neighbor and notify you. If delivery fails, we’ll reach out for redelivery options.'],
        ['Do you deliver to hospitals or offices?',
            'Yes, we deliver to hospitals, offices, and other non-residential locations. Please ensure the recipient’s details are correct and include any delivery instructions.']
    ],
    2: [ // Personalization & Custom Orders
        ['Can I include a personalized message?',
            'Absolutely! You can add a custom message during checkout, and we’ll include it on a beautiful card with your bouquet.'],
        ['Can I customize my bouquet?',
            'Yes! You can select specific flowers, colors, and vases using our interactive menu.']
    ],
    3: [ // Order Changes & Refunds
        ['What if I made a mistake in my order?',
            'Contact us as soon as possible via email or phone. We can usually make changes if the bouquet hasn’t been prepared yet.'],
        ['How does the refund policy work?',
            'If you’re unsatisfied with your order or if there’s a delivery issue, contact us within 24 hours for a full or partial refund depending on the situation.']
    ],
    4: [ // Flower Quality & Care
        ['Are your flowers fresh?',
            'Absolutely. We work with local florists and suppliers to ensure every bouquet is made with fresh, hand-picked blooms.'],
        ['How do I take care of the flowers after delivery?',
            'Keep them in fresh water, trim the stems at an angle every 2 days, and avoid direct sunlight or heat. Care instructions are included with every order.']
    ],
    5: [ // Visual-Preview Tool
        ['How do I know the bouquet will look good at the recipient\'s location?',
            'Our “Look & Feel” tool lets you preview how a bouquet will look in different lighting and on various tables.'],
        ['How do I use the "Look & Feel" feature?',
            'Just click the “LOOK ON YOUR TABLE” badge next to a bouquet and select your desired table, lighting, or explore other bouquet options.']
    ]
};

/* ---------- 2.  RENDER LOGIC  ---------- */
const faqQuestionsContainer = document.querySelector('.questions');
const faqCategoryButtons = document.querySelectorAll('.cat-btn');

function renderFaqCategory(categoryKey) {
    faqQuestionsContainer.innerHTML = '';          // clear previous items

    FAQ_SECTION_DATA[categoryKey].forEach(([question, answer]) => {
        const detailEl = document.createElement('details');
        detailEl.className = 'faq-item';

        const summaryEl = document.createElement('summary');
        summaryEl.textContent = question;

        const paraEl = document.createElement('p');
        paraEl.textContent = answer;

        detailEl.append(summaryEl, paraEl);
        faqQuestionsContainer.appendChild(detailEl);
    });
}

/* ---------- 3.  BUTTON HANDLERS  ---------- */
faqCategoryButtons.forEach(categoryBtn => {
    categoryBtn.addEventListener('click', () => {
        const matched = categoryBtn.className.match(/open-cat(\d)/);
        const selectedCategoryKey = matched ? matched[1] : 1;

        renderFaqCategory(selectedCategoryKey);

        // update active styling
        faqCategoryButtons.forEach(otherBtn => otherBtn.classList.remove('active-cat'));
        categoryBtn.classList.add('active-cat');
    });
});

/* ---------- 4.  INITIAL LOAD ---------- */
renderFaqCategory(1);
document.querySelector('.open-cat1').classList.add('active-cat');

//////////////////////////////////////////////////
