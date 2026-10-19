/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./index.html', './signup.js', './site-config.js'],
    theme: {
        extend: {
            colors: {
                'event': '#f0a050',
                'command': '#7ec8f0',
                'readmodel': '#b8d63b',
                'connected': '#10b981',
            }
        }
    }
};
