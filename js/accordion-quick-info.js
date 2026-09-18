(function () {
    var STORAGE_KEY = 'quickInfoEnhancementEnabled';
    var shell = null;

    function loadEnabled() {
        return new Promise(function (resolve) {
            chrome.storage.local.get([STORAGE_KEY], function (result) {
                resolve(!!result[STORAGE_KEY]);
            });
        });
    }

    function persist(enabled) {
        var data = {};
        data[STORAGE_KEY] = enabled;
        chrome.storage.local.set(data);
    }

    function buildDom(enabled) {
        var row = document.createElement('label');
        row.className = 'accordion-preset';

        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = enabled;
        checkbox.addEventListener('change', function (e) {
            persist(e.target.checked);
        });

        var text = document.createElement('span');
        text.textContent = 'Enable quick info enhancement';

        row.appendChild(checkbox);
        row.appendChild(text);

        shell.bodyEl.appendChild(row);
    }

    function init(containerId) {
        shell = AccordionShell.create({ containerId: containerId, title: 'Quick Info' });
        if (!shell) {
            return;
        }

        loadEnabled().then(buildDom);
    }

    window.QuickInfoAccordion = {
        init: init
    };
})();
