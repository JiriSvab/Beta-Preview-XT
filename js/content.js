var LINK_ACTIONS = {
    createPreviewLink: {
        urlType: 'preview',
        notFoundMessage: 'I dont know preview of this'
    },
    executeStagingLinkCode: {
        urlType: 'staging',
        notFoundMessage: 'I dont know Staging link of this'
    },
    executeLiveLinkCode: {
        urlType: 'live',
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
        sendResponse({ url: button_url });
    });
    return true;
});
