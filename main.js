(function() {
    "use strict";

    var routes = {};
    var root = document.getElementById('root');

    var nav = document.createElement('nav');
    var content = document.createElement('main');

    root.appendChild(nav);
    root.appendChild(content);

    function router() {
        var urlParts = location.hash.split("/");
        var url = location.hash.slice(2) || '/';
        var param = urlParts[2] || '';

        renderRoute(url, param);
    }

    function registerRoute(url, name, pageRender) {
        routes[url] = {
            renderer: pageRender,
            name: name,
        };
    }

    function renderRoute(url, param) {
        if (routes[url] && routes[url]["renderer"]) {
            removeAllNodes(content);

            content.appendChild(routes[url]["renderer"](param));
        }
    }

    function renderNav() {
        removeAllNodes(nav);

        nav.appendChild(document.createElement("ul"));

        for (var route in routes) {
            if (routes.hasOwnProperty(route)) {
                var listItem = document.createElement("li");
                var link = document.createElement("a");

                link.href = "#!" + route;
                link.textContent = routes[route].name;
                listItem.appendChild(link);
                nav.appendChild(listItem);
            }
        }
    }

    function removeAllNodes(parent) {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }

    var renderHome = function () {
        var home = document.createElement("div");

        home.className = "home";

        var title = document.createElement("h1");

        title.textContent = "Me";

        home.appendChild(title);

        fetch("https://me-api.jsramverk.se")
        .then(function(response) {
            return response.json();
        })
        .then(function(result) {
            var textContainer = document.createElement("p");

            textContainer.textContent = result.description;

            home.appendChild(textContainer);
        });

        return home;
    };

    var renderReports = function (kmom) {
        var about = document.createElement("div");

        about.className = "about";

        var title = document.createElement("h2");

        title.textContent = kmom;

        about.appendChild(title);

        fetch("https://me-api.jsramverk.se/reports/" + kmom)
        .then(function(response) {
            return response.json();
        })
        .then(function(result) {
            result.data.map(function(question) {
                var questionContainer = document.createElement("div");

                questionContainer.className = "question";

                var questionContent = "<p><strong>";

                questionContent += "<p>" + question.question + "</p>";
                questionContent += "</strong></p>";
                questionContent += "<p>" + question.answer + "</p>";

                questionContainer.innerHTML = questionContent;

                about.appendChild(questionContainer);
            });
        });

        return about;
    };

    registerRoute("/", "Me", renderHome);
    registerRoute("/reports/kmom01", "kmom01", renderReports);

    renderNav();

    window.addEventListener('hashchange', router);
    window.addEventListener('load', router);
})();
