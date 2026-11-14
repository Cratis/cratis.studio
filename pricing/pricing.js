// Copyright (c) Cratis. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

(() => {
    const money = amount => new Intl.NumberFormat('en-IE', {
        style: 'currency', currency: 'EUR',
        minimumFractionDigits: Number.isInteger(amount) ? 0 : 2, maximumFractionDigits: 2
    }).format(amount);
    const options = document.querySelectorAll('.price-toggle button');
    const grid = document.querySelector('.price-grid');

    // A yearly period is twelve months less the yearly discount, the same arithmetic Direct's catalog uses.
    const show = period => {
        grid.dataset.period = period;
        options.forEach(o => {
            const active = o.dataset.period === period;
            o.classList.toggle('is-active', active);
            o.setAttribute('aria-pressed', String(active));
        });

        grid.querySelectorAll('.price-card[data-monthly]').forEach(card => {
            const monthly = Number(card.dataset.monthly);
            const yearlyTotal = monthly * 12 * (100 - Number(card.dataset.yearlyDiscount)) / 100;
            const yearly = period === 'yearly';
            card.querySelector('.amount').textContent = money(yearly ? yearlyTotal / 12 : monthly);
            card.querySelector('.price-billed').textContent = yearly ? `Billed yearly at ${money(yearlyTotal)}` : 'Billed monthly';
        });
    };

    options.forEach(o => o.addEventListener('click', () => show(o.dataset.period)));
})();
