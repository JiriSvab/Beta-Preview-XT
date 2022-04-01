chrome.runtime.onMessage.addListener(function(request) {
    if(request.action === 'executeCode') {
        // Creation of Beta preview link
        var item_path = document.querySelector(".scEditorPanel > table > tbody > tr > td > table > tbody > tr:nth-child(3) > td:nth-child(2) > input").value;
        var regex_leica = /sitecore\/content\/hexagon\/hexagon-geosystems-brand\/hexagon-geosystems/;
        var regex_heavy = /sitecore\/content\/hexagon\/hexagon-geosystems-brand\/heavy-construction/;
        var regex_3DSurveillance = /sitecore\/content\/hexagon\/hexagon-geosystems-brand\/3DSurveillance/;

        if (regex_leica.test(item_path) == true) {
            var beta_prev = item_path.replace("/sitecore/content/hexagon/hexagon-geosystems-brand/hexagon-geosystems/home","https://beta9.leica-geosystems.com");
        } else if (regex_heavy.test(item_path) == true) {
            var beta_prev = item_path.replace("/sitecore/content/hexagon/hexagon-geosystems-brand/heavy-construction/Home","https://beta9-heavyconstruction.hexagon.com");
        } else if (regex_3DSurveillance.test(item_path) == true){
            item_path.replace("/sitecore/content/hexagon/hexagon-geosystems-brand/3DSurveillance/Home","https://beta9-3dsurveillance.hexagon.com");
        } else {
            var beta_prev = item_path.innerHTML = "I dont know beta preview of this";
        }

        function createLink() {
            var item_ID_row = document.querySelector(".scEditorPanel > table > tbody > tr > td > table > tbody > tr:nth-child(2) ");
            item_ID_row.insertAdjacentHTML('beforebegin', '<tr><td>Beta preview:</td><td><a href="'+beta_prev+'" target="_blank">'+beta_prev+'</a></td></tr>');
        };
        createLink();
    }
});
