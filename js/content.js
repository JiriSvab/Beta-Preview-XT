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

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if(request.action === 'createPreviewLink') {
        // Creation of Beta preview link
        var item_path = document.querySelector(".scEditorPanel > table > tbody > tr > td > table > tbody > tr:nth-child(3) > td:nth-child(2) > input").value;
        var regex_leica = /sitecore\/content\/hexagon\/hexagon-geosystems-brand\/hexagon-geosystems/;
        var regex_heavy = /sitecore\/content\/hexagon\/hexagon-geosystems-brand\/heavy-construction/;
        var regex_3DSurveillance = /sitecore\/content\/hexagon\/hexagon-geosystems-brand\/3DSurveillance/;
        var regex_geomax = /sitecore\/content\/hexagon\/hexagon-geosystems-brand\/hexagon-geomax\/home/;
        var regex_hxgncontent = /sitecore\/content\/hexagon\/hexagon-geosystems-brand\/hxgn-content-program\/home/;
        var regex_hxgnsmartnet = /sitecore\/content\/hexagon\/hexagon-geosystems-brand\/smartnet\/home/;
        var regex_idsgeoradar = /sitecore\/content\/hexagon\/hexagon-geosystems-brand\/ids-georadar\/home/;
        var regex_OneWeb_master = /sitecore\/content\/One Web\/Master Site\/Home/;

        if (regex_leica.test(item_path) == true) {
            var prev_button = item_path.replace("/sitecore/content/hexagon/hexagon-geosystems-brand/hexagon-geosystems/home","https://preview.leica-geosystems.com");
        } else if (regex_heavy.test(item_path) == true) {
            var prev_button = item_path.replace("/sitecore/content/hexagon/hexagon-geosystems-brand/heavy-construction/Home","https://preview-heavyconstruction.hexagon.com");
        } else if (regex_3DSurveillance.test(item_path) == true){
            var prev_button = item_path.replace("/sitecore/content/hexagon/hexagon-geosystems-brand/3DSurveillance/Home","https://preview-3dsurveillance.hexagon.com");
        } else if (regex_geomax.test(item_path) == true) {
            var prev_button = item_path.replace("/sitecore/content/hexagon/hexagon-geosystems-brand/hexagon-geomax/home","https://preview.geomax-positioning.com");
        } else if (regex_hxgncontent.test(item_path) == true) {
            var prev_button = item_path.replace("/sitecore/content/hexagon/hexagon-geosystems-brand/hxgn-content-program/home","https://preview.hxgncontent.com");
        } else if (regex_hxgnsmartnet.test(item_path) == true) {
            var prev_button = item_path.replace("/sitecore/content/hexagon/hexagon-geosystems-brand/smartnet/home","https://preview.hxgnsmartnet.com");
        } else if (regex_idsgeoradar.test(item_path) == true) {
            var prev_button = item_path.replace("/sitecore/content/hexagon/hexagon-geosystems-brand/ids-georadar/home","https://preview.idsgeoradar.com");
        } else if (regex_OneWeb_master.test(item_path) == true) {
            var prev_button = item_path.replace("/sitecore/content/One Web/Master Site/Home","https://www.hexagon.com");
        }  else {
            var prev_button = item_path.innerHTML = "I dont know preview of this";
        }

        loadLanguageMap().then(function(languageMap) {
            prev_button = insertLocale(prev_button, getLanguageLocale(languageMap));

            function createLink() {
                var item_ID_row = document.querySelector(".scEditorPanel > table > tbody > tr > td > table > tbody > tr:nth-child(2) ");
                item_ID_row.insertAdjacentHTML('beforebegin', '<tr><td>Preview:</td><td><a href="'+prev_button+'" target="_blank">'+prev_button+'</a> <button type="button" onclick="navigator.clipboard.writeText(\''+prev_button+'\');this.textContent=\'Copied!\';setTimeout(()=>this.textContent=\'Copy\',1500)" style="margin-left:8px;cursor:pointer;">Copy</button></td></tr>');
            };
            createLink();
            sendResponse({ url: prev_button });
        });
        return true;
    }

    if(request.action === 'executeStagingLinkCode') {
        // Creation of Staging link
        var item_path = document.querySelector(".scEditorPanel > table > tbody > tr > td > table > tbody > tr:nth-child(3) > td:nth-child(2) > input").value;
        var regex_leica = /sitecore\/content\/hexagon\/hexagon-geosystems-brand\/hexagon-geosystems/;
        var regex_heavy = /sitecore\/content\/hexagon\/hexagon-geosystems-brand\/heavy-construction/;
        var regex_3DSurveillance = /sitecore\/content\/hexagon\/hexagon-geosystems-brand\/3DSurveillance/;
        var regex_geomax = /sitecore\/content\/hexagon\/hexagon-geosystems-brand\/hexagon-geomax\/home/;
        var regex_hxgncontent = /sitecore\/content\/hexagon\/hexagon-geosystems-brand\/hxgn-content-program\/home/;
        var regex_hxgnsmartnet = /sitecore\/content\/hexagon\/hexagon-geosystems-brand\/smartnet\/home/;
        var regex_idsgeoradar = /sitecore\/content\/hexagon\/hexagon-geosystems-brand\/ids-georadar\/home/;
        var regex_OneWeb_master = /sitecore\/content\/One Web\/Master Site\/Home/;

        if (regex_leica.test(item_path) == true) {
            var staging_button = item_path.replace("/sitecore/content/hexagon/hexagon-geosystems-brand/hexagon-geosystems/home","https://staging.leica-geosystems.com");
        } else if (regex_heavy.test(item_path) == true) {
            var staging_button = item_path.replace("/sitecore/content/hexagon/hexagon-geosystems-brand/heavy-construction/Home","https://staging-heavyconstruction.hexagon.com");
        } else if (regex_3DSurveillance.test(item_path) == true){
            var staging_button = item_path.replace("/sitecore/content/hexagon/hexagon-geosystems-brand/3DSurveillance/Home","https://staging-3dsurveillance.hexagon.com");
        } else if (regex_geomax.test(item_path) == true) {
            var staging_button = item_path.replace("/sitecore/content/hexagon/hexagon-geosystems-brand/hexagon-geomax/home","https://staging.geomax-positioning.com");
        } else if (regex_hxgncontent.test(item_path) == true) {
            var staging_button = item_path.replace("/sitecore/content/hexagon/hexagon-geosystems-brand/hxgn-content-program/home","https://staging.hxgncontent.com");
        } else if (regex_hxgnsmartnet.test(item_path) == true) {
            var staging_button = item_path.replace("/sitecore/content/hexagon/hexagon-geosystems-brand/smartnet/home","https://staging.hxgnsmartnet.com");
        } else if (regex_idsgeoradar.test(item_path) == true) {
            var staging_button = item_path.replace("/sitecore/content/hexagon/hexagon-geosystems-brand/ids-georadar/home","https://staging.idsgeoradar.com");
        } else if (regex_OneWeb_master.test(item_path) == true) {
            var staging_button = item_path.replace("/sitecore/content/One Web/Master Site/Home","https://staging.hexagon.com");
        }  else {
            var staging_button = item_path.innerHTML = "I dont know Staging link of this";
        }

        loadLanguageMap().then(function(languageMap) {
            staging_button = insertLocale(staging_button, getLanguageLocale(languageMap));

            function createLink() {
                var item_ID_row = document.querySelector(".scEditorPanel > table > tbody > tr > td > table > tbody > tr:nth-child(2) ");
                item_ID_row.insertAdjacentHTML('beforebegin', '<tr><td>Staging: </td><td><a href="'+staging_button+'" target="_blank">'+staging_button+'</a> <button type="button" onclick="navigator.clipboard.writeText(\''+staging_button+'\');this.textContent=\'Copied!\';setTimeout(()=>this.textContent=\'Copy\',1500)" style="margin-left:8px;cursor:pointer;">Copy</button></td></tr>');
            };
            createLink();
            sendResponse({ url: staging_button });
        });
        return true;
    }

    if(request.action === 'executeLiveLinkCode') {
        // Creation of Live link
        var item_path = document.querySelector(".scEditorPanel > table > tbody > tr > td > table > tbody > tr:nth-child(3) > td:nth-child(2) > input").value;
        var regex_leica = /sitecore\/content\/hexagon\/hexagon-geosystems-brand\/hexagon-geosystems/;
        var regex_heavy = /sitecore\/content\/hexagon\/hexagon-geosystems-brand\/heavy-construction/;
        var regex_3DSurveillance = /sitecore\/content\/hexagon\/hexagon-geosystems-brand\/3DSurveillance/;
        var regex_geomax = /sitecore\/content\/hexagon\/hexagon-geosystems-brand\/hexagon-geomax\/home/;
        var regex_hxgncontent = /sitecore\/content\/hexagon\/hexagon-geosystems-brand\/hxgn-content-program\/home/;
        var regex_hxgnsmartnet = /sitecore\/content\/hexagon\/hexagon-geosystems-brand\/smartnet\/home/;
        var regex_idsgeoradar = /sitecore\/content\/hexagon\/hexagon-geosystems-brand\/ids-georadar\/home/;
        var regex_OneWeb_master = /sitecore\/content\/One Web\/Master Site\/Home/;

        if (regex_leica.test(item_path) == true) {
            var live_button = item_path.replace("/sitecore/content/hexagon/hexagon-geosystems-brand/hexagon-geosystems/home","https://leica-geosystems.com");
        } else if (regex_heavy.test(item_path) == true) {
            var live_button = item_path.replace("/sitecore/content/hexagon/hexagon-geosystems-brand/heavy-construction/Home","https://heavyconstruction.hexagon.com");
        } else if (regex_3DSurveillance.test(item_path) == true){
            var live_button = item_path.replace("/sitecore/content/hexagon/hexagon-geosystems-brand/3DSurveillance/Home","https://3dsurveillance.hexagon.com");
        } else if (regex_geomax.test(item_path) == true) {
            var live_button = item_path.replace("/sitecore/content/hexagon/hexagon-geosystems-brand/hexagon-geomax/home","https://geomax-positioning.com");
        } else if (regex_hxgncontent.test(item_path) == true) {
            var live_button = item_path.replace("/sitecore/content/hexagon/hexagon-geosystems-brand/hxgn-content-program/home","https://hxgncontent.com");
        } else if (regex_hxgnsmartnet.test(item_path) == true) {
            var live_button = item_path.replace("/sitecore/content/hexagon/hexagon-geosystems-brand/smartnet/home","https://hxgnsmartnet.com");
        } else if (regex_idsgeoradar.test(item_path) == true) {
            var live_button = item_path.replace("/sitecore/content/hexagon/hexagon-geosystems-brand/ids-georadar/home","https://idsgeoradar.com");
        } else if (regex_OneWeb_master.test(item_path) == true) {
            var live_button = item_path.replace("/sitecore/content/One Web/Master Site/Home","https://www.hexagon.com");
        }  else {
            var live_button = item_path.innerHTML = "I dont know Live link of this";
        }

        loadLanguageMap().then(function(languageMap) {
            live_button = insertLocale(live_button, getLanguageLocale(languageMap));

            function createLink() {
                var item_ID_row = document.querySelector(".scEditorPanel > table > tbody > tr > td > table > tbody > tr:nth-child(2) ");
                item_ID_row.insertAdjacentHTML('beforebegin', '<tr><td>Live: </td><td><a href="'+live_button+'" target="_blank">'+live_button+'</a> <button type="button" onclick="navigator.clipboard.writeText(\''+live_button+'\');this.textContent=\'Copied!\';setTimeout(()=>this.textContent=\'Copy\',1500)" style="margin-left:8px;cursor:pointer;">Copy</button></td></tr>');
            };
            createLink();
            sendResponse({ url: live_button });
        });
        return true;
    }
});
