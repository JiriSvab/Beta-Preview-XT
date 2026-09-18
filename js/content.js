var LINK_ACTIONS = {
    createPreviewLink: {
        urlType: 'preview',
        label: 'Preview:',
        notFoundMessage: 'I dont know preview of this'
    },
    executeStagingLinkCode: {
        urlType: 'staging',
        label: 'Staging: ',
        notFoundMessage: 'I dont know Staging link of this'
    },
    executeLiveLinkCode: {
        urlType: 'live',
        label: 'Live: ',
        notFoundMessage: 'I dont know Live link of this'
    }
};

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    var linkAction = LINK_ACTIONS[request.action];
    if (!linkAction) return;

    var table = QuickInfoUtils.getEditorPanelTable();
    if (!table) {
        console.warn('[Beta Preview XT] Could not find the Quick Info panel table.');
        return;
    }

    var pathRow = QuickInfoUtils.findItemPathRow(table);
    var pathInput = pathRow ? pathRow.querySelector('input') : null;
    var item_path = pathInput ? pathInput.value : '';

    if (!item_path) {
        console.warn('[Beta Preview XT] Could not find the item path row in the Quick Info panel.', table);
    }

    var button_url = mapItemPathToUrl(item_path, linkAction.urlType);
    if (button_url === null) {
        console.warn('[Beta Preview XT] Item path did not match any site mapping:', item_path);
        button_url = linkAction.notFoundMessage;
    }

    loadLanguageMap().then(function(languageMap) {
        button_url = insertLocale(button_url, getLanguageLocale(languageMap));

        function createLink() {
            var item_ID_row = QuickInfoUtils.findRowByLabel(table, /item id/i);
            if (!item_ID_row) return;
            item_ID_row.insertAdjacentHTML('beforebegin', '<tr><td>' + linkAction.label + '</td><td><a href="' + button_url + '" target="_blank">' + button_url + '</a> <button type="button" onclick="navigator.clipboard.writeText(\'' + button_url + '\');this.textContent=\'Copied!\';setTimeout(()=>this.textContent=\'Copy\',1500)" style="margin-left:8px;cursor:pointer;">Copy</button></td></tr>');
        };
        createLink();
        sendResponse({ url: button_url });
    });
    return true;
});
