{
    // ===============
    //  start advance
    // ===============
    let filterButtons = document.querySelectorAll(".filter-button");
    filterButtons.forEach(function (item) {
        let getAdvFilter = item.closest(".filter-container").children[1];
        getAdvFilter
            .closest(".filter-container")
            .children[1].setAttribute("data-height", getAdvFilter.scrollHeight);
        if (!getAdvFilter.classList.contains("max-h-0")) {
            getAdvFilter.style.maxHeight = `${getAdvFilter.scrollHeight}px`;
        }
        item.addEventListener("click", function () {
            if (!getAdvFilter.classList.contains("max-h-0")) {
                getAdvFilter.classList.add("max-h-0");
            }
            let getDataHeight = getAdvFilter.getAttribute("data-height");
            if (
                getAdvFilter.style.maxHeight === "0px" ||
                getAdvFilter.style.maxHeight == ""
            ) {
                getAdvFilter.style.maxHeight = `${getDataHeight}px`;
            } else {
                getAdvFilter.style.maxHeight = "0";
            }
        });
    });
    // ===============
    //  end advance
    // ===============

    // ===============
    //  start collapsible
    // ===============
    let coll = document.querySelectorAll(".collapsible");
    let prevColl = "";
    coll.forEach(function (item) {
        item.nextElementSibling.setAttribute(
            "data-height",
            item.nextElementSibling.scrollHeight
        );
        if (item.classList.contains("lf-active")) {
            prevColl = item;
            item.nextElementSibling.style.maxHeight = `${item.nextElementSibling.scrollHeight}px`;
        }
        item.addEventListener("click", function () {
            let getDataHeight =
                this.nextElementSibling.getAttribute("data-height");
            if (prevColl === this) {
                this.classList.remove("lf-active");
                this.lastElementChild.classList.remove("rotate-180");
                this.nextElementSibling.style.maxHeight = "0";
                prevColl = "";
            } else {
                if (prevColl !== "") {
                    prevColl.classList.remove("lf-active");
                    prevColl.lastElementChild.classList.remove("rotate-180");
                    prevColl.nextElementSibling.style.maxHeight = "0";
                }
                prevColl = this;
                this.classList.add("lf-active");
                this.nextElementSibling.style.maxHeight = `${getDataHeight}px`;
                this.lastElementChild.classList.add("rotate-180");
            }
        });
    });
    // ===============
    //  end collapsible
    // ===============

    // ===============
    //  start dropdown
    // ===============
    let getDropdownItem = document.querySelectorAll(".dropdown-click-item");
    let prevDropdown = "";
    getDropdownItem.forEach(function (item) {
        item.addEventListener("click", function () {
            if (item === prevDropdown) {
                item.nextElementSibling.classList.add("hidden");
                prevDropdown = "";
            } else {
                if (prevDropdown !== "") {
                    prevDropdown.nextElementSibling.classList.add("hidden");
                }
                item.nextElementSibling.classList.remove("hidden");
                prevDropdown = item;
            }
        });
    });
    // ===============
    //  end dropdown
    // ===============

    // ===============
    //  start modal
    // ===============
    let getModalShowButton = document.querySelectorAll(".modal-show-button");
    let getModalCloseButton = document.querySelectorAll(".modal-close-button");
    getModalShowButton.forEach(function (item) {
        item.addEventListener("click", function () {
            let getItemModal = item.getAttribute("data-modal-target-id");
            document.getElementById(getItemModal).classList.remove("hidden");
        });
    });
    getModalCloseButton.forEach(function (item) {
        item.addEventListener("click", function () {
            item.closest(".modal-box").classList.add("hidden");
        });
    });
    // ===============
    //  end modal
    // ===============

    document.addEventListener("click", function (event) {
        // for sidebar
        if (!event.target.closest(".menu-sidebar-item")) {
            document.querySelectorAll(".sub-sidebar-menu").forEach((e) => {
                e.classList.remove("-ml-92");
                e.classList.add("-ml-92");
            });
        }
        // for dropdown
        let clickDropdownButton = event.target.closest(".dropdown-click-item");
        let dropdownButtonBox = event.target.closest(".dropdown-menu");
        if (!clickDropdownButton && !dropdownButtonBox) {
            prevDropdown = "";
            document
                .querySelectorAll(".dropdown-menu")
                .forEach(function (event) {
                    event.classList.add("hidden");
                });
        }
        // for modal
        let getShowButton = event.target.closest(".modal-show-button");
        let getShowModalContent = event.target.closest(".modal-content");
        if (!getShowButton && !getShowModalContent) {
            document.querySelectorAll(".modal-box").forEach(function (event) {
                event.classList.add("hidden");
            });
        }
    });

    // imgage upload
    let getFileUpload = document.querySelectorAll(".image-select");
    getFileUpload.forEach((item) => {
        item.addEventListener("click", () => {
            imageUploadFunc(item);
        });
    });

    function imageUploadFunc(item) {
        let getItemInput = item.nextElementSibling.nextElementSibling;
        getItemInput.click();
        getItemInput.addEventListener("change", () => {
            item.classList.add("hidden");
            item.nextElementSibling.classList.remove("hidden");
            item.parentElement.previousElementSibling.classList.remove(
                "hidden"
            );
            item.parentElement.previousElementSibling.previousElementSibling.classList.add(
                "hidden"
            );
            handleFiles(getItemInput.files, item);
            item.nextElementSibling.addEventListener("click", () => {
                imageUploadFunc(item);
            });
            item.nextElementSibling.nextElementSibling.nextElementSibling.classList.remove(
                "hidden"
            );
            item.nextElementSibling.nextElementSibling.nextElementSibling.addEventListener(
                "click",
                () => {
                    item.classList.remove("hidden");
                    item.nextElementSibling.classList.add("hidden");
                    item.nextElementSibling.nextElementSibling.nextElementSibling.classList.add(
                        "hidden"
                    );
                    item.parentElement.previousElementSibling.classList.add(
                        "hidden"
                    );
                    item.parentElement.previousElementSibling.previousElementSibling.classList.remove(
                        "hidden"
                    );
                }
            );
        });
    }

    function handleFiles(files, item) {
        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            if (!file.type.startsWith("image/")) {
                continue;
            }
            let img = item.parentElement.previousElementSibling.children[0];
            let reader = new FileReader();
            reader.onload = (function (aImg) {
                return function (e) {
                    aImg.src = e.target.result;
                };
            })(img);
            reader.readAsDataURL(file);
        }
    }

    /* -------------------------------------------
::::::: Start Flash Box :::::::
------------------------------------------- */
    const flashMessageStyle = {
        error: {
            icon: "&#10005;",
            borderClass: ["w-20", "h-20", "border-danger"],
            iconTextClass: ["text-danger"],
            messageTextClass: ["mt-8", "text-danger"],
        },
        success: {
            icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-10 h-10">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
      </svg>`,
            borderClass: ["w-20", "h-20", "border-success"],
            iconTextClass: ["text-success"],
            messageTextClass: ["mt-8", "text-success"],
        },
        warning: {
            icon: "!",
            borderClass: ["w-20", "h-20", "border-warning"],
            iconTextClass: ["text-warning"],
            messageTextClass: ["mt-8", "text-warning"],
        },
        confirmation: {
            icon: "?",
            borderClass: [
                "w-20",
                "h-20",
                "dark:border-white",
                "border-lara-primary",
            ],
            iconTextClass: ["dark:text-white", "text-lara-primary"],
            messageTextClass: ["mt-4", "text-secondary"],
        },
    };
    function elementAction(id, formSubmit) {
        let elem = document.getElementById(id);
        if (elem) {
            if (formSubmit === "y") {
                document.getElementById(id).submit();
            } else {
                return elem.parentNode.removeChild(elem);
            }
        }
    }

    document.querySelectorAll(".lf-confirm").forEach((item) => {
        item.addEventListener("click", () => {
            let method = item.getAttribute("data-form-auto-id");
            if (method) {
                elementAction(method, "y");
                closeMethod(item);
            }
        });
    });

    document.querySelectorAll(".lf-close").forEach((item) => {
        closeMethod(item);
    });
    function closeMethod(item) {
        item.addEventListener("click", () => {
            if (item.closest(".lf-modal-box").getAttribute("data-form-id")) {
                document
                    .getElementById(
                        item
                            .closest(".lf-modal-box")
                            .getAttribute("data-form-id")
                    )
                    .remove();
            }
            if (
                !document
                    .getElementById("lf-button")
                    .classList.contains("hidden")
            ) {
                document.getElementById("lf-button").classList.add("hidden");
            }
            document.getElementById("flash-message").classList.add("hidden");
        });
    }
    let getConfirmationBtn = document.querySelectorAll(".confirmation");
    if (getConfirmationBtn) {
        getConfirmationBtn.forEach((item) => {
            item.addEventListener("click", (e) => {
                let link = "";
                let $this = item;
                let dataInfo = $this.getAttribute("data-form-id");
                let method = $this.getAttribute("data-form-method");
                if ($this.getAttribute("href")) {
                    link = $this.getAttribute("href");
                    e.preventDefault();
                } else {
                    link = $this.getAttribute("data-href");
                }
                let metaName = document.querySelector(
                    'meta[name="csrf-token"]'
                );
                let dataToken = metaName ? metaName.content : null;
                method = method.toUpperCase();
                if (
                    method === "POST" ||
                    method === "PUT" ||
                    method === "DELETE" ||
                    method === "GET"
                ) {
                    let form = document.createElement("form");
                    form.setAttribute("id", "auto-form-generation-" + dataInfo);
                    form.setAttribute("method", "POST");
                    form.setAttribute("action", link);
                    form.classList.add("hidden");
                    form.innerHTML = `
                    <input type="hidden" name="_token" value="${dataToken ? dataToken : ""}">
                    <input type="hidden" name="_method" value="${method}">
                `;
                    document.getElementsByTagName("body")[0].prepend(form);
                    document
                        .getElementById("lf-button")
                        .classList.remove("hidden");
                    document
                        .getElementById("lf-button")
                        .children[1].setAttribute(
                            "data-form-auto-id",
                            "auto-form-generation-" + dataInfo
                        );
                    document
                        .getElementById("flash-message")
                        .setAttribute(
                            "data-form-id",
                            "auto-form-generation-" + dataInfo
                        );
                }
                flashBox("confirmation", $this.getAttribute("data-alert"));
            });
        });
    }

    window.flashBox = function (type, message) {
        document.getElementById("flash-message").classList.remove("hidden");
        document
            .getElementById("lf-message")
            .classList.add(...flashMessageStyle[type].messageTextClass);
        document.getElementById("lf-message").innerText = message;
        document
            .getElementById("lf-icon")
            .classList.add(...flashMessageStyle[type].iconTextClass);
        document
            .getElementById("lf-icon")
            .classList.add(...flashMessageStyle[type].borderClass);
        document.getElementById("lf-icon").innerHTML =
            flashMessageStyle[type].icon;
    };

    document.addEventListener("click", function (event) {
        let getShowButton = event.target.closest(".confirmation");
        let flashConfirmButton = event.target.closest(".flash-confirm");
        let getShowModalContent = event.target.closest(".lf-modal-content");
        if (!getShowButton && !flashConfirmButton && !getShowModalContent) {
            document
                .querySelectorAll(".lf-modal-box")
                .forEach(function (modelItem) {
                    if (modelItem.getAttribute("data-form-id")) {
                        document
                            .getElementById(
                                modelItem.getAttribute("data-form-id")
                            )
                            .remove();
                    }
                    if (
                        !document
                            .getElementById("lf-button")
                            .classList.contains("hidden")
                    ) {
                        document
                            .getElementById("lf-button")
                            .classList.add("hidden");
                    }
                    document
                        .getElementById("flash-message")
                        .classList.add("hidden");
                    modelItem.setAttribute("data-form-id", "");
                });
        }
    });
    /* -------------------------------------------
::::::: End Flash Box :::::::
------------------------------------------- */
}
