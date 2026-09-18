(function () {
    var STORAGE_KEY = 'quickInfoEnhancementEnabled';
    var LINK_TOGGLES = [
        { key: 'liveViewLinkEnabled', text: 'Enable live view' },
        { key: 'previewLinkEnabled', text: 'Enable preview' },
        { key: 'stagingViewLinkEnabled', text: 'Enable staging view' }
    ];
    var shell = null;

    function loadEnabled() {
        return new Promise(function (resolve) {
            chrome.storage.local.get([STORAGE_KEY], function (result) {
                resolve(!!result[STORAGE_KEY]);
            });
        });
    }

    function persist(key, enabled) {
        var data = {};
        data[key] = enabled;
        chrome.storage.local.set(data);
    }

    function buildToggleRow(key, text, enabled) {
        var row = document.createElement('label');
        row.className = 'accordion-preset';

        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = enabled;
        checkbox.addEventListener('change', function (e) {
            persist(key, e.target.checked);
        });

        var textEl = document.createElement('span');
        textEl.textContent = text;

        row.appendChild(checkbox);
        row.appendChild(textEl);

        return row;
    }

    function buildDom(enabled) {
        shell.bodyEl.appendChild(buildToggleRow(STORAGE_KEY, 'Enable quick info enhancement', enabled));

        var linkKeys = LINK_TOGGLES.map(function (toggle) { return toggle.key; });
        chrome.storage.local.get(linkKeys, function (result) {
            LINK_TOGGLES.forEach(function (toggle) {
                shell.bodyEl.appendChild(buildToggleRow(toggle.key, toggle.text, !!result[toggle.key]));
            });
        });
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
