function sendToActiveTab(action) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(activeTabs) {
        chrome.tabs.sendMessage(activeTabs[0].id, { action: action }, function(response) {
            if (chrome.runtime.lastError) { return; }
            if (response && response.url && response.url.startsWith('https://')) {
                chrome.tabs.create({ url: response.url });
            }
        });
    });
}

document.getElementById('staging_button').addEventListener('click', function() {
    sendToActiveTab('executeStagingLinkCode');
});

document.getElementById('prev_button').addEventListener('click', function() {
    sendToActiveTab('createPreviewLink');
});

document.getElementById('live_button').addEventListener('click', function() {
    sendToActiveTab('executeLiveLinkCode');
});
