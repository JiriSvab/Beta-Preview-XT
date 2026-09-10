(function () {
    var STORAGE_KEY = 'selectedLanguages';

    var languages = {};
    var selected = new Set();
    var container = null;
    var elements = {};

    function loadLanguages() {
        return fetch(chrome.runtime.getURL('js/languages.json')).then(function (r) {
            return r.json();
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

    function updateCount() {
        elements.count.textContent = '(' + selected.size + ') items selected';
    }

    function updateSelectAllState() {
        var total = Object.keys(languages).length;
        var selectedCount = selected.size;
        elements.selectAllCheckbox.checked = total > 0 && selectedCount === total;
        elements.selectAllCheckbox.indeterminate = selectedCount > 0 && selectedCount < total;
    }

    function onItemChange(e) {
        var name = e.target.dataset.lang;
        if (e.target.checked) {
            selected.add(name);
        } else {
            selected.delete(name);
        }
        updateSelectAllState();
        updateCount();
        persist();
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
        updateCount();
        persist();
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

        var selectAllRow = document.createElement('label');
        selectAllRow.className = 'accordion-select-all';

        var selectAllCheckbox = document.createElement('input');
        selectAllCheckbox.type = 'checkbox';
        selectAllCheckbox.addEventListener('change', onSelectAllChange);

        var selectAllText = document.createElement('span');
        selectAllText.textContent = 'Select all';

        selectAllRow.appendChild(selectAllCheckbox);
        selectAllRow.appendChild(selectAllText);

        var grid = document.createElement('div');
        grid.className = 'accordion-grid';

        Object.keys(languages).sort().forEach(function (name) {
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

        body.appendChild(selectAllRow);
        body.appendChild(grid);

        container.appendChild(header);
        container.appendChild(body);

        elements = {
            header: header,
            body: body,
            chevron: chevron,
            count: count,
            selectAllCheckbox: selectAllCheckbox,
            grid: grid
        };

        updateSelectAllState();
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
