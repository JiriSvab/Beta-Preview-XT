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

    var item_path = document.querySelector(".scEditorPanel > table > tbody > tr > td > table > tbody > tr:nth-child(3) > td:nth-child(2) > input").value;
    var button_url = mapItemPathToUrl(item_path, linkAction.urlType);
    if (button_url === null) {
        button_url = linkAction.notFoundMessage;
    }

    loadLanguageMap().then(function(languageMap) {
        button_url = insertLocale(button_url, getLanguageLocale(languageMap));

        function createLink() {
            var item_ID_row = document.querySelector(".scEditorPanel > table > tbody > tr > td > table > tbody > tr:nth-child(2) ");
            item_ID_row.insertAdjacentHTML('beforebegin', '<tr><td>' + linkAction.label + '</td><td><a href="' + button_url + '" target="_blank">' + button_url + '</a> <button type="button" onclick="navigator.clipboard.writeText(\'' + button_url + '\');this.textContent=\'Copied!\';setTimeout(()=>this.textContent=\'Copy\',1500)" style="margin-left:8px;cursor:pointer;">Copy</button></td></tr>');
        };
        createLink();
        sendResponse({ url: button_url });
    });
    return true;
});
