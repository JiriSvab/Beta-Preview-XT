document.getElementById('prev_button').addEventListener('click', function() {
    chrome.tabs.query({ active: true, currentWindow: true}, function(activeTabs) {
        chrome.tabs.sendMessage(activeTabs[0].id, { action: 'executeCode' });
    });
});

document.getElementById('live_button').addEventListener('click', function() {
    chrome.tabs.query({ active: true, currentWindow: true}, function(activeTabs) {
        chrome.tabs.sendMessage(activeTabs[0].id, { action: 'executeLiveLinkCode' });
    });
});

