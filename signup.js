// Shows or hides the signup links according to site-config.js. The links are hidden in the markup, so a visitor
// whose script does not run sees the same page as when signup is off.
(function () {
    var config = window.CRATIS_STUDIO || {};
    if (config.signupEnabled !== true || !config.signupUrl) {
        return;
    }

    document.querySelectorAll('[data-signup-on]').forEach(function (element) {
        if (element.tagName === 'A') {
            element.href = config.signupUrl;
        }

        element.hidden = false;
    });
    document.querySelectorAll('[data-signup-off]').forEach(function (element) {
        element.hidden = true;
    });
})();
