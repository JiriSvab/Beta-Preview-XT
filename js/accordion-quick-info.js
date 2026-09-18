(function () {
    var shell = null;

    function buildDom() {
        var placeholder = document.createElement('div');
        placeholder.className = 'accordion-placeholder';
        placeholder.textContent = 'Coming soon';

        shell.bodyEl.appendChild(placeholder);
    }

    function init(containerId) {
        shell = AccordionShell.create({ containerId: containerId, title: 'Quick Info' });
        if (!shell) {
            return;
        }

        buildDom();
    }

    window.QuickInfoAccordion = {
        init: init
    };
})();
