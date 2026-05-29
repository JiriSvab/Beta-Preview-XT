function sendToActiveTab(action) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(activeTabs) {
        chrome.tabs.sendMessage(activeTabs[0].id, { action: action }, function() {
            if (chrome.runtime.lastError) { /* no content script on this tab */ }
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
