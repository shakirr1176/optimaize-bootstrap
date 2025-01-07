{
    function tabFunc(headerParentID) {
        let headerParentElement = document.querySelector('#' + headerParentID);
        let tabContentParent = document.querySelector('#' + headerParentID + '-content');

        let tabButton = document.querySelectorAll(`#${headerParentID} .tabButton`);
        let allTab = document.querySelectorAll(`#${headerParentID}-content .tab`);

        function getCookie(name) {
            let cookieArr = document.cookie.split(';');
            for (let cookie of cookieArr) {
                let [key, value] = cookie.split('=');
                if (key.trim() === name) {
                    return decodeURIComponent(value);
                }
            }
            return null;
        }

        function setCookie(name, value, days) {
            let date = new Date();
            date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
            document.cookie = `${name}=${encodeURIComponent(value)};expires=${date.toUTCString()};path=/`;
        }

        let activeIndex = parseInt(getCookie(headerParentID + '-active-tab')) || 0;

        if (activeIndex < 0 || activeIndex >= tabButton.length) {
            activeIndex = 0;
        }

        headerParentElement.querySelector(".tabButton.active")?.classList.remove('active');
        tabContentParent.querySelector(".tab.active")?.classList.remove('active');

        tabButton[activeIndex]?.classList.add('active');
        allTab[activeIndex]?.classList.add('active');

        tabButton.forEach(function (el, ind) {
            el.addEventListener("click", function () {
                headerParentElement.querySelector(".tabButton.active")?.classList.remove('active');
                tabContentParent.querySelector(".tab.active")?.classList.remove('active');

                tabButton[ind]?.classList.add('active');
                allTab[ind]?.classList.add('active');

                setCookie(headerParentID + '-active-tab', ind, 7);
            });
        });
    }

    window.tabFunc = tabFunc;

}
