var SITECORE_LANGUAGE_CHECKBOX_SELECTOR = 'label.sc-checkbox input[type="checkbox"][value]';

function syncSitecoreLanguageCheckboxes(selectedCodes) {
    var wanted = new Set((selectedCodes || []).map(function(code) {
        return String(code).toLowerCase();
    }));
    var checkboxes = document.querySelectorAll(SITECORE_LANGUAGE_CHECKBOX_SELECTOR);

    checkboxes.forEach(function(checkbox) {
        var code = (checkbox.value || '').toLowerCase();
        var shouldBeChecked = wanted.has(code);
        if (checkbox.checked !== shouldBeChecked) {
            checkbox.click();
        }
    });

    return checkboxes.length;
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action !== 'syncSitecoreLanguages') return;

    var matchedCount = syncSitecoreLanguageCheckboxes(request.codes);
    sendResponse({ matchedCount: matchedCount });
});
