(function () {
    var STORAGE_KEY = 'quickInfoEnhancementEnabled';
    var GUID_RE = /^\{?([0-9a-f]{8})-?([0-9a-f]{4})-?([0-9a-f]{4})-?([0-9a-f]{4})-?([0-9a-f]{12})\}?$/i;
    var IMAGE_TEMPLATE_RE = /\/sitecore\/templates\/system\/media\/(versioned|unversioned)\/(image|jpeg)\b/i;
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

    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function findRowByLabel(table, labelPattern) {
        return QuickInfoUtils.findRowByLabel(table, labelPattern);
    }

    function isImageTemplate(table) {
        var templateRow = findRowByLabel(table, /^template/i);
        var link = templateRow && templateRow.querySelector('a');
        return !!link && IMAGE_TEMPLATE_RE.test(link.textContent);
    }

    function insertRow(afterRow, label, value) {
        afterRow.insertAdjacentHTML('afterend',
            '<tr class="' + ROW_CLASS + '"><td>' + label + '</td><td>' + escapeHtml(value) +
            ' <button type="button" class="quick-info-copy-btn">Copy</button></td></tr>');

        var newRow = afterRow.nextElementSibling;
        newRow.querySelector('.quick-info-copy-btn').addEventListener('click', function (e) {
            var btn = e.currentTarget;
            navigator.clipboard.writeText(value);
            btn.textContent = 'Copied!';
            setTimeout(function () { btn.textContent = 'Copy'; }, 1500);
        });

        return newRow;
    }

    function detectLinkFormat() {
        var path = decodeURIComponent(window.location.pathname);
        if (/content editor\.aspx/i.test(path)) {
            return 'editor';
        }
        if (/content manager\/default\.aspx/i.test(path)) {
            return 'manager';
        }
        return null;
    }

    function buildLink(guid, format) {
        if (format === 'manager') {
            return '-/media/' + guid + '.ashx';
        }
        return '~/link.aspx?_id=' + guid + '&_z=z';
    }

    function enhanceTable(table) {
        if (table.dataset.quickInfoEnhanced === 'true') {
            return;
        }

        var format = detectLinkFormat();
        if (!format) {
            return;
        }

        var itemIdRow = findRowByLabel(table, /item id/i);
        if (!itemIdRow) {
            return;
        }

        var input = itemIdRow.querySelector('input');
        var guid = input ? normalizeGuid(input.value) : null;
        if (!guid) {
            return;
        }

        var link = buildLink(guid, format);
        var lastRow = insertRow(itemIdRow, 'Internal link:', link);

        if (format === 'manager' && isImageTemplate(table)) {
            var imgCode = '<img src="' + link + '" class="img-responsive" />';
            insertRow(lastRow, 'Responsive img:', imgCode);
        }

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
