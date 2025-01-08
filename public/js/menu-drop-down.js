{
    let hoverDropdownBox = document.querySelectorAll(".dropdown-box");

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

    window.addEventListener("click", function (e) {
        if (
            !e.target.closest(".dropdown-box") 
            &&
            !e.target.closest(".prevent-outside-click")
        ) {
            for (let i = 0; i < hoverDropdownBox.length; i++) {
                hoverDropdownShowBox[i]?.classList.add("d-none");
                hoverDropdownBox[i]?.classList.remove("active");
                headerPrevDropDown = undefined;
                prevHeader = undefined;
            }
        }
    });
}
