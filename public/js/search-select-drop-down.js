{
    window.S_LOCALES = {};
    window.S_LOCALES["en"] = {
        SEARCH: "search",
        NO_RESULT: "no result",
        PLACEHOLDER_SINGLE: "select an option",
        PLACEHOLDER_MULTI: "select one or more options",
    };
    window.S_LOCALES["it"] = {
        SEARCH: "cerca",
        NO_RESULT: "nessun risultato",
        PLACEHOLDER_SINGLE: "selezionare un'opzione",
        PLACEHOLDER_MULTI: "selezionare una o più opzioni",
    };
    const S_LOCALES = window.S_LOCALES;
    const S_PREFIX = "jselect";
    const S_TRIGGER = `[data-replace=${S_PREFIX}]`;
    function rem2px(rem) {
        var style = window
            .getComputedStyle(document.body, null)
            .getPropertyValue("font-size");
        var fontSize = parseFloat(style);
        return rem * fontSize;
    }

    class Select {
        old;
        index;
        el;
        name;
        id;
        options;
        value;
        shown;
        curr;
        locale;
        hasSearch;
        isOpen;
        disabled;
        placeholder;
        constructor(old, index) {
            this.index = index;
            this.isOpen = false;
            this.locale = S_LOCALES[old.dataset.locale];
            this.multiple = old.dataset.multiple;
            this.hasSearch = old.dataset.search;
            this.disabled = old.disabled;
            this.value = old.dataset.value || "";
            this.old = old;
            this.name = old.name || (+new Date()).toString();
            this.id = `${S_PREFIX}-${this.name}-${this.index + 1}`;
            this.placeholder = old.dataset.placeholder;
            if (!this.placeholder)
                this.placeholder = this.multiple
                    ? this.locale.PLACEHOLDER_MULTI
                    : this.locale.PLACEHOLDER_SINGLE;
        }
        reload(old) {
            this.isOpen = false;
            this.locale = S_LOCALES[old.dataset.locale];
            this.multiple = old.dataset.multiple;
            this.hasSearch = old.dataset.search;
            this.disabled = old.disabled;
            this.value = old.dataset.value || "";
            this.old = old;
            this.name = old.name.split("_")[0] || (+new Date()).toString();
            this.id = `${S_PREFIX}-${this.name}-${this.index + 1}`;
            this.placeholder = old.dataset.placeholder;
            if (!this.placeholder)
                this.placeholder = this.multiple
                    ? this.locale.PLACEHOLDER_MULTI
                    : this.locale.PLACEHOLDER_SINGLE;
        }
        focusOption(key) {
            let display = this.el.querySelector(`.${S_PREFIX}__display`),
                search = this.el.querySelector(`.${S_PREFIX}__search`),
                list = this.el.querySelector(`.${S_PREFIX}__list`),
                opts = this.el.querySelectorAll(`.${S_PREFIX}--option`),
                which = this.el.querySelector(`#${this.id}--${key}`);
            this.curr = this.options.find((o) => o.key == key);
            list.scrollTop = which.offsetTop - rem2px(5);
            opts.forEach((o) => {
                let opId = parseInt(o.id[o.id.length - 1]);
                opId == key
                    ? o.classList.add("focus")
                    : o.classList.remove("focus");
            });
            if (this.hasSearch)
                search.setAttribute("aria-activedescendant", which.id);
            display.setAttribute("aria-activedescendant", which.id);
            this.printOptions(this.shown);
        }
        open() {
            let display = this.el.querySelector(`.${S_PREFIX}__display`),
                search = this.el.querySelector(`.${S_PREFIX}__search`);
            this.isOpen = true;
            this.el.classList.add("open");
            display.setAttribute("aria-expanded", true);
            if (this.hasSearch) {
                search.focus();
                display.tabIndex = -1;
            }

        }
        close() {
            let display = this.el.querySelector(`.${S_PREFIX}__display`);
            display.removeAttribute("aria-activedescendant");
            this.el.classList.remove("open");
            display.setAttribute("aria-expanded", false);
            display.tabIndex = 0;
            this.isOpen = false;
        }
        focusEvents() {
            window.addEventListener("mousedown", (e) => {
                if (!this.el.contains(e.target)) this.close();
            });
        }
        isSelected(key) {
            return this.options.find((o) => o.key == key).selected;
        }

        selectOption(key) {
            if (!this.options.find((o) => o.key).selected)
                this.toggleSelect(key);
        }

        getOptions() {
            let res = [];
            var i = 0;
            this.old.querySelectorAll(":scope > optgroup").forEach((op) => {
                op.querySelectorAll(":scope > option").forEach((ch) => {
                    i++;
                    res.push({
                        key: i,
                        title: ch.innerText.trim(),
                        value: ch.value,
                        img: ch.dataset.img || "",
                        desc: ch.dataset.desc || "",
                        group: op.label,
                        selected: ch.selected,
                        disabled: ch.disabled,
                    });
                });
            });
            this.old.querySelectorAll(":scope > option").forEach((op) => {
                i++;
                res.push({
                    key: i,
                    title: op.innerText.trim(),
                    value: op.value,
                    img: op.dataset.img || "",
                    desc: op.dataset.desc || "",
                    selected: op.selected,
                    disabled: op.disabled,
                });
            });
            return res;
        }
        buildSingleOption(op) {
            let item = document.createElement("li");
            item.classList.add(`${S_PREFIX}--option`);
            item.setAttribute("role", "option");
            item.id = `${this.el.id}--${op.key}`;

            item.dataset["value"] = `${op.value}`;

            let body = document.createElement("div");
            body.classList.add(`${S_PREFIX}--option__body`);
            let title = document.createElement("span");
            title.innerHTML = op.title;
            body.appendChild(title);
            let display = this.el.querySelector(`.${S_PREFIX}__display`),
                search = this.el.querySelector(`.${S_PREFIX}__search`);

            if (op.desc) {
                let desc = document.createElement("small");
                desc.innerHTML = op.desc;
                title.style.marginTop = "0px";
                body.appendChild(desc);
            }

            item.appendChild(body);
            if (!op.disabled) {
                item.onclick = () => this.toggleAndClose(op.key);
                item.onmouseenter = () => {
                    if (this.keyEvent) {
                        this.keyEvent = false;
                        return;
                    }
                    let root = this.el.querySelector(`.${S_PREFIX}__list`),
                        targets = root.querySelectorAll(`.${S_PREFIX}--option`);
                    targets.forEach((t) => t.classList.remove("focus"));
                    item.classList.add("focus");
                    this.curr = op;
                    if (this.hasSearch)
                        if (!!op && !!op.id)
                            search.setAttribute("aria-activedescendant", op.id);
                    if (!!op && !!op.id)
                        display.setAttribute("aria-activedescendant", op.id);
                };
            }

            if (op.selected) {
                item.classList.add("selected");
                item.setAttribute("aria-selected", true);
            }
            if (op.disabled) {
                item.setAttribute("aria-disabled", true);
                item.classList.add("disabled");
            }

            if (this.curr && this.curr.value == op.value)
                item.classList.add("focus");
            return item;
        }
        printOptions(options) {
            let list = this.el.querySelector(`.${S_PREFIX}__list`);
            list.innerHTML = "";
            options
                .filter((op) => !op.group)
                .forEach((op) => list.appendChild(this.buildSingleOption(op)));
        }
        toggleAndClose(key) {
            this.toggleSelect(key);
            if (!this.multiple) this.close();
        }
        toggleSelect(key) {
            let display = this.el.querySelector(`.${S_PREFIX}__display`),
                search = this.el.querySelector(`.${S_PREFIX}__search`),
                hidden = this.el.querySelector(`.${S_PREFIX}__hidden`),
                dest = this.search ? search : display;
            if (this.multiple) dest.focus();
            this.options.forEach((op) => {
                if (!this.multiple && op.key != key) op.selected = false;
                if (op.key == key && !op.disabled)
                    op.selected = this.multiple ? !op.selected : true;
            });
            let selected = this.options.filter((op) => op.selected);
            if (selected.length == 0)
                display.innerHTML = "<span>" + this.placeholder + "</span>";
            else display.innerHTML = selected.map((op) => op.title).join(", ");
            hidden.value = selected.map((op) => op.value).join(",");
            var evt = new CustomEvent(`${S_PREFIX}-change`);
            hidden.dispatchEvent(evt);
            this.old.value = selected.map((op) => op.value).join(",");
        }
        doSearch(key) {
            key = key.toLowerCase().trim();
            this.shown = this.options.filter(
                (op) =>
                    (op.group && op.group.toLowerCase().includes(key)) ||
                    op.title.toLowerCase().includes(key) ||
                    op.value.toLowerCase().includes(key) ||
                    op.desc.toLowerCase().includes(key)
            );
            if (this.shown.length == 0) {
                let list = this.el.querySelector(`.${S_PREFIX}__list`),
                    item = document.createElement("li");
                item.classList.add(`${S_PREFIX}__noresult`);
                item.setAttribute("aria-live", "polite");
                item.innerHTML = this.locale.NO_RESULT;
                list.innerHTML = "";
                list.appendChild(item);
            } else this.printOptions(this.shown);
        }
        init() {
            let existing = document.querySelector(`#${this.id}`);
            if (existing) existing.parentElement.removeChild(existing);
            this.focusEvents();
            this.options = this.getOptions();
            this.options.forEach((o) => (o.selected = false));
            if (this.value.length > 0) {
                this.value.split(",").forEach((v) => {
                    let op = this.options.find((o) => o.value === v);
                    if (op) op.selected = true;
                });
            }
            this.shown = this.options;
            this.curr = this.options.filter((op) => op.selected == true)[0];

            this.el = document.createElement("div");
            this.el.classList.add(`${S_PREFIX}`);
            this.el.id = this.id;
            let display = document.createElement("button");
            display.classList.add(`${S_PREFIX}__display`);
            display.type = "button";
            display.setAttribute("role", "combobox");
            display.setAttribute("aria-multiselectable", this.multiple);
            display.setAttribute("aria-label", this.name);
            display.setAttribute("aria-disabled", this.disabled);
            display.setAttribute("aria-expanded", this.isOpen);
            if (!!this.curr && !!this.curr.key)
                display.setAttribute(
                    "aria-activedescendant",
                    `${this.el.id}--${this.curr.key}`
                );
            display.innerHTML = this.options
                .filter((op) => op.selected)
                .map((op) => op.title)
                .join(",");
            if (display.innerHTML.length == 0)
                display.innerHTML = "<span>" + this.placeholder + "</span>";
            let hidden = document.createElement("input");
            hidden.classList.add(`${S_PREFIX}__hidden`);
            hidden.setAttribute("aria-hidden", true);
            hidden.tabIndex = -1;
            hidden.readOnly = true;
            hidden.name = "pre" + this.name;
            hidden.disabled = this.disabled;
            hidden.value = this.options
                .filter((op) => op.selected)
                .map((op) => op.value)
                .join(",");
            display.onclick = () => {
                if (this.isOpen) this.close();
                else if (!this.disabled) this.open();
            };
            this.el.appendChild(display);
            this.el.appendChild(hidden);
            let menu = document.createElement("div");
            menu.classList.add(`${S_PREFIX}__menu`);
            menu.id = `${this.el.id}_menu`;
            if (this.hasSearch) {
                let search = document.createElement("input");
                search.classList.add(`${S_PREFIX}__search`);
                search.setAttribute("role", "searchbox");
                search.setAttribute("aria-label", this.locale.SEARCH);
                search.setAttribute("aria-autocomplete", "list");
                search.setAttribute("aria-controls", `${this.el.id}_list`);
                if (this.curr && this.curr.key)
                    search.setAttribute(
                        "aria-activedescendant",
                        `${this.el.id}--${this.curr.key}`
                    );
                search.autocapitalize = "none";
                search.autocomplete = "off";
                search.spellcheck = "off";
                search.placeholder = this.locale.SEARCH;
                search.type = "search";
                search.oninput = () => this.doSearch(search.value);
                menu.appendChild(search);
            }
            if (this.isOpen) listCont.tabIndex = 0;
            let list = document.createElement("ul");
            list.classList.add(`${S_PREFIX}__list`);
            list.setAttribute("role", "listbox");
            list.id = `${this.el.id}_list`;
            list.setAttribute("aria-label", this.name);
            list.setAttribute("aria-expanded", this.isOpen);
            display.setAttribute("aria-owns", `${this.el.id}_list`);
            menu.appendChild(list);
            this.el.appendChild(menu);
            this.printOptions(this.options);
            this.old.parentElement.insertBefore(this.el, this.old);
            if (this.old.name === this.name) this.old.name = this.old.name;
            this.old.style.display = "none";
            let offTop = this.el.offsetTop,
                winHeight = window.innerHeight;
            if (offTop >= 0.5 * winHeight) this.el.classList.add("reverse");

            this.old.addEventListener(`${S_PREFIX}-reload`, () => {
                this.reload();
                this.init();
            });

            let evt = new CustomEvent(`${S_PREFIX}-create`);
            window.dispatchEvent(evt);
        }
    }

    document.addEventListener("DOMContentLoaded", () => {
        if (!window[`${S_PREFIX}_INSTANCES`])
            window[`${S_PREFIX}_INSTANCES`] = {};
        document.querySelectorAll(S_TRIGGER).forEach((el, inx) => {
            let ist = new Select(el, inx);
            window[ist.name] = ist;
            ist.init();

            let jselectOption =
                el.parentElement.querySelectorAll(".jselect--option");
            let searchOption =
                el.parentElement.querySelectorAll(".searchOption");
            searchOption.forEach((el, inx) => {
                if (el.getAttribute("selected", "true")) {
                    jselectOption[inx].click();
                }
            });


            jselectOption.forEach((el,inx)=>{
                el.addEventListener('click',()=>{
                    searchOption[inx].disabled = true
                })
            })
        });
    });
}
