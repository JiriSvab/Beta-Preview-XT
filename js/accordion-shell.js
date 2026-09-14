var AccordionShell = (function () {
    function create(options) {
        var container = document.getElementById(options.containerId);
        if (!container) {
            return null;
        }

        container.innerHTML = '';
        container.classList.add('accordion');

        var header = document.createElement('div');
        header.className = 'accordion-header';

        var title = document.createElement('span');
        title.className = 'accordion-title';
        title.textContent = options.title;

        var count = document.createElement('span');
        count.className = 'accordion-count';

        var chevron = document.createElement('span');
        chevron.className = 'accordion-chevron';
        chevron.textContent = '▾';

        header.appendChild(title);
        header.appendChild(count);
        header.appendChild(chevron);

        var body = document.createElement('div');
        body.className = 'accordion-body';
        body.hidden = true;

        header.addEventListener('click', function () {
            body.hidden = !body.hidden;
            container.classList.toggle('open', !body.hidden);
        });

        container.appendChild(header);
        container.appendChild(body);

        return {
            bodyEl: body,
            setCount: function (text) {
                count.textContent = text;
            }
        };
    }

    return { create: create };
})();
