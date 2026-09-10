var languageMapCache = null;

function loadLanguageMap() {
    if (languageMapCache) {
        return Promise.resolve(languageMapCache);
    }
    return fetch(chrome.runtime.getURL('js/languages.json'))
        .then(function(response) { return response.json(); })
        .then(function(data) { languageMapCache = data; return data; })
        .catch(function() { return {}; });
}

function getLanguageLocale(languageMap) {
    var langEl = document.querySelector('.scEditorHeaderVersionsLanguage');
    if (!langEl) return '';
    var title = langEl.getAttribute('title') || '';
    var languageName = title.split(':')[0].trim();
    return languageMap[languageName] || '';
}

function insertLocale(url, locale) {
    if (!locale || typeof url !== 'string') return url;
    return url.replace(/^(https?:\/\/[^\/]+)(\/.*)?$/, function(match, domain, path) {
        return domain + '/' + locale + (path || '');
    });
}
