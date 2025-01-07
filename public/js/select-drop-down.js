{
    function dropDownFun(selectWrapper) {
        var x, i, j, l, ll, selElmnt, a, b, c;
        x = selectWrapper;
        l = x.length;
        for (i = 0; i < l; i++) {
            let selectTtems = x[i].querySelector(".select-items");

            if (selectTtems) {
                selectTtems.remove();
            }

            let selectSelected = x[i].querySelector(".select-selected");

            if (selectSelected) {
                selectSelected.remove();
            }

            if (x[i].querySelector(".select-items") == null) {
                selElmnt = x[i].getElementsByTagName("select")[0];
                ll = selElmnt.length;
                a = document.createElement("DIV");
                a.setAttribute("class", "select-selected");

                a.innerHTML =
                    selElmnt.options[selElmnt.selectedIndex].innerHTML;
                x[i].appendChild(a);
                b = document.createElement("DIV");
                b.setAttribute("class", "select-items select-hide");
                for (j = 1; j < ll; j++) {
                    c = document.createElement("DIV");
                    c.innerHTML = selElmnt.options[j].innerHTML;
                    c.setAttribute("data-value", selElmnt.options[j].value);
                    c.removeAttribute("class");

                    if (selElmnt.value == selElmnt.options[j].value) {
                        c.setAttribute("class", "same-as-selected active");
                    }

                    c.addEventListener("click", function (e) {
                        var y, i, k, s, h, sl, yl;
                        s =
                            this.parentNode.parentNode.getElementsByTagName(
                                "select"
                            )[0];
                        sl = s.length;
                        h = this.parentNode.previousSibling;
                        for (i = 0; i < sl; i++) {
                            if (s.options[i].value == this.dataset["value"]) {
                                s.selectedIndex = i;
                                h.innerHTML = this.innerHTML;
                                y =
                                    this.parentNode.getElementsByClassName(
                                        "same-as-selected"
                                    );
                                yl = y.length;
                                for (k = 0; k < yl; k++) {
                                    y[k].removeAttribute("class");
                                }
                                this.setAttribute(
                                    "class",
                                    "same-as-selected active"
                                );
                                break;
                            }
                        }
                        h.click();
                    });
                    b.appendChild(c);
                }
                x[i].appendChild(b);
                a.addEventListener("click", function (e) {
                    closeControl(this);
                    this.nextSibling.classList.toggle("select-hide");
                    this.classList.toggle("select-arrow-active");
                });
            }
        }
    }

    function closeAllSelect(elmnt) {
        if (!elmnt.target.classList.contains("select-selected")) {
            closeControl(elmnt);
        }
    }

    function closeControl(elmnt) {
        var x,
            y,
            i,
            xl,
            yl,
            arrNo = [];
        x = document.getElementsByClassName("select-items");
        y = document.getElementsByClassName("select-selected");
        xl = x.length;
        yl = y.length;

        for (i = 0; i < yl; i++) {
            if (elmnt == y[i]) {
                arrNo.push(i);
            } else {
                y[i].classList.remove("select-arrow-active");
            }
        }

        for (i = 0; i < xl; i++) {
            if (arrNo.indexOf(i)) {
                x[i].classList.add("select-hide");
            }
        }
    }
    document.addEventListener("click", closeAllSelect);

    window.addEventListener("load", () => {
        let selectWrapper = document.querySelectorAll(".custom-select");
        dropDownFun(selectWrapper);
    });

    window.dropDownFun = dropDownFun;
}
