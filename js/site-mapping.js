var SITE_MAPPINGS = [
    {
        regex: /sitecore\/content\/hexagon\/hexagon-geosystems-brand\/hexagon-geosystems/,
        basePath: "/sitecore/content/hexagon/hexagon-geosystems-brand/hexagon-geosystems/home",
        urls: {
            preview: "https://preview.leica-geosystems.com",
            staging: "https://staging.leica-geosystems.com",
            live: "https://leica-geosystems.com"
        }
    },
    {
        regex: /sitecore\/content\/hexagon\/hexagon-geosystems-brand\/heavy-construction/,
        basePath: "/sitecore/content/hexagon/hexagon-geosystems-brand/heavy-construction/Home",
        urls: {
            preview: "https://preview-heavyconstruction.hexagon.com",
            staging: "https://staging-heavyconstruction.hexagon.com",
            live: "https://heavyconstruction.hexagon.com"
        }
    },
    {
        regex: /sitecore\/content\/hexagon\/hexagon-geosystems-brand\/3DSurveillance/,
        basePath: "/sitecore/content/hexagon/hexagon-geosystems-brand/3DSurveillance/Home",
        urls: {
            preview: "https://preview-3dsurveillance.hexagon.com",
            staging: "https://staging-3dsurveillance.hexagon.com",
            live: "https://3dsurveillance.hexagon.com"
        }
    },
    {
        regex: /sitecore\/content\/hexagon\/hexagon-geosystems-brand\/hexagon-geomax\/home/,
        basePath: "/sitecore/content/hexagon/hexagon-geosystems-brand/hexagon-geomax/home",
        urls: {
            preview: "https://preview.geomax-positioning.com",
            staging: "https://staging.geomax-positioning.com",
            live: "https://geomax-positioning.com"
        }
    },
    {
        regex: /sitecore\/content\/hexagon\/hexagon-geosystems-brand\/hxgn-content-program\/home/,
        basePath: "/sitecore/content/hexagon/hexagon-geosystems-brand/hxgn-content-program/home",
        urls: {
            preview: "https://preview.hxgncontent.com",
            staging: "https://staging.hxgncontent.com",
            live: "https://hxgncontent.com"
        }
    },
    {
        regex: /sitecore\/content\/hexagon\/hexagon-geosystems-brand\/smartnet\/home/,
        basePath: "/sitecore/content/hexagon/hexagon-geosystems-brand/smartnet/home",
        urls: {
            preview: "https://preview.hxgnsmartnet.com",
            staging: "https://staging.hxgnsmartnet.com",
            live: "https://hxgnsmartnet.com"
        }
    },
    {
        regex: /sitecore\/content\/hexagon\/hexagon-geosystems-brand\/ids-georadar\/home/,
        basePath: "/sitecore/content/hexagon/hexagon-geosystems-brand/ids-georadar/home",
        urls: {
            preview: "https://preview.idsgeoradar.com",
            staging: "https://staging.idsgeoradar.com",
            live: "https://idsgeoradar.com"
        }
    },
    {
        regex: /sitecore\/content\/One Web\/Master Site\/Home/,
        basePath: "/sitecore/content/One Web/Master Site/Home",
        urls: {
            preview: "https://www.hexagon.com",
            staging: "https://staging.hexagon.com",
            live: "https://www.hexagon.com"
        }
    }
];

function mapItemPathToUrl(itemPath, urlType) {
    for (var i = 0; i < SITE_MAPPINGS.length; i++) {
        var site = SITE_MAPPINGS[i];
        if (site.regex.test(itemPath) === true) {
            return itemPath.replace(site.basePath, site.urls[urlType]);
        }
    }
    return null;
}
