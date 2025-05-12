chrome.runtime.onMessage.addListener(function(request) {
    if(request.action === 'executeCode') {
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

        function createLink() {
            var item_ID_row = document.querySelector(".scEditorPanel > table > tbody > tr > td > table > tbody > tr:nth-child(2) ");
            item_ID_row.insertAdjacentHTML('beforebegin', '<tr><td>Preview:</td><td><a href="'+prev_button+'" target="_blank">'+prev_button+'</a></td></tr>');
        };
        createLink();
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

        function createLink() {
            var item_ID_row = document.querySelector(".scEditorPanel > table > tbody > tr > td > table > tbody > tr:nth-child(2) ");
            item_ID_row.insertAdjacentHTML('beforebegin', '<tr><td>Live: </td><td><a href="'+live_button+'" target="_blank">'+live_button+'</a></td></tr>');
        };
        createLink();
    }
});
