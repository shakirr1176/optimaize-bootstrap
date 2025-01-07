{
    let tableOptionButton = document.querySelectorAll(".tableOptionButton");
    let optionModal = document.querySelectorAll(".optionModal");
    let prevHeader = "";
    function tableFunc() {
        tableOptionButton.forEach(function (el, ind) {
            el.addEventListener("click", function (ss) {
                if (prevHeader) {
                    prevHeader.nextElementSibling.classList.add("hidden");
                    prevHeader.classList.remove("active");
                }

                if (prevHeader !== tableOptionButton[ind]) {
                    tableOptionButton[ind].nextElementSibling.classList.remove(
                        "hidden"
                    );

                    tableOptionButton[ind].classList.add("active");

                    prevHeader = tableOptionButton[ind];
                } else {
                    prevHeader = "";
                }
            });
        });
    }

    window.addEventListener("click", function (e) {
        if (
            !e.target.closest(".tableOptionButton") &&
            !e.target.closest(".optionModal")
        ) {
            if (prevHeader != "") {
                closeModal();
            }
        }
    });

    function closeModal() {
        prevHeader.nextElementSibling.classList.add("hidden");
        prevHeader.classList.remove("active");
        prevHeader = "";
    }

    tableFunc();

    let addModalButton = document.querySelector(".addModalButton");
    let addModal = document.querySelector(".addModal");
    addModalButton?.addEventListener("click", function () {
        if (addModal) {
            addModal.classList.remove("hidden");
            addModal.children[0].setAttribute("data-form-type", "create");
            let form = addModal.children[0];
            setMultiSelectOptions(form);
        }
    });

    function setMultiSelectOptions(form) {
        let options;
        let multipleSelectFields = form.querySelectorAll("select[multiple]");
        if (multipleSelectFields.length) {
            multipleSelectFields.forEach((multipleSelectField) => {
                options = multipleSelectField.querySelectorAll("option");
                options?.forEach((option) => {
                    if (option.value === "-100") {
                        multipleSelectField.remove(option.index);
                    }
                });
                let oldElements = form.querySelectorAll(
                    ".multiselect-dropdown"
                );
                oldElements.forEach((oldElement) => {
                    oldElement.remove();
                });

                multipleSelectDropdownCall(); // it's used from multi-select-dropdown.js file
                return true;
            });
        }
    }

    window.addEventListener("click", (e) => {
        if (
            !e.target.classList.contains("filter-btn") &&
            !e.target.closest(".filter-field")
        ) {
            filterField?.classList.add("hidden");
        }
        
        if (e.target.classList.contains("closeButton")) {
            resetErrorMessages(e.target.closest(".modalForm"));
            e.target
                .closest(".modalForm")
                .parentElement.classList.add("hidden");
            e.target.closest(".modalForm").reset();
        }

        if (e.target.classList.contains("editModalButton")) {
            e.preventDefault();
            let editModal = document.querySelector(".editModal");
            editModal?.classList.remove("hidden");
            editModal?.children[0].setAttribute("data-form-type", "update");
        }
    });

    let filterField = document.querySelector(".filter-field");
    let filterBtn = document.querySelector(".filter-btn");

    filterBtn?.addEventListener("click", () => {
        filterField.classList.toggle("hidden");
    });

    let downloadBtn = document.querySelector(".download-btn");
    let downloadDrop = document.querySelector(".download-drop");
    downloadBtn?.addEventListener("click", function () {
        downloadDrop?.classList.toggle("hidden");
    });

    let download = document.querySelectorAll(".download");
    download?.forEach(function (el, ind) {
        el.addEventListener("click", function (e) {
            e.preventDefault();
            let url = e.target.getAttribute("href");
            if (url) {
                fetch(url, {
                    method: "GET",
                    headers: {
                        accept: "application/json",
                        "Content-Type": "application/json",
                    },
                })
                    .then((response) => response.json())
                    .then((data) => {
                        if (data.file && data.name) {
                            var a = document.createElement("a");
                            a.href = data.file;
                            a.download = data.name;
                            document.body.appendChild(a);
                            a.click();
                            a.remove();
                        }
                    })
                    .catch((error) => {
                        console.error("Error:", error);
                    });
            }
        });
    });

    window.addEventListener("click", (e) => {
        if (
            !e.target.classList.contains("download-btn") &&
            !e.target.closest(".download-drop")
        ) {
            downloadDrop?.classList.add("hidden");
        }
    });

    // search
    let searchYield = document.querySelector(".search-yield");

    let laraInputSearch = searchYield?.querySelector(".lara-input-search");
    let searchCancelBtn = searchYield?.querySelector(".search-cancel-btn");

    let searchHiddenInput = searchYield?.querySelector(
        ".search-hidden-input-1"
    );
    let searchHiddenInput2 = searchYield?.querySelector(
        ".search-hidden-input-2"
    );

    let selectedText = searchYield?.querySelector(".selected-text-1");
    let selectedText2 = searchYield?.querySelector(".selected-text-2");
    let selectedText3 = searchYield?.querySelector(".selected-text-3");

    let filterSearchOption = searchYield?.querySelector(
        ".filter-search-option-1"
    );

    let filterSearchOption2 = searchYield?.querySelector(
        ".filter-search-option-2"
    );

    let filterSearchOption3 = searchYield?.querySelector(
        ".filter-search-option-3"
    );


    filterDrop(searchHiddenInput, filterSearchOption, selectedText);
    filterDrop(searchHiddenInput2, filterSearchOption2, selectedText2);
    filterDrop(null, filterSearchOption3, selectedText3);

    function filterDrop(hiddenInput, option, slctedext) {
        option?.addEventListener("click", (e) => {
            if (e.target.closest(".drop-down-list")) {
                let li = e.target.closest(".drop-down-list");

                let liParent = e.target.closest(".optionModal");
                if (!li) return;

                let buttonValue = li.dataset.value;

                    if (hiddenInput) {
                        hiddenInput.value = buttonValue;
                    }

                    let prevSlected = slctedext.innerText;

                    slctedext.innerText = li.innerText;

                    if (slctedext.classList.contains('per-page-selected')) {
                        let prefix = prevSlected.split(' ')[0];
                        slctedext.innerText = prefix + ' ' + li.innerText;

                        let pageName = option.dataset["pagename"];

                        let inputUrl = new URL(window.location);
                        let inputParams = new URLSearchParams(inputUrl.search);

                        inputParams.set(pageName + "-per-page", buttonValue);
                        window.location.search = inputParams;
                    }

                    closeModal();

                    if (liParent) {
                        let prevActive = liParent.querySelector(".active");
                        prevActive?.classList.remove("active");
                    }

                    li.classList.add("active");
            }
        });

        window.addEventListener("load", () => {
            if (option && hiddenInput) {
                let activeLi = option.querySelector(
                    `.drop-down-list[data-value~='${hiddenInput.value}']`
                );

                if (activeLi) {
                    activeLi.classList.add("active");
                    if (slctedext) {
                        slctedext.innerHTML = activeLi.innerHTML;
                    }
                } else {
                    let firstLi = option.querySelector(`.drop-down-list`);
                    if (firstLi) {
                        firstLi.classList.add("active");

                        hiddenInput.value = firstLi.dataset["value"];
                        slctedext.innerHTML = firstLi.innerHTML;
                    }
                }
            }
        });
    }

    window.addEventListener("load", () => {
        if (laraInputSearch?.value == "") {
            searchCancelBtn?.classList.add("hidden");
        } else {
            searchCancelBtn?.classList.remove("hidden");
        }
    });

    laraInputSearch?.addEventListener("input", function () {
        if (this.value == "") {
            searchCancelBtn?.classList.add("hidden");
        } else {
            searchCancelBtn?.classList.remove("hidden");
        }
    });

    searchCancelBtn?.addEventListener("click", function (e) {
        laraInputSearch.value = "";
        this.classList?.add("hidden");
    });






    let responsiveTable = document.querySelector(".responsive-table");
    responsiveTable?.addEventListener("click", (e) => {
        if (e.target.closest(".tableDropBtn")) {
            let showBtn = e.target.closest(".tableDropBtn");
            createRow(showBtn);
        }
    });

    function createRow(btn) {
        let thisRow = btn.closest("tr");
        let hiddenColumnsCon = thisRow.querySelector(".hidder-column");

        thisRow.classList.toggle("parent");

        btn.children[1].classList.toggle("hidden");
        btn.children[0].classList.toggle("hidden");

        let newRow = document.createElement("tr");
        newRow.className = "child whitespace-normal";

        if (thisRow.classList.contains("parent")) {
            newRow.innerHTML =
                '<td class="py-1 bg-light-body/70 dark:bg-lara-primary text-left text-lara-gray-400 dark:text-white rounded-full" style="border-radius:14px">' +
                hiddenColumnsCon.innerHTML +
                "</td>";
            thisRow.insertAdjacentElement("afterEnd", newRow);
            newRow.children[0].setAttribute("colspan", thisRow.children.length);
        } else {
            thisRow.nextElementSibling.remove();
        }
    }
}
