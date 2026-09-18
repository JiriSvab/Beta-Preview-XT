var QuickInfoUtils = (function () {
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

    function findRowByInputValue(table, valuePattern) {
        var rows = table.querySelectorAll('tr');
        for (var i = 0; i < rows.length; i++) {
            var input = rows[i].querySelector('input');
            if (input && valuePattern.test(input.value)) {
                return rows[i];
            }
        }
        return null;
    }

    function findItemPathRow(table) {
        return findRowByLabel(table, /path/i) || findRowByInputValue(table, /^\/sitecore\//i);
    }

    function getQuickInfoTable() {
        return document.querySelector('.scEditorQuickInfo');
    }

    function getEditorPanelTable() {
        return document.querySelector('.scEditorPanel > table > tbody > tr > td > table');
    }

    return {
        findRowByLabel: findRowByLabel,
        findRowByInputValue: findRowByInputValue,
        findItemPathRow: findItemPathRow,
        getQuickInfoTable: getQuickInfoTable,
        getEditorPanelTable: getEditorPanelTable
    };
})();
