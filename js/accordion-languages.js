(function () {
    var STORAGE_KEY = 'selectedLanguages';
    var FAV_STORAGE_KEY = 'customFavLists';

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

    var PRESETS = [
        {
            key: 'top6',
            label: 'Top 6',
            languages: LANGUAGE_ORDER.slice(0, 6)
        },
        {
            key: 'dach',
            label: 'DACH',
            languages: ['German (Germany)', 'German (Austria)', 'French (Switzerland)', 'German (Switzerland)']
        },
        {
            key: 'nordics',
            label: 'Nordics',
            languages: ['Danish (Denmark)', 'Finnish (Finland)', 'Norwegian (Norway)', 'Swedish (Sweden)']
        }
    ];

    var FAV_PRESETS = [
        { key: 'fav1', label: 'Fav 1', isFav: true },
        { key: 'fav2', label: 'Fav 2', isFav: true }
    ];

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
    var shell = null;
    var elements = {};
    var codeToNames = {};
    var favText = {};
    var favMatched = {};

    function buildCodeToNames() {
        codeToNames = {};
        Object.keys(languages).forEach(function (name) {
            var code = String(languages[name]).toLowerCase();
            if (!codeToNames[code]) {
                codeToNames[code] = [];
            }
            codeToNames[code].push(name);
        });
    }

    function parseFavText(text) {
        var codes = (text || '').split(/[\s,]+/).map(function (s) {
            return s.trim().toLowerCase();
        }).filter(Boolean);
        var names = new Set();
        codes.forEach(function (code) {
            (codeToNames[code] || []).forEach(function (name) {
                names.add(name);
            });
        });
        return names;
    }

    function getPresetLanguages(preset) {
        if (preset.isFav) {
            return Array.from(favMatched[preset.key] || []);
        }
        return preset.languages;
    }

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

    function loadFavLists() {
        return new Promise(function (resolve) {
            chrome.storage.local.get([FAV_STORAGE_KEY], function (result) {
                resolve(result[FAV_STORAGE_KEY] || {});
            });
        });
    }

    function persistFavLists() {
        var data = {};
        data[FAV_STORAGE_KEY] = favText;
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
        shell.setCount('(' + selected.size + ') items selected');
    }

    function updateSelectAllState() {
        var total = Object.keys(languages).length;
        var selectedCount = selected.size;
        elements.selectAllCheckbox.checked = total > 0 && selectedCount === total;
        elements.selectAllCheckbox.indeterminate = selectedCount > 0 && selectedCount < total;
    }

    function updatePresetState(preset) {
        var known = getPresetLanguages(preset).filter(function (name) {
            return Object.prototype.hasOwnProperty.call(languages, name);
        });
        var selectedCount = known.filter(function (name) {
            return selected.has(name);
        }).length;
        var checkbox = elements.presetCheckboxes[preset.key];
        checkbox.checked = known.length > 0 && selectedCount === known.length;
        checkbox.indeterminate = selectedCount > 0 && selectedCount < known.length;
    }

    function updateAllPresetStates() {
        PRESETS.concat(FAV_PRESETS).forEach(updatePresetState);
    }

    function onItemChange(e) {
        var name = e.target.dataset.lang;
        if (e.target.checked) {
            selected.add(name);
        } else {
            selected.delete(name);
        }
        updateSelectAllState();
        updateAllPresetStates();
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
        updateAllPresetStates();
        updateCount();
        persist();
        syncToActiveTab();
    }

    function onPresetChange(preset, e) {
        var checked = e.target.checked;
        getPresetLanguages(preset).forEach(function (name) {
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
        updateSelectAllState();
        updateAllPresetStates();
        updateCount();
        persist();
        syncToActiveTab();
    }

    function onFavTextInput(fav, e) {
        var newText = e.target.value;
        favText[fav.key] = newText;

        var checkbox = elements.presetCheckboxes[fav.key];
        var wasFullyChecked = checkbox.checked && !checkbox.indeterminate;
        var oldMatched = favMatched[fav.key] || new Set();
        var newMatched = parseFavText(newText);
        favMatched[fav.key] = newMatched;

        if (wasFullyChecked) {
            oldMatched.forEach(function (name) {
                if (!newMatched.has(name)) {
                    selected.delete(name);
                }
            });
            newMatched.forEach(function (name) {
                selected.add(name);
            });
            elements.grid.querySelectorAll('input[type="checkbox"]').forEach(function (cb) {
                cb.checked = selected.has(cb.dataset.lang);
            });
            syncToActiveTab();
        }

        updateSelectAllState();
        updateAllPresetStates();
        updateCount();
        persist();
        persistFavLists();
    }

    function buildDom() {
        function createPresetRow(labelText, changeHandler) {
            var row = document.createElement('label');
            row.className = 'accordion-preset';

            var checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.addEventListener('change', changeHandler);

            var text = document.createElement('span');
            text.textContent = labelText;

            row.appendChild(checkbox);
            row.appendChild(text);

            return { row: row, checkbox: checkbox };
        }

        var presetsRow = document.createElement('div');
        presetsRow.className = 'accordion-presets';

        var selectAllPreset = createPresetRow('Leica all', onSelectAllChange);
        presetsRow.appendChild(selectAllPreset.row);

        var presetCheckboxes = {};
        PRESETS.forEach(function (preset) {
            var presetRow = createPresetRow(preset.label, function (e) {
                onPresetChange(preset, e);
            });
            presetCheckboxes[preset.key] = presetRow.checkbox;
            presetsRow.appendChild(presetRow.row);
        });

        var favsContainer = document.createElement('div');
        favsContainer.className = 'accordion-favs';

        FAV_PRESETS.forEach(function (fav) {
            var favRow = document.createElement('div');
            favRow.className = 'accordion-fav-row';

            var presetRow = createPresetRow(fav.label, function (e) {
                onPresetChange(fav, e);
            });
            presetCheckboxes[fav.key] = presetRow.checkbox;

            var input = document.createElement('input');
            input.type = 'text';
            input.className = 'accordion-fav-input';
            input.placeholder = 'de-at, fr-fr, en-gb ...';
            input.value = favText[fav.key] || '';
            input.addEventListener('input', function (e) {
                onFavTextInput(fav, e);
            });

            favRow.appendChild(presetRow.row);
            favRow.appendChild(input);
            favsContainer.appendChild(favRow);
        });

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

        shell.bodyEl.appendChild(presetsRow);
        shell.bodyEl.appendChild(favsContainer);
        shell.bodyEl.appendChild(grid);

        elements = {
            selectAllCheckbox: selectAllPreset.checkbox,
            presetCheckboxes: presetCheckboxes,
            grid: grid
        };

        updateSelectAllState();
        updateAllPresetStates();
        updateCount();
    }

    function init(containerId) {
        shell = AccordionShell.create({ containerId: containerId, title: 'Languages' });
        if (!shell) {
            return;
        }

        Promise.all([loadLanguages(), loadSelection(), loadFavLists()]).then(function (results) {
            languages = results[0];
            var savedSelection = results[1];
            var savedFavLists = results[2];

            buildCodeToNames();

            favText = {};
            favMatched = {};
            FAV_PRESETS.forEach(function (fav) {
                var text = (savedFavLists && typeof savedFavLists[fav.key] === 'string') ? savedFavLists[fav.key] : '';
                favText[fav.key] = text;
                favMatched[fav.key] = parseFavText(text);
            });

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
