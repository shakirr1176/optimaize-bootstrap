{
    const MultiSelectDropdown = (params) => {
        let config = {
            search: true,
            hideX: false,
            useStyles: true,
            placeholder: "Select...",
            txtSelected: "Selected",
            txtAll: "All",
            txtRemove: "Remove",
            txtSearch: "Search...",
            borderRadius: 6,
            minWidth: "160px",
            maxWidth: "360px",
            maxHeight: "180px",
            ...params,
        };

        const newElement = (tag, params) => {
            let element = document.createElement(tag);
            if (params) {
                Object.keys(params).forEach((key) => {
                    if (key === "class") {
                        Array.isArray(params[key])
                            ? params[key].forEach((o) =>
                                  o !== "" ? element.classList.add(o) : 0
                              )
                            : params[key] !== ""
                            ? element.classList.add(params[key])
                            : 0;
                    } else if (key === "style") {
                        Object.keys(params[key]).forEach((value) => {
                            element.style[value] = params[key][value];
                        });
                    } else if (key === "text") {
                        params[key] === ""
                            ? (element.innerHTML = "&nbsp;")
                            : (element.innerText = params[key]);
                    } else if (key === "HTML") {
                        params[key] === ""
                            ? (element.innerHTML = "&nbsp;")
                            : (element.innerHTML = params[key]);
                    } else {
                        element[key] = params[key];
                    }
                });
            }
            return element;
        };

        document.querySelectorAll("select[multiple]").forEach((multiSelect) => {
            let div = newElement("div", { class: "multiselect-dropdown" });
            multiSelect.style.display = "none";
            multiSelect.parentNode.insertBefore(div, multiSelect.nextSibling);
            let dropdownListWrapper = newElement("div", {
                class: "multiselect-dropdown-list-wrapper",
            });
            let dropdownList = newElement("div", {
                class: "multiselect-dropdown-list",
            });
            let search = newElement("input", {
                class: ["multiselect-dropdown-search"].concat([
                    config.searchInput?.class ?? "form-control",
                ]),
                style: {
                    width: "100%",
                    display: config.search
                        ? "block"
                        : multiSelect.attributes.search?.value === "true"
                        ? "block"
                        : "none",
                },
                placeholder: config.txtSearch,
            });
            dropdownListWrapper.appendChild(search);
            div.appendChild(dropdownListWrapper);
            dropdownListWrapper.appendChild(dropdownList);

            multiSelect.loadOptions = () => {
                dropdownList.innerHTML = "";

                if (
                    config.selectAll ||
                    multiSelect.attributes["select-all"]?.value === "true"
                ) {
                    let optionElementAll = newElement("div", {
                        class: "multiselect-dropdown-all-selector",
                    });
                    let pDiv2 = document.createElement("div");
                    pDiv2.innerHTML = `<label class="group py-[8px] px-[10px] w-full h-full custom-input-checked flex cursor-pointer items-center rounded">
             <input class="approve custom-check hidden appearance-none" type="checkbox" id="" name="">
             <svg class="checked-item h-5 w-5 rounded border border-primary bg-white text-white" viewBox="0 0 172 172">
                 <g fill="none" font-family="none" font-size="none" font-weight="none" stroke-miterlimit="10" stroke-width="none" style="mix-blend-mode:normal" text-anchor="none">
                     <path d="M0 172V0h172v172z"></path>
                     <path d="M145.433 37.933L64.5 118.8658 33.7337 88.0996l-10.134 10.1341L64.5 139.1341l91.067-91.067z" fill="currentColor" stroke-width="1"></path>
                 </g>
             </svg>
        </label>`;
                    optionElementAll.appendChild(pDiv2);

                    let optionCheckbox = newElement("input", {
                        type: "checkbox",
                    });
                    optionCheckbox.classList.add("hidden");

                    optionElementAll.appendChild(optionCheckbox);
                    optionElementAll.appendChild(
                        newElement("label", {
                            class: "searchText",
                            text: config.txtAll,
                        })
                    );

                    optionElementAll.addEventListener("click", () => {
                        optionElementAll.classList.toggle("checked");
                        optionElementAll.querySelector("input").checked =
                            !optionElementAll.querySelector("input").checked;

                        let ch =
                            optionElementAll.querySelector("input").checked;
                        dropdownList
                            .querySelectorAll(
                                ":scope > div:not(.multiselect-dropdown-all-selector)"
                            )
                            .forEach((i) => {
                                if (i.style.display !== "none") {
                                    i.querySelector("input").checked = ch;
                                    i.optEl.selected = ch;
                                }
                            });

                        multiSelect.dispatchEvent(new Event("change"));
                    });
                    optionCheckbox.addEventListener("click", () => {
                        optionCheckbox.checked = !optionCheckbox.checked;
                    });

                    dropdownList.appendChild(optionElementAll);
                }

                Array.from(multiSelect.options).map((option) => {
                    let optionElement = newElement("div", {
                        class: option.selected ? "checked" : "",
                        srcElement: option,
                    });
                    let pDiv = document.createElement("div");

                    pDiv.innerHTML = `<label class=" group py-[8px] px-[10px] w-full h-full custom-input-checked flex cursor-pointer items-center rounded">
                  <input  class="approve custom-check hidden appearance-none" type="checkbox" ${
                      option.selected ? `checked` : ``
                  } id="" name="">
                  <svg class="checked-item h-5 w-5 rounded border border-primary bg-white text-white" viewBox="0 0 172 172">
                      <g fill="none" font-family="none" font-size="none" font-weight="none" stroke-miterlimit="10" stroke-width="none" style="mix-blend-mode:normal" text-anchor="none">
                          <path d="M0 172V0h172v172z"></path>
                          <path d="M145.433 37.933L64.5 118.8658 33.7337 88.0996l-10.134 10.1341L64.5 139.1341l91.067-91.067z" fill="currentColor" stroke-width="1"></path>
                      </g>
                  </svg>
             </label>`;

                    let optionCheckbox = newElement("input", {
                        type: "checkbox",
                        checked: option.selected,
                    });

                    optionCheckbox.classList.add("hidden");
                    optionElement.appendChild(pDiv);
                    optionElement.appendChild(optionCheckbox);
                    optionElement.appendChild(
                        newElement("label", {
                            class: "searchText",
                            text: option.text,
                        })
                    );

                    optionElement.addEventListener("click", () => {
                        optionElement.classList.toggle("checked");
                        optionElement.querySelector("input").checked =
                            !optionElement.querySelector("input").checked;
                        optionElement.srcElement.selected =
                            !optionElement.srcElement.selected;
                        multiSelect.dispatchEvent(new Event("change"));
                    });

                    optionElement.addEventListener("click", () => {
                        optionCheckbox.checked = !optionCheckbox.checked;
                    });

                    option.optionElement = optionElement;
                    dropdownList.appendChild(optionElement);
                });
                div.dropdownListWrapper = dropdownListWrapper;

                div.refresh = () => {
                    div.querySelectorAll(
                        "span.optext, span.placeholder"
                    ).forEach((placeholder) => div.removeChild(placeholder));
                    let selected = Array.from(multiSelect.selectedOptions);
                    if (
                        selected.length >
                        (multiSelect.attributes["max-items"]?.value ?? 5)
                    ) {
                        div.appendChild(
                            newElement("span", {
                                class: ["optext", "maxselected"],
                                text:
                                    selected.length + " " + config.txtSelected,
                            })
                        );
                    } else {
                        selected.map((option) => {
                            let span = newElement("span", {
                                class: "optext",
                                text: option.text,
                                srcElement: option,
                            });
                            if (!config.hideX) {
                                span.appendChild(
                                    newElement("span", {
                                        class: "optdel",
                                        HTML: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      `,
                                        title: config.txtRemove,
                                        onclick: (e) => {
                                            span.srcElement.optionElement.dispatchEvent(
                                                new Event("click")
                                            );
                                            div.refresh();
                                            e.stopPropagation();
                                            // console.log();
                                        },
                                    })
                                );
                            }
                            div.appendChild(span);
                            // For demo purposes, remove
                        });
                    }
                    if (multiSelect.selectedOptions?.length === 0) {
                        div.appendChild(
                            newElement("span", {
                                class: "placeholder",
                                text:
                                    multiSelect.attributes?.placeholder
                                        ?.value ?? config.placeholder,
                            })
                        );
                        // For demo purposes, remove
                    }
                };
                div.refresh();
            };
            multiSelect.loadOptions();

            search.addEventListener("input", () => {
                dropdownList
                    .querySelectorAll(
                        ":scope div:not(.multiselect-dropdown-all-selector)"
                    )
                    .forEach((div) => {
                        if (div.querySelector(".searchText")) {
                            let innerText = div
                                .querySelector(".searchText")
                                .innerText.toLowerCase();
                            div.style.display = innerText.includes(
                                search.value.toLowerCase()
                            )
                                ? "flex"
                                : "none";
                        }
                    });
            });

            div.addEventListener("click", () => {
                div.dropdownListWrapper.style.display = "block";
                search.focus();
                search.select();
            });

            document.addEventListener("click", (e) => {
                if (!div.contains(e.target)) {
                    dropdownListWrapper.style.display = "none";
                    div.refresh();
                }
            });
        });

        const createStyles = () => {
            let styles = {
                ":root": {
                    "--color-border": "#ced4da",
                    "--border-radius--base":
                        `${parseInt(config.borderRadius)}px` || "6px",
                    "--border-radius--small":
                        `${parseInt(config.borderRadius) * 0.75}px` || "4px",
                },
                ".multiselect-dropdown": {
                    position: "relative",
                    display: "inline-flex",
                    "flex-wrap": "wrap",
                    width: "100%",
                    cursor: "pointer",
                },
                "span.optext, span.placeholder": {
                    display: "inline-flex",
                    "justify-content": "center",
                    "align-items": "center",
                },
                "span.optext": {
                    "margin-right": "20px",
                },

                "span.optext .optdel": {
                    float: "right",
                    margin: "0 -6px 1px 6px",
                    "font-size": "12px",
                    cursor: "pointer",
                    color: "red",
                },
                "span.optext .optdel:hover": {
                    color: "var(--color-text--red)",
                },

                ".multiselect-dropdown-list-wrapper": {
                    "z-index": 100,
                    border: "solid 1px var(--color-border)",
                    display: "none",
                    margin: "-1px",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    background: "white",
                },
                ".multiselect-dropdown-search:focus, .multiselect-dropdown-search:focus-visible":
                    {
                        outline: "none",
                    },
                ".multiselect-dropdown-list": {
                    "overflow-y": "auto",
                    "overflow-x": "hidden",
                    height: "100%",
                    "max-height": `${config.maxHeight}` ?? "160px",
                },
                ".multiselect-dropdown-list::-webkit-scrollbar": {
                    width: "4px",
                },
                ".multiselect-dropdown-list::-webkit-scrollbar-thumb": {
                    "background-color": "var(--color-background--option)",
                    "border-radius": "1000px",
                },
                ".multiselect-dropdown-list div": {
                    display: "flex",
                    "align-items": "center",
                    "justify-content": "flex-start",
                    "column-gap": "6px",
                    margin: "6px 8px 6px 6px",
                    transition: "100ms cubic-bezier(0.455, 0.03, 0.515, 0.955)",
                },
                ".multiselect-dropdown-list-input": {
                    height: "14px",
                    width: "14px",
                    border: "solid 1px var(--color-text--grey)",
                    margin: 0,
                },
                ".multiselect-dropdown span.maxselected": {
                    width: "100%",
                },
                ".multiselect-dropdown-all-selector": {
                    "border-bottom": "solid 1px var(--color-border)",
                },
            };
            const style = document.createElement("style");
            style.setAttribute("type", "text/css");
            style.innerHTML = `${Object.keys(styles)
                .map(
                    (selector) =>
                        `${selector} { ${Object.keys(styles[selector])
                            .map(
                                (property) =>
                                    `${property}: ${styles[selector][property]}`
                            )
                            .join("; ")} }`
                )
                .join("\n")}`;
            document.head.appendChild(style);
        };

        config.useStyles && createStyles();
    };

    window.addEventListener("load", () => {
        MultiSelectDropdown(window.MultiSelectDropdownOptions);
    });
    let multipleSelectDropdownCall = function multipleSelectDropdownCall() {
        MultiSelectDropdown(window.MultiSelectDropdownOptions);
    };
    window.multipleSelectDropdownCall = multipleSelectDropdownCall;
}
