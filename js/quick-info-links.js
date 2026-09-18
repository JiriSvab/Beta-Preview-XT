(function () {
    var LINK_CONFIGS = [
        { key: 'stagingViewLinkEnabled', urlType: 'staging', label: 'Staging:' },
        { key: 'previewLinkEnabled', urlType: 'preview', label: 'Preview:' },
        { key: 'liveViewLinkEnabled', urlType: 'live', label: 'Live view:' }
    ];
    var STORAGE_KEYS = LINK_CONFIGS.map(function (cfg) { return cfg.key; });
    var ROW_CLASS = 'quick-info-link-row';

    var enabledState = {};
    var observer = null;
    var scanScheduled = false;

    function findRowByLabel(table, labelPattern) {
        var rows = table.querySelectorAll('tr');
        for (var i = 0; i < rows.length; i++) {
            var label = rows[i].querySelector('td');
            if (label && labelPattern.test(label.textContent)) {
                return rows[i];
            }
        }
        return null;
    }

    function insertLinkRow(itemIdRow, label, url) {
        itemIdRow.insertAdjacentHTML('beforebegin',
            '<tr class="' + ROW_CLASS + '"><td>' + label + '</td><td><a href="' + url + '" target="_blank">' + url + '</a> ' +
            '<button type="button" class="quick-info-copy-btn">Copy</button></td></tr>');

        var newRow = itemIdRow.previousElementSibling;
        newRow.querySelector('.quick-info-copy-btn').addEventListener('click', function (e) {
            var btn = e.currentTarget;
            navigator.clipboard.writeText(url);
            btn.textContent = 'Copied!';
            setTimeout(function () { btn.textContent = 'Copy'; }, 1500);
        });
    }

    function anyEnabled() {
        return LINK_CONFIGS.some(function (cfg) { return enabledState[cfg.key]; });
    }

    function enhanceTable(table) {
        if (table.dataset.quickInfoLinksEnhanced) {
            return;
        }

        if (!anyEnabled()) {
            return;
        }

        var itemIdRow = findRowByLabel(table, /item id/i);
        var pathRow = findRowByLabel(table, /^path/i);
        if (!itemIdRow || !pathRow) {
            return;
        }

        var pathInput = pathRow.querySelector('input');
        var itemPath = pathInput ? pathInput.value : '';
        if (!itemPath) {
            return;
        }

        table.dataset.quickInfoLinksEnhanced = 'pending';

        loadLanguageMap().then(function (languageMap) {
            var locale = getLanguageLocale(languageMap);

            LINK_CONFIGS.forEach(function (cfg) {
                if (!enabledState[cfg.key]) {
                    return;
                }
                var url = mapItemPathToUrl(itemPath, cfg.urlType);
                if (url === null) {
                    return;
                }
                url = insertLocale(url, locale);
                insertLinkRow(itemIdRow, cfg.label, url);
            });

            table.dataset.quickInfoLinksEnhanced = 'true';
        });
    }

    function scan() {
        document.querySelectorAll('.scEditorQuickInfo').forEach(enhanceTable);
    }

    function scheduleScan() {
        if (scanScheduled) {
            return;
        }
        scanScheduled = true;
        requestAnimationFrame(function () {
            scanScheduled = false;
            scan();
        });
    }

    function removeInjectedRows() {
        document.querySelectorAll('.' + ROW_CLASS).forEach(function (row) {
            row.remove();
        });
        document.querySelectorAll('.scEditorQuickInfo[data-quick-info-links-enhanced]').forEach(function (table) {
            delete table.dataset.quickInfoLinksEnhanced;
        });
    }

    function applyState() {
        removeInjectedRows();

        if (anyEnabled()) {
            if (!observer) {
                observer = new MutationObserver(scheduleScan);
                observer.observe(document.documentElement, { childList: true, subtree: true });
            }
            scan();
        } else if (observer) {
            observer.disconnect();
            observer = null;
        }
    }

    chrome.storage.local.get(STORAGE_KEYS, function (result) {
        STORAGE_KEYS.forEach(function (key) {
            enabledState[key] = !!result[key];
        });
        applyState();
    });

    chrome.storage.onChanged.addListener(function (changes, area) {
        if (area !== 'local') {
            return;
        }

        var changed = false;
        STORAGE_KEYS.forEach(function (key) {
            if (key in changes) {
                enabledState[key] = !!changes[key].newValue;
                changed = true;
            }
        });

        if (changed) {
            applyState();
        }
    });
})();
