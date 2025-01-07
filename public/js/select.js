{
    class CommonVar {
        constructor() {
            // this.onChange = options && options.onChange
            this.resetBtn = "turn-into-custom-select-reset-btn";
            this.searchInputClass = "turn-into-custom-select-search-input";
            this.wrapperClass = "turn-into-custom-select-js";
            (this.selectClass = "turn-into-custom-select-js-select"),
                (this.dropDownDivWrapperClass =
                    "turn-into-custom-select-js-option-wrapper");
            (this.dropDownDivClass = "custom-select-js-ul"),
                (this.optionClass = "turn-into-custom-select-js-option");
            (this.multiSelectResetIconClass =
                "turn-into-custom-select-js-multi-select-reset-icon"),
                (this.multiCancelIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>`);
        }

        selectOption(li) {
            let customSelect = li.closest(`.${this.wrapperClass}`);

            if (customSelect) {
                let listWrapper = li.closest(
                    `.${this.dropDownDivWrapperClass}`
                );
                let listUl = li.closest(`.${this.dropDownDivClass}`);
                let opts = customSelect
                    .querySelector("select")
                    ?.querySelectorAll("option");
                let resetBtn = customSelect.querySelector(`.${this.resetBtn}`);
                let activeLi = listUl.querySelector(".selected");

                activeLi?.classList.remove("selected");

                let indexOfli = li.dataset["index"];

                opts[indexOfli].selected = true;

                li?.classList.add("selected");

                resetBtn?.classList.remove("hidden");

                let selectedDiv = customSelect.querySelector(
                    `.${this.selectClass}`
                );

                selectedDiv.innerHTML = li.innerHTML;

                let select = customSelect.querySelector("select");

                if (!customSelect.classList.contains("searching")) {
                    listWrapper.classList.add("hidden");
                }
            }
        }

        selectMultiple(opt) {
            let { index, listUl, select } = opt;
            if (index && listUl && select) {
                let wrapper = select.closest(`.${this.wrapperClass}`);
                let options = select.querySelectorAll("option");

                let allLi = listUl.querySelector(
                    `.${this.optionClass}[data-index='${index}']`
                );
                let resetBtn = wrapper.querySelector(`.${this.resetBtn}`);

                if (options[index]) {
                    options[index].selected = !options[index].selected;
                }

                allLi?.classList.toggle("selected");

                let selectedDiv = wrapper?.querySelector(
                    `.${this.selectClass}`
                );
                let showOption = +selectedDiv.dataset["showOption"];
                if (selectedDiv.innerHTML == "") {
                    selectedDiv.innerHTML =
                        wrapper.dataset["default_selected_text"];
                }

                let oldSelected = selectedDiv.querySelector(
                    `.multi-selected-option-${index}`
                );

                if (oldSelected) {
                    oldSelected.remove();
                } else {
                    if (
                        selectedDiv.innerHTML ==
                        wrapper.dataset["default_selected_text"]
                    ) {
                        selectedDiv.innerHTML = "";
                    }

                    if (select.selectedOptions.length > showOption) {
                        selectedDiv.innerHTML = `<div class="count-selected" style="text-align:center; width: 100%">Selected ${select.selectedOptions.length}</div>`;
                    } else {
                        selectedDiv.innerHTML = "";
                        for (
                            let i = 0;
                            i < select.selectedOptions.length;
                            i++
                        ) {
                            this.appendOptionInSelectedDiv(
                                select.selectedOptions[i].index,
                                selectedDiv,
                                options
                            );
                        }
                    }

                    resetBtn?.classList.remove("hidden");
                }

                if (select.selectedOptions.length == 0) {
                    selectedDiv.innerHTML =
                        wrapper.dataset["default_selected_text"];
                    resetBtn?.classList.add("hidden");
                }

                if (typeof this.onChange === "function") {
                    this.onChange(select);
                }
            }
        }

        appendOptionInSelectedDiv(index, selectedDiv, options) {
            let span = document.createElement("span");

            span.className = `multi-selected-option multi-selected-option-${index}`;

            let multiCancelIconDiv = document.createElement("span");

            multiCancelIconDiv.className = this.multiSelectResetIconClass;
            multiCancelIconDiv.innerHTML = this.multiCancelIcon;
            multiCancelIconDiv.onclick = () =>
                this.removeMultiSelectedOption(span, index);
            multiCancelIconDiv.onmouseover = () => span.classList.add("active");
            multiCancelIconDiv.onmouseleave = () =>
                span.classList.remove("active");
            span.appendChild(multiCancelIconDiv);

            let textSpan = document.createElement("span");

            let curSllLi = options[index];

            if (curSllLi) {
                textSpan.innerHTML = curSllLi.innerHTML;
            }

            span.appendChild(textSpan);

            selectedDiv.appendChild(span);
        }

        deselectAllOptions(list) {
            list?.forEach((opt) => opt.classList.remove("selected"));
        }
        deActiveAllOptions(list) {
            list?.forEach((opt) => opt.classList.remove("active"));
        }

        handleListPost(wrapperDiv) {
            if (!wrapperDiv) return;

            let dropdown = wrapperDiv.querySelector(
                `.${this.dropDownDivWrapperClass}`
            );

            if (!dropdown) return;

            let button = wrapperDiv.querySelector(`.${this.selectClass}`);

            if (!button) return;

            let spaceBelow =
                window.innerHeight - button.getBoundingClientRect().bottom;
            let spaceAbove = button.getBoundingClientRect().top;

            if (
                spaceBelow < dropdown.clientHeight &&
                spaceAbove > dropdown.clientHeight
            ) {
                dropdown.style.top =
                    button.offsetTop - dropdown.clientHeight - 4 + "px";
            } else {
                dropdown.style.top =
                    button.offsetTop + button.offsetHeight + 4 + "px";
            }
        }

        removeMultiSelectedOption(div, index) {
            let wrapper = div.closest(`.${this.wrapperClass}`);
            let resetBtn = wrapper.querySelector(`.${this.resetBtn}`);
            let select = wrapper?.querySelector("select");
            let listUl = wrapper?.querySelector(`.${this.dropDownDivClass}`);

            let options = select?.querySelectorAll("option");
            let allLi = listUl?.querySelector(
                `.${this.optionClass}[data-index='${index}']`
            );

            if (options[index]) {
                options[index].selected = false;
            }

            allLi?.classList.remove("selected");

            div.remove();

            let selectedDiv = wrapper.querySelector(`.${this.selectClass}`);
            if (selectedDiv.innerHTML == "") {
                selectedDiv.innerHTML =
                    wrapper.dataset["default_selected_text"];
            }

            if (select && select.selectedOptions.length == 0) {
                resetBtn?.classList.add("hidden");
            }

            this.handleListPost(wrapper);
        }
    }

    class EventHandle extends CommonVar {
        constructor(option) {
            super();
            this.option = option;
            this.prevCustom = undefined;
            this.eventHandle();
        }

        eventHandle() {
            document.addEventListener("mouseover", this.hoverOnList.bind(this));
            document.addEventListener(
                "mousemove",
                this.removePointerEvent.bind(this)
            );
            document.addEventListener(
                "click",
                this.selectOptionWithEvent.bind(this)
            );
            document.addEventListener("click", this.dropDown.bind(this), true);
            // document.addEventListener("keydown", this.keyPress.bind(this));
        }

        hoverOnList(e) {
            if (e.target.closest(`.${this.optionClass}`)) {
                let li = e.target.closest(`.${this.optionClass}`);
                let listUl = li.closest(`.${this.dropDownDivClass}`);
                let activeLis = listUl?.querySelector(".active");
                if (li && !listUl.classList.contains("key-active")) {
                    activeLis?.classList.remove("active");
                    li.classList.add("active");
                }
            }
        }

        removePointerEvent(e) {
            if (e.target && e.target.closest(`.${this.optionClass}`)) {
                let li = e.target.closest(`.${this.optionClass}`);
                let listUl = li.closest(`.${this.dropDownDivClass}`);
                listUl.classList.remove("key-active");
            }
        }

        selectOptionWithEvent(e) {
            if (e.target.closest(`.${this.optionClass}`)) {
                let li = e.target.closest(`.${this.optionClass}`);
                let select = li
                    .closest(`.${this.wrapperClass}`)
                    ?.querySelector("select");

                if (li && select) {

                    if(li.classList.contains('fetched-option')){

                        li.dataset.index = select.children.length-1

                        let newOption = document.querySelector('option')
                        newOption.innerHTML = li.innerHTML
                        newOption.value = li.dataset.value

                        select.append(newOption)
                    }

                    this.triggerObserver(select);

                    if (select.multiple == true) {
                        let index = li.dataset["index"];
                        let listUl = this.prevCustom?.querySelector(
                            `.${this.dropDownDivClass}`
                        );

                        e.preventDefault();

                        this.selectMultiple({ index, listUl, select });
                    } else {
                        this.prevCustom?.classList.remove("searching");
                        this.selectOption(li);
                        this.prevCustom = undefined;
                    }

                    let wrapperDiv = li.closest(`.${this.wrapperClass}`);
                    this.handleListPost(wrapperDiv);


                }
            }
        }

        dropDown(e) {
            if (
                e.target.closest(`.${this.multiSelectResetIconClass}`) &&
                e.target
                    .closest(`.${this.multiSelectResetIconClass}`)
                    .closest(`.${this.wrapperClass}`) == this.prevCustom
            )
                return;

            if (
                e.target.closest(`.${this.selectClass}`) &&
                !e.target.closest(`.${this.multiSelectResetIconClass}`)
            ) {
                let currentList = e.target.closest(`.${this.wrapperClass}`);
                if (this.prevCustom) {
                    let prevCustomSelectItem = this.prevCustom.querySelector(
                        `.${this.dropDownDivWrapperClass}`
                    );
                    prevCustomSelectItem?.classList.add("hidden");
                    this.prevCustom.classList.remove("open");
                }

                if (
                    currentList &&
                    currentList.querySelector("select") &&
                    !currentList.querySelector("select").disabled &&
                    this.prevCustom != currentList
                ) {
                    let currentListItem = currentList.querySelector(
                        `.${this.dropDownDivWrapperClass}`
                    );
                    currentListItem?.classList.remove("hidden");
                    currentList.classList.add("open");

                    this.handleListPost(currentList);

                    this.prevCustom = currentList;

                    let select = currentList.querySelector("select");
                    if (select && select.children.length > 0) {
                        let activeList = currentList
                            .querySelector(`.${this.dropDownDivWrapperClass}`)
                            ?.querySelectorAll(`.active`);
                        let list = currentList
                            .querySelector(`.${this.dropDownDivWrapperClass}`)
                            ?.querySelectorAll(`.${this.optionClass}`);

                        if (list) {
                            this.deselectAllOptions(activeList);
                            this.deActiveAllOptions(activeList);

                            for (
                                let i = 0;
                                i < select.selectedOptions.length;
                                i++
                            ) {
                                let filterList = currentList
                                    .querySelector(
                                        `.${this.dropDownDivWrapperClass}`
                                    )
                                    ?.querySelector(
                                        `.${this.optionClass}[data-index='${select.selectedOptions[i].index}']`
                                    );
                                if (filterList) {
                                    filterList.classList.add("selected");
                                    filterList.scrollIntoView({
                                        block: "nearest",
                                        behavior: 'smooth'
                                    });
                                }
                            }
                        }
                    }
                } else {
                    this.prevCustom?.classList.remove("searching");
                    this.prevCustom = undefined;
                }
            } else {
                if (
                    (this.prevCustom &&
                        e.target.closest(`.${this.optionClass}`) &&
                        !e.target
                            .closest(`.${this.wrapperClass}`)
                            ?.querySelector("select")?.multiple) ||
                    e.target.closest(`.${this.wrapperClass}`) != this.prevCustom
                ) {
                    let prevCustomSelectItem = this.prevCustom?.querySelector(
                        `.${this.dropDownDivWrapperClass}`
                    );
                    prevCustomSelectItem?.classList.add("hidden");
                    this.prevCustom?.classList.remove("open");

                    this.prevCustom?.classList.remove("searching");
                    this.prevCustom = undefined;
                }
            }
        }

        keyPress(e) {
            if (this.prevCustom) {
                let crrLi = this.prevCustom.querySelector(
                    `.${this.dropDownDivClass} .active`
                )
                    ? this.prevCustom.querySelector(
                          `.${this.dropDownDivClass} .active`
                      )
                    : this.prevCustom.querySelector(
                          `.${this.dropDownDivClass} .selected`
                      );
                let listUl = this.prevCustom.querySelector(
                    `.${this.dropDownDivClass}`
                );

                this.listSelectByKeyPress({ crrLi, listUl, e });
            }
        }

        // scrollToElement(parentElement,element) {
        //     // Get the parent element
        //     var parentElement = document.querySelector('.parent');

        //     // Get the element you want to scroll to
        //     var element = document.querySelector('.child');

        //     // Scroll the parent element to the child element
        //     parentElement.scrollTo({
        //         top: element.offsetTop,
        //         behavior: 'smooth'
        //     });
        // }

        listSelectByKeyPress(obj) {
            let { crrLi, listUl, e } = obj;

            if (listUl && e) {
                if (e.key == "ArrowDown") {
                    listUl.classList.add("key-active");

                    let firstLi = listUl.children[0];
                    let nextSibl;

                    if (crrLi && crrLi.nextElementSibling) {
                        nextSibl = crrLi.nextElementSibling;
                    } else {
                        nextSibl = firstLi;
                    }

                    crrLi?.classList.remove("active");
                    nextSibl?.classList.add("active");

                    if (nextSibl) {
                        nextSibl.scrollIntoView({
                            behavior: 'smooth',
                            block: 'nearest',
                            inline: 'nearest'
                        });
                    }
                }
                if (e.key == "ArrowUp") {
                    listUl.classList.add("key-active");

                    let prevSibl;
                    let lastLi = listUl?.children[listUl?.children.length - 1];

                    if (crrLi && crrLi.previousElementSibling) {
                        prevSibl = crrLi.previousElementSibling;
                    } else {
                        prevSibl = lastLi;
                    }

                    crrLi?.classList.remove("active");
                    prevSibl?.classList.add("active");

                    if (prevSibl) {
                        prevSibl.scrollIntoView({
                            block: "nearest",
                            behavior: "smooth",
                        });
                    }
                }

                if (e.key == "Enter") {
                    this.prevCustom?.classList.remove("searching");
                    if (
                        this.prevCustom?.querySelector("select") &&
                        this.prevCustom?.querySelector("select").multiple
                    ) {
                        let index = crrLi.dataset["index"];
                        let select = listUl
                            .closest(`.${this.wrapperClass}`)
                            ?.querySelector("select");

                        this.selectMultiple({ index, listUl, select });
                    } else {
                        this.selectOption(crrLi);
                        this.prevCustom = undefined;
                    }

                    this.handleListPost(this.prevCustom);
                }
            }
        }

        triggerObserver(select) {
            try {
                const targetNode = select;
                if (targetNode) {
                    targetNode.setAttribute(
                        "data-mutation",
                        new Date().getTime()
                    );
                }
            } catch (error) {
                console.warn("Input is required");
            }
        }
    }

    class TurnIntoCustom extends CommonVar {
        constructor(wrapper, option) {
            super();
            this.declaration(wrapper, option);
            this.initialize();
            this.draw();
        }

        initialize() {
            if (
                this.wrapper == null ||
                this.wrapper == undefined ||
                this.wrapper.children == undefined
            )
                return;

            this.observer = () => {
                return new MutationObserver((entries) => {
                    // entries.forEach((entry) => {
                        if (entries[0].type == "attributes") {
                            let select = entries[0].target;
                            if (select) {
                                let customSelect = select.closest(
                                    `.${this.wrapperClass}`
                                );
                                if (select.disabled) {
                                    customSelect?.classList.add("disable");
                                } else {
                                    customSelect?.classList.remove("disable");
                                }
                            }

                            if (entry.attributeName == "data-mutation") {
                                if (typeof this.onChange === "function") {
                                    this.onChange(select);
                                }
                            }
                        }

                        if (entries[0].type == "childList") {

                            let select = entries[0].target;

                            if (select) {
                                let customSelect = select.closest(
                                    `.${this.wrapperClass}`
                                );

                                if (!customSelect) return;

                                let listUl = customSelect.querySelector(
                                    `.${this.dropDownDivClass}`
                                );

                                let lists = "";

                                if (select.children.length > 0) {
                                    for (
                                        let i = 0;
                                        i < select.children.length;
                                        i++
                                    ) {
                                        lists += `<li data-index="${i}" data-value="${select.children[i].value}" class="${
                                            this.optionClass
                                        } ${
                                            select.children[i].selected
                                                ? "selected"
                                                : ""
                                        }">${
                                            select.children[i].innerHTML
                                        }</li>`;
                                    }

                                    let newOption = select.children[select.children.length-1]

                                    if(newOption){
                                        let newObj = {
                                                index: select.children.length-1,
                                                value: newOption.value,
                                                title: newOption.innerHTML,
                                                selected: true,
                                            }

                                        this.options.push(newObj)
                                    }

                                }

                                listUl.innerHTML = lists;
                            }
                        }
                    // });
                });
            };

            this.wrapper?.classList.add(this.wrapperClass);
        }

        declaration(wrapper, option) {
            this.fetchWithSearch = option && option.fetchWithSearch ? option.fetchWithSearch : false
            this.onLoad = option && option.onLoad;
            this.onChange = option && option.onChange;
            this.wrapper = wrapper;
            this.multiple = option && option.multiple ? option.multiple : false;
            this.noDataMsg =
                option && option.no_Data_Msg ? option.no_Data_Msg : "no data";
            this.noDataClass =
                option && option.noDataClass ? option.noDataClass : "no-data";

            this.loaderIcon =
                option && option.loader_icon_Msg ? option.loader_icon_Msg : `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M304 48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zm0 416a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM48 304a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm464-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM142.9 437A48 48 0 1 0 75 369.1 48 48 0 1 0 142.9 437zm0-294.2A48 48 0 1 0 75 75a48 48 0 1 0 67.9 67.9zM369.1 437A48 48 0 1 0 437 369.1 48 48 0 1 0 369.1 437z"/></svg>`;
            this.loaderClass =
                option && option.loaderClass ? option.loaderClass : "custom-select-loader";

            this.defaultSelectedText =
                option && option.default_selected_text
                    ? option.default_selected_text
                    : "select";
            this.options =
                option && option.options
                    ? [...option.options]
                    : this.madeOption(this.wrapper)?.convertedOption;
            this.searchIcon =
                option && option.search_icon
                    ? option.search_icon
                    : `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
      </svg>`;

            this.showOption =
                option && option.show_option ? option.show_option : 5;
            this.search = option && option.search ? option.search : false;
            this.searchType =
                option && option.search_type ? option.search_type : "startWith";
            this.placeholder =
                option && option.placeholder ? option.placeholder : "Search";
            this.observe =
                option && option.observe == false && this.search == false
                    ? false
                    : true;
            this.reset =
                option && option.reset
                    ? option.reset
                    : this.search
                    ? this.search
                    : false;
            this.resetIcon =
                option && option.reset_icon
                    ? option.reset_icon
                    : `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>`;
            this.icon =
                option && option.drop_down_icon
                    ? option.drop_down_icon
                    : `<svg xmlns="htfirstLitp://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>`;

            this.reserveOptions = []
        }

        draw() {
            this.hasRapper(this.wrapper);

            let select = this.wrapper?.querySelector("select");

            if (!select) return;

            if (select.multiple) {
                this.multiple = true;
            } else if (this.multiple) {
                select.multiple = true;
            }

            if (this.wrapper) {
                this.convertToDiv(this.wrapper);
            }
        }

        hasRapper(wrapper) {
            if (
                wrapper == null ||
                wrapper == undefined ||
                wrapper.children == undefined
            )
                return;
        }

        madeOption(wrapper) {
            this.hasRapper(wrapper);

            let select = wrapper?.querySelector("select");

            if (!select) return;

            let opts = [...select.children];

            let convertedOption;

            if (opts.length) {
                convertedOption = opts.map((opt, i) => {
                    return {
                        index: i,
                        value:
                            opt.getAttribute("value") == null ? "" : opt.value,
                        title: opt.innerHTML,
                        selected:
                            opt.getAttribute("selected") != null ? true : false,
                    };
                });
            }

            return {
                convertedOption,
            };
        }

        doSearch(obj) {
            if (this.observe) {
                let { customSelect, value } = obj;
                if (this.options) {
                    let lists;

                    if (this.searchType == "similar") {
                        lists = this.options.filter((data) =>
                            data.title
                                .toLowerCase()
                                .includes(value.toLowerCase())
                        );
                    } else if (this.searchType == "exact") {
                        lists = this.options.filter(
                            (data) =>
                                data.title.toLowerCase() === value.toLowerCase()
                        );
                    } else {
                        lists = this.options.filter((data) =>
                            data.title
                                .toLowerCase()
                                .startsWith(value.toLowerCase())
                        );
                    }

                    // console.log(this.options);

                    this.buildList(lists, customSelect,value);
                    this.handleListPost(customSelect);
                } else {
                    console.warn("options property missing");
                }
            }
        }

        resetFunc(resetBtn) {
            if (resetBtn) {
                let customSelect = resetBtn.closest(`.${this.wrapperClass}`);
                let select = customSelect?.querySelector("select");

                if (this.options) {
                    this.buildList(this.options, customSelect);
                }

                select.value = "";

                if (customSelect && select && !select.disabled) {
                    let selectedDiv = customSelect.querySelector(
                        `.${this.selectClass}`
                    );

                    selectedDiv.innerHTML = this.defaultSelectedText;

                    let selectedLi = customSelect.querySelectorAll(
                        `.${this.optionClass}.selected`
                    );
                    selectedLi?.forEach((el) =>
                        el.classList.remove("selected")
                    );

                    if (
                        customSelect.querySelector(`.${this.searchInputClass}`)
                    ) {
                        customSelect.querySelector(
                            `.${this.searchInputClass}`
                        ).value = "";
                    }
                }

                resetBtn?.classList.add("hidden");

                this.handleListPost(customSelect);
            }
        }

        noDataShowFun(listUlWrapper,listUl,noDataDiv) {

            if(noDataDiv) return

            let allNoData = listUlWrapper.querySelectorAll(`.${this.noDataClass}`)
            allNoData.forEach(el=>{
                el.remove()
            })

            let noDataShow = document.createElement("div");
            noDataShow.innerHTML = this.noDataMsg;
            noDataShow.className = this.noDataClass;

            if (listUlWrapper && listUl) {
                listUlWrapper.appendChild(noDataShow);
                listUl.style.all = "initial";
            }
        }

        loaderFunc(listUlWrapper,listUl,loaderDiv){
            if(loaderDiv) return

            let loaderShow = document.createElement("div");
            loaderShow.innerHTML = this.loaderIcon;
            loaderShow.className = this.loaderClass;

            if (listUlWrapper && listUl) {
                listUlWrapper.appendChild(loaderShow);
                listUl.style.all = "initial";
            }
        }

        async fetchData($this,cus,newArray,searchInputValue,listUlWrapper,listUl,noDataDiv){

            let select = cus.querySelector('select')

            if(!select) return

            let loaderDiv = listUlWrapper?.querySelector(
                `.${this.loaderClass}`
            );

            if(!noDataDiv){
                $this.loaderFunc(listUlWrapper,listUl,loaderDiv)
            }

            try {
                let dataFetch = await fetch($this.fetchWithSearch(searchInputValue))
                if(dataFetch.status == 200){

                    let data = await dataFetch.json()

                    if(data){

                        let loaderDiv = listUlWrapper?.querySelector(
                            `.${this.loaderClass}`
                        );

                        if (loaderDiv && listUl) {
                            loaderDiv.remove();
                            listUl.style.all = null;
                        }

                        Object.keys(data).forEach((key, index) => {
                            newArray.push({ index: select.children.length, value: key, title: data[key] });
                        });

                        if(newArray.length>0){
                            $this.buildList(newArray,cus,searchInputValue,true)
                        }else{
                            $this.noDataShowFun(listUlWrapper,listUl,noDataDiv)
                        }
                    }
                }
            } catch (error) {

                if (loaderDiv && listUl) {
                    loaderDiv.remove();
                    listUl.style.all = null;
                    $this.noDataShowFun(listUlWrapper,listUl,noDataDiv)
                }

            }
        }

        buildList(lists, cus,searchInputValue,isFetched = false) {
            if (!cus) return;

            cus.classList.add("searching");

            let listUlWrapper = cus.querySelector(
                `.${this.dropDownDivWrapperClass}`
            );
            let listUl = cus.querySelector(`.${this.dropDownDivClass}`);
            let select = cus.querySelector("select");

            if (!listUl) return;

            let allOption = '';

            lists.forEach((opt) => {
                allOption += `<li data-value="${opt.value}" data-index="${opt.index}" class="${this.optionClass} ${isFetched && 'fetched-option'}">${opt.title}</li>`;
            });

            listUl.innerHTML = allOption;

            for (let i = 0; i < select.selectedOptions.length; i++) {
                let filterList = cus
                    .querySelector(`.${this.dropDownDivWrapperClass}`)
                    ?.querySelector(
                        `.${this.optionClass}[data-index='${select.selectedOptions[i].index}']`
                    );
                if (filterList) {
                    filterList.classList.add("selected");
                }
            }

            let noDataDiv = listUlWrapper?.querySelector(
                `.${this.noDataClass}`
            );

            let newArray = [];

            let $this = this

            if (lists.length == 0) {
                this.fetchWithSearch ? this.fetchData($this,cus,newArray,searchInputValue,listUlWrapper,listUl,noDataDiv) : this.noDataShowFun(listUlWrapper,listUl,noDataDiv)
            } else {
                if (noDataDiv && listUl) {
                    noDataDiv.remove();
                    listUl.style.all = null;
                }
            }
        }

        convertToDiv(customSelect) {
            if (!customSelect.querySelector(`.${this.dropDownDivClass}`)) {
                if (this.options && this.options.length > 0) {

                    this.reserveOptions = [...this.options]

                    let select = customSelect?.querySelector("select");

                    if (select) {
                        if (select.children.length == 0) {
                            let allOption = "";
                            this.options.forEach((opt) => {
                                let singleOpt = `<option value="${opt.value}">${opt.title}</option>`;
                                allOption += singleOpt;
                            });

                            select.innerHTML = allOption;
                        }

                        select.value = "";

                        if (this.reset) {
                            let resetDiv = document.createElement("button");
                            resetDiv.className = `${this.resetBtn} hidden`;
                            resetDiv.innerHTML = this.resetIcon;
                            resetDiv.onclick = () => this.resetFunc(resetDiv);
                            customSelect.appendChild(resetDiv);
                        }

                        if (this.icon) {
                            let downDiv = document.createElement("span");
                            downDiv.className = "arrow-down";
                            downDiv.innerHTML = this.icon;
                            customSelect.appendChild(downDiv);
                        }

                        select.classList.add("hidden");

                        let selectedDiv = document.createElement("div");
                        selectedDiv.className = this.selectClass;
                        selectedDiv.dataset["showOption"] = this.showOption;

                        customSelect.dataset["default_selected_text"] =
                            this.defaultSelectedText;
                        selectedDiv.innerHTML = this.defaultSelectedText;

                        customSelect.prepend(selectedDiv);

                        let listUl = document.createElement("ul");
                        listUl.className = this.dropDownDivClass;

                        if (this.options && this.options.length > 0) {
                            let hasSelected = false;
                            let selectedLi = [];
                            let selectedIndex = [];
                            let lists = "";

                            for (let i = 0; i < this.options.length; i++) {
                                lists += `<li data-value="${
                                    this.options[i].value
                                }" data-index="${
                                    this.options[i].index
                                }" class="${this.optionClass} ${
                                    this.options[i].isHidden ? "hidden" : ""
                                }">${this.options[i].title}</li>`;

                                if (this.options[i].selected) {
                                    hasSelected = true;
                                    if (this.multiple) {
                                        selectedIndex.push(
                                            this.options[i].index
                                        );
                                    } else {
                                        selectedIndex = [this.options[i].index];
                                    }
                                }
                            }

                            listUl.innerHTML = lists;

                            if (hasSelected) {
                                if (this.multiple) {
                                    selectedLi = selectedIndex.map(
                                        (el) => listUl.children[el]
                                    );
                                } else {
                                    selectedLi = [
                                        listUl.children[
                                            selectedIndex[
                                                selectedIndex.length - 1
                                            ]
                                        ],
                                    ];
                                }
                            }

                            let listWrapper = document.createElement("div");
                            listWrapper.className =
                                this.dropDownDivWrapperClass;
                            listWrapper.classList.add("hidden");

                            if (this.search) {
                                let div = document.createElement("div");
                                div.className = this.searchInputClass + "-div";
                                div.innerHTML = `<span class="search-icon">${this.searchIcon}</span>`;
                                let inp = document.createElement("input");
                                inp.className = this.searchInputClass;
                                inp.oninput = () =>
                                    this.doSearch({
                                        customSelect,
                                        inp,
                                        value: inp.value,
                                    });
                                inp.placeholder = this.placeholder;
                                div.appendChild(inp);
                                listWrapper.appendChild(div);
                            }

                            listWrapper.appendChild(listUl);
                            customSelect.prepend(listWrapper);

                            if (this.multiple) {
                                listWrapper.classList.add("hidden");
                                selectedIndex.forEach((index) => {
                                    this.selectMultiple({
                                        index,
                                        listUl,
                                        select,
                                    });
                                });
                            } else {
                                if (selectedLi.length) {
                                    this.selectOption(
                                        selectedLi[selectedLi.length - 1]
                                    );
                                }
                            }
                        }

                        if (select.disabled) {
                            customSelect.classList.add("disable");
                        }

                        if (typeof this.onLoad === "function") {
                            this.onLoad(select);
                        }

                        this.observer().disconnect();

                        if (this.observe) {
                            this.observer().observe(select, {
                                childList: true,
                                attributes: true,
                            });
                        }
                    }
                }
            }
        }
    }

    let customSelect = new EventHandle({});

    function turnIntoCustom(el, option) {
        try {
            if (el.length) {
                el.forEach((x) => {
                    return new TurnIntoCustom(x, option);
                });
            } else {
                return new TurnIntoCustom(el, option);
            }
        } catch (error) {
            console.warn("Please pass a valid argument");
        }
    }

    window.turnIntoCustom = turnIntoCustom
}
