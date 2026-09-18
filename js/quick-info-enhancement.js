(function () {
    var STORAGE_KEY = 'quickInfoEnhancementEnabled';
    var GUID_RE = /^\{?([0-9a-f]{8})-?([0-9a-f]{4})-?([0-9a-f]{4})-?([0-9a-f]{4})-?([0-9a-f]{12})\}?$/i;
    var ROW_CLASS = 'quick-info-enhancement-row';

    var observer = null;
    var scanScheduled = false;

    function normalizeGuid(raw) {
        var match = GUID_RE.exec((raw || '').trim());
        if (!match) {
            return null;
        }
        return (match[1] + match[2] + match[3] + match[4] + match[5]).toUpperCase();
    }

    function findItemIdRow(table) {
        var rows = table.querySelectorAll('tr');
        for (var i = 0; i < rows.length; i++) {
            var label = rows[i].querySelector('td');
            if (label && /item id/i.test(label.textContent)) {
                return rows[i];
            }
        }
        return null;
    }

    function enhanceTable(table) {
        if (table.dataset.quickInfoEnhanced === 'true') {
            return;
        }

        var itemIdRow = findItemIdRow(table);
        if (!itemIdRow) {
            return;
        }

        var input = itemIdRow.querySelector('input');
        var guid = input ? normalizeGuid(input.value) : null;
        if (!guid) {
            return;
        }

        var link = '~/link.aspx?_id=' + guid + '&_z=z';

        itemIdRow.insertAdjacentHTML('afterend',
            '<tr class="' + ROW_CLASS + '"><td>Internal link:</td><td>' + link +
            ' <button type="button" class="quick-info-copy-btn">Copy</button></td></tr>');

        itemIdRow.nextElementSibling.querySelector('.quick-info-copy-btn').addEventListener('click', function (e) {
            var btn = e.currentTarget;
            navigator.clipboard.writeText(link);
            btn.textContent = 'Copied!';
            setTimeout(function () { btn.textContent = 'Copy'; }, 1500);
        });

        table.dataset.quickInfoEnhanced = 'true';
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
        document.querySelectorAll('.scEditorQuickInfo[data-quick-info-enhanced]').forEach(function (table) {
            delete table.dataset.quickInfoEnhanced;
        });
    }

    function startObserving() {
        if (observer) {
            return;
        }
        scan();
        observer = new MutationObserver(scheduleScan);
        observer.observe(document.documentElement, { childList: true, subtree: true });
    }

    function stopObserving() {
        if (observer) {
            observer.disconnect();
            observer = null;
        }
        removeInjectedRows();
    }

    function applyState(enabled) {
        if (enabled) {
            startObserving();
        } else {
            stopObserving();
        }
    }

    chrome.storage.local.get([STORAGE_KEY], function (result) {
        applyState(!!result[STORAGE_KEY]);
    });

    chrome.storage.onChanged.addListener(function (changes, area) {
        if (area === 'local' && STORAGE_KEY in changes) {
            applyState(!!changes[STORAGE_KEY].newValue);
        }
    });
})();
