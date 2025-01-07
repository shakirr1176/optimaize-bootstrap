{
    let hoverDropdownBox = document.querySelectorAll(".hover-dropdown-box");

    let hoverDropdownShowBox = document.querySelectorAll(
        ".dropdown-show-box"
    );

    let headerPrevDropDown = undefined;
    let prevHeader = undefined;

    hoverDropdownBox?.forEach(function (el, ind) {
        el?.addEventListener("click", function () {
            headerPrevDropDown?.classList.add("d-none");
            prevHeader?.classList.remove("active");

            if (headerPrevDropDown != hoverDropdownShowBox[ind]) {
                hoverDropdownShowBox[ind]?.classList.remove("d-none");
                el.classList.add("active");

                prevHeader = el;

                headerPrevDropDown = hoverDropdownShowBox[ind];
            } else {
                headerPrevDropDown = undefined;
            }
        });
    });

    let langs = document.querySelectorAll(".language");
    let angleStyleDiv = document.querySelector(".angle-down");
    let langName = document.querySelector(".langName");
    let countryFlag = document.querySelector(".country-flag");
    let isNotFirst = true;

    function langChange(el) {
        if (countryFlag) {
            countryFlag.innerHTML = "";
            if (el.querySelector(".drop-flag")) {
                countryFlag.innerHTML =
                    el.querySelector(".drop-flag").innerHTML;
                countryFlag.children[0].classList.add("rounded-full");
            }
        }
        if (langName) {
            langName.innerHTML = "";
            if (el.querySelector(".drop-lang-name")) {
                langName.innerHTML =
                    el.querySelector(".drop-lang-name").innerHTML;
            }
        }

        langs?.forEach((x) => {
            x?.classList.remove("active");
        });

        el?.classList.add("active");

        for (let i = 0; i < hoverDropdownShowBox.length; i++) {
            hoverDropdownShowBox[i]?.classList.add("d-none");
        }

        if (el === langs[0]) {
            isNotFirst = false;
            angleStyleDiv?.classList.add("lang-hover-style");
        } else {
            angleStyleDiv?.classList.remove("lang-hover-style");
            isNotFirst = true;
        }
    }

    window.addEventListener("load", () => {
        langs?.forEach((el) => {
            if (el.classList.contains("active")) {
                langChange(el);
            }
        });
    });

    langs?.forEach((el) => {
        el.addEventListener("click", () => {
            langChange(el);
        });
    });

    langs[0]?.addEventListener("mouseover", () => {
        angleStyleDiv?.classList.add("lang-hover-style");
    });

    langs[0]?.addEventListener("mouseleave", () => {
        if (isNotFirst) {
            angleStyleDiv?.classList.remove("lang-hover-style");
        }
    });

    window.addEventListener("click", function (e) {
        if (
            !e.target.classList.contains("hover-dropdown-box") &&
            !e.target.closest(".dropdown-show-box")
        ) {
            for (let i = 0; i < hoverDropdownBox.length; i++) {
                hoverDropdownShowBox[i]?.classList.add("d-none");
                hoverDropdownBox[i]?.classList.remove("active");
                headerPrevDropDown = undefined;
                prevHeader = undefined;
            }
        }
    });

    window.setLang = function (langs) {
        setCookie("lang", langs);

        const url = new URL(window.location.href);
        url.searchParams.set('lang', langs);
        window.location.href = url.toString();
    };


    function setCookie(name, value, days) {
        let date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        let expires = "expires=" + date.toUTCString();
        document.cookie =
            name + "=" + value + ";" + expires + ";SameSite=Lax;path=/";
    }
}
