(function () {
    var STORAGE_KEY = 'selectedLanguages';

    var LANGUAGE_ORDER = [
        'English',
        'German (Germany)',
        'Spanish (Spain)',
        'French (France)',
        'Italian (Italy)',
        'Portuguese (Brazil)',
        'German (Austria)',
        'Danish (Denmark)',
        'Finnish (Finland)',
        'Norwegian (Norway)',
        'Swedish (Sweden)',
        'Dutch (Netherlands)',
        'Dutch (Belgium)',
        'French (Belgium)',
        'French (Africa)',
        'French (Switzerland)',
        'German (Switzerland)',
        'Polish (Poland)',
        'Hungarian (Hungary)',
        'Indonesian (Indonesia)',
        'Japanese (Japan)',
        'Korean (Korea)',
        'Russian (Kazakhstan)',
        'Spanish (Central America)',
        'Spanish (South America)',
        'English (United States)',
        'English (Canada)',
        'English (United Kingdom)',
        'English (India)',
        'English (Middle East)',
        'English (Singapore)',
        'English (South Africa)'
    ];

    var TOP6_LANGUAGES = LANGUAGE_ORDER.slice(0, 6);

    function orderedLanguageNames() {
        var known = LANGUAGE_ORDER.filter(function (name) {
            return Object.prototype.hasOwnProperty.call(languages, name);
        });
        var rest = Object.keys(languages).filter(function (name) {
            return LANGUAGE_ORDER.indexOf(name) === -1;
        }).sort();
        return known.concat(rest);
    }

    var languages = {};
    var selected = new Set();
    var container = null;
    var elements = {};

    function loadLanguages() {
        return fetch(chrome.runtime.getURL('js/languages.json')).then(function (r) {
            return r.json();
        }).then(function (data) {
            // Sitecore's global "English" (value="en") has no entry in languages.json
            // because language-map.js intentionally leaves it out of the URL locale logic.
            return Object.assign({ 'English': 'en' }, data);
        });
    }

    function loadSelection() {
        return new Promise(function (resolve) {
            chrome.storage.local.get([STORAGE_KEY], function (result) {
                resolve(result[STORAGE_KEY]);
            });
        });
    }

    function persist() {
        var data = {};
        data[STORAGE_KEY] = Array.from(selected);
        chrome.storage.local.set(data);
    }

    function syncToActiveTab() {
        if (!chrome.tabs) {
            return;
        }
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            if (!tabs[0]) {
                return;
            }
            chrome.tabs.sendMessage(tabs[0].id, {
                action: 'syncSitecoreLanguages',
                codes: getSelected()
            }, function () {
                void chrome.runtime.lastError; // no content script on this tab (non-Sitecore page) - ignore
            });
        });
    }

    function updateCount() {
        elements.count.textContent = '(' + selected.size + ') items selected';
    }

    function updateSelectAllState() {
        var total = Object.keys(languages).length;
        var selectedCount = selected.size;
        elements.selectAllCheckbox.checked = total > 0 && selectedCount === total;
        elements.selectAllCheckbox.indeterminate = selectedCount > 0 && selectedCount < total;
    }

    function updateTop6State() {
        var known = TOP6_LANGUAGES.filter(function (name) {
            return Object.prototype.hasOwnProperty.call(languages, name);
        });
        var selectedCount = known.filter(function (name) {
            return selected.has(name);
        }).length;
        elements.selectTop6Checkbox.checked = known.length > 0 && selectedCount === known.length;
        elements.selectTop6Checkbox.indeterminate = selectedCount > 0 && selectedCount < known.length;
    }

    function onItemChange(e) {
        var name = e.target.dataset.lang;
        if (e.target.checked) {
            selected.add(name);
        } else {
            selected.delete(name);
        }
        updateSelectAllState();
        updateTop6State();
        updateCount();
        persist();
        syncToActiveTab();
    }

    function onSelectAllChange(e) {
        var checked = e.target.checked;
        Object.keys(languages).forEach(function (name) {
            if (checked) {
                selected.add(name);
            } else {
                selected.delete(name);
            }
        });
        elements.grid.querySelectorAll('input[type="checkbox"]').forEach(function (cb) {
            cb.checked = checked;
        });
        elements.selectAllCheckbox.indeterminate = false;
        updateTop6State();
        updateCount();
        persist();
        syncToActiveTab();
    }

    function onSelectTop6Change(e) {
        var checked = e.target.checked;
        TOP6_LANGUAGES.forEach(function (name) {
            if (!Object.prototype.hasOwnProperty.call(languages, name)) {
                return;
            }
            if (checked) {
                selected.add(name);
            } else {
                selected.delete(name);
            }
        });
        elements.grid.querySelectorAll('input[type="checkbox"]').forEach(function (cb) {
            cb.checked = selected.has(cb.dataset.lang);
        });
        elements.selectTop6Checkbox.indeterminate = false;
        updateSelectAllState();
        updateCount();
        persist();
        syncToActiveTab();
    }

    function toggleOpen() {
        elements.body.hidden = !elements.body.hidden;
        container.classList.toggle('open', !elements.body.hidden);
    }

    function buildDom() {
        container.innerHTML = '';
        container.classList.add('accordion');

        var header = document.createElement('div');
        header.className = 'accordion-header';

        var title = document.createElement('span');
        title.className = 'accordion-title';
        title.textContent = 'Languages';

        var count = document.createElement('span');
        count.className = 'accordion-count';

        var chevron = document.createElement('span');
        chevron.className = 'accordion-chevron';
        chevron.textContent = '▾';

        header.appendChild(title);
        header.appendChild(count);
        header.appendChild(chevron);
        header.addEventListener('click', toggleOpen);

        var body = document.createElement('div');
        body.className = 'accordion-body';
        body.hidden = true;

        var presetsRow = document.createElement('div');
        presetsRow.className = 'accordion-presets';

        var selectAllRow = document.createElement('label');
        selectAllRow.className = 'accordion-preset';

        var selectAllCheckbox = document.createElement('input');
        selectAllCheckbox.type = 'checkbox';
        selectAllCheckbox.addEventListener('change', onSelectAllChange);

        var selectAllText = document.createElement('span');
        selectAllText.textContent = 'Select all';

        selectAllRow.appendChild(selectAllCheckbox);
        selectAllRow.appendChild(selectAllText);

        var selectTop6Row = document.createElement('label');
        selectTop6Row.className = 'accordion-preset';

        var selectTop6Checkbox = document.createElement('input');
        selectTop6Checkbox.type = 'checkbox';
        selectTop6Checkbox.addEventListener('change', onSelectTop6Change);

        var selectTop6Text = document.createElement('span');
        selectTop6Text.textContent = 'Select top 6';

        selectTop6Row.appendChild(selectTop6Checkbox);
        selectTop6Row.appendChild(selectTop6Text);

        presetsRow.appendChild(selectAllRow);
        presetsRow.appendChild(selectTop6Row);

        var grid = document.createElement('div');
        grid.className = 'accordion-grid';

        orderedLanguageNames().forEach(function (name) {
            var item = document.createElement('label');
            item.className = 'accordion-item';

            var checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.dataset.lang = name;
            checkbox.checked = selected.has(name);
            checkbox.addEventListener('change', onItemChange);

            var label = document.createElement('span');
            label.textContent = name;

            item.appendChild(checkbox);
            item.appendChild(label);
            grid.appendChild(item);
        });

        body.appendChild(presetsRow);
        body.appendChild(grid);

        container.appendChild(header);
        container.appendChild(body);

        elements = {
            header: header,
            body: body,
            chevron: chevron,
            count: count,
            selectAllCheckbox: selectAllCheckbox,
            selectTop6Checkbox: selectTop6Checkbox,
            grid: grid
        };

        updateSelectAllState();
        updateTop6State();
        updateCount();
    }

    function init(containerId) {
        container = document.getElementById(containerId);
        if (!container) {
            return;
        }

        Promise.all([loadLanguages(), loadSelection()]).then(function (results) {
            languages = results[0];
            var savedSelection = results[1];

            if (Array.isArray(savedSelection)) {
                selected = new Set(savedSelection.filter(function (name) {
                    return Object.prototype.hasOwnProperty.call(languages, name);
                }));
            } else {
                selected = new Set(Object.keys(languages));
            }

            buildDom();
            syncToActiveTab();
        });
    }

    function getSelected() {
        return Array.from(selected).map(function (name) {
            return languages[name];
        });
    }

    window.LanguageAccordion = {
        init: init,
        getSelected: getSelected
    };
})();
