{
    let sidebarCollapseButton = document.getElementById(
        "sidebar-collapse-button"
    );

    let mainLayout = document.querySelector('.main-layout')
    let collapseSidebarId = document.getElementById("collapse-sidebar");
    let shadowLayer = document.querySelector('.shadow-layer')
    let mainContent = document.querySelector(".main-content");
    let subHeaders = document.querySelectorAll(".main-header");
    let activeMenu = document.querySelector(".active-menu");

    let ipadView = window.matchMedia("(max-width: 1024px)");

    let prevItems = [];
    let subDropDownItemIndex = 39;

    window.addEventListener("resize", () => {
        menuResponse();
    });

    window.addEventListener("load", () => {
        let isSidebarExpand = localStorage.isSidebarExpand;
        if (isSidebarExpand === "true") {
            expandSidebar();
        } else {
            collapseSidebar(subDropDownItemIndex);
        }
        menuResponse();

        collapseSidebarId?.classList.remove("fade-in");

        subHeaders?.forEach((el) => {
            el.nextElementSibling?.classList.add("sub-item");
        });
    });

    window.addEventListener("click", (e) => {

        if (ipadView.matches) {
            if (
                e.target !== sidebarCollapseButton &&
                !e.target.closest("#collapse-sidebar")
            ) {
                // collapseSidebarId?.classList.add("-translate-x-full");
                // collapseSidebarId?.classList.remove("translate-x-0");
                collapseSidebarId.style.transform = "translateX(-100%)";


                // shadowLayer?.classList.add("-translate-x-full");
                // shadowLayer?.classList.remove("translate-x-0");
                shadowLayer.style.transform = "translateX(-100%)";
                
            }
        }

        if (
            !ipadView.matches &&
            collapseSidebarId?.classList.contains("collapse-sidebar")
        ) {
            if (
                e.target !== sidebarCollapseButton &&
                !e.target.closest("#collapse-sidebar")
            ) {
                prevItems.forEach((y) => {
                    if(y.nextElementSibling){
                        y.nextElementSibling.style.height = 0 + "px";
                        y.nextElementSibling.setAttribute("data-collapse", "false");
                    }
                    y?.classList.remove("active-on");
                });

                prevItems = [];
            }
        }

    });

    sidebarCollapseButton?.addEventListener("click", () => {
        if (ipadView.matches) {
            if (collapseSidebarId.style.transform == "translateX(-100%)") {

                // collapseSidebarId?.classList.remove("-translate-x-full");
                // collapseSidebarId?.classList.add("translate-x-0");

                collapseSidebarId.style.transform = null;


                // shadowLayer?.classList.remove("-translate-x-full");
                // shadowLayer?.classList.add("translate-x-0");

                shadowLayer.style.transform = null;

            } else {
                // collapseSidebarId?.classList.add("-translate-x-full");
                // collapseSidebarId?.classList.remove("translate-x-0");

                collapseSidebarId.style.transform = "translateX(-100%)";

                // shadowLayer?.classList.add("-translate-x-full");
                // shadowLayer?.classList.remove("translate-x-0");

                shadowLayer.style.transform = "translateX(-100%)";

            }
        }
    });

    function menuResponse() {
        if (ipadView.matches) {
            collapseSidebarId?.classList.add("position-absolute");
            // collapseSidebarId?.classList.add("-translate-x-full");
            collapseSidebarId.style.transform = "translateX(-100%)";
            shadowLayer?.classList.add("position-absolute");
            // shadowLayer?.classList.add("-translate-x-full");
            shadowLayer.style.transform = "translateX(-100%)";

        } else {
            collapseSidebarId?.classList.remove("position-absolute");
            // collapseSidebarId?.classList.remove("-translate-x-full");
            collapseSidebarId.style.transform = null;
            
            shadowLayer?.classList.remove("position-absolute");
            // shadowLayer?.classList.remove("-translate-x-full");
            shadowLayer.style.transform = null;

        }
    }

    function collapseSidebar(subDropDownItemIndex) {
        collapseSidebarId?.classList.add("fade-in");

        prevItems.forEach((y) => {
            if (y) {
                if (y.nextElementSibling) {
                    y.nextElementSibling.style.height = 0 + "px";
                    y.nextElementSibling.setAttribute("data-collapse", "false");
                }
                y?.classList.remove("active-on");
            }
        });

        prevItems = [];

        mainContent?.classList.remove("main-section-scroll");
        collapseSidebarId?.classList.add("collapse-sidebar");
        collapseSidebarId?.classList.remove("expand-sidebar");

        mainLayout?.classList.add("collapse-shadow");
        mainLayout?.classList.remove("expand-shadow");


        subHeaders?.forEach((subHeader) => {
            if (subHeader) {
                subHeader.classList?.add("clickable");
                if (subHeader.nextElementSibling) {
                    if (subDropDownItemIndex > 0) {
                        subDropDownItemIndex--;
                    }

                    subHeader.addEventListener("click", () => {
                        if (subHeader.classList.contains("clickable")) {
                            if (subHeader.nextElementSibling) {
                                let bodyHeight =
                                    document.querySelector("body")
                                        .scrollHeight -
                                    subHeader.nextElementSibling.getBoundingClientRect()
                                        .top -
                                    20;
                                subHeader.nextElementSibling.children[0].style.maxHeight =
                                    bodyHeight + "px";
                            }
                        }
                    });

                    if(subHeader.nextElementSibling){
                        subHeader.nextElementSibling.style.zIndex = subDropDownItemIndex;
                    }
                }
            }
        });
    }

    function expandSidebar() {
        collapseSidebarId?.classList.add("fade-in");
        mainContent?.classList.add("main-section-scroll");
        collapseSidebarId?.classList.remove("collapse-sidebar");
        collapseSidebarId?.classList.add("expand-sidebar");
        mainLayout?.classList.remove("collapse-shadow");
        mainLayout?.classList.add("expand-shadow");

        subHeaders.forEach((subHeader) => {
            subHeader?.classList.remove("clickable");
            if (subHeader && subHeader.nextElementSibling) {
                subHeader.nextElementSibling.children[0].style.maxHeight = null;
                subHeader.nextElementSibling.style.zIndex = null;
            }
        });
    }

    sidebarCollapseButton?.addEventListener("click", () => {
        if (!ipadView.matches) {
            if (collapseSidebarId?.classList.contains("expand-sidebar")) {
                collapseSidebar(subDropDownItemIndex);
                localStorage.setItem("isSidebarExpand", "false");
            } else {
                expandSidebar();
                localStorage.setItem("isSidebarExpand", "true");
            }
        }
    });

    let dropDownItemParent = undefined;

    window.addEventListener("load", () => {
        if (
            !activeMenu?.parentElement.parentElement.parentElement?.classList.contains(
                "root-item"
            )
        ) {
            dropDownItemParent = activeMenu?.parentElement.parentElement.parentElement;
            if (dropDownItemParent !== undefined) {
                if (collapseSidebarId?.classList.contains("expand-sidebar")) {
                    prevItems.push(dropDownItemParent.previousElementSibling);
                }
                dropDownItemParent.previousElementSibling?.classList.add("active-menu");
                dropDownItemParent.previousElementSibling?.classList.add("active-on");
            }
        }

        if (dropDownItemParent !== undefined) {
            function getParent() {
                if (
                    !dropDownItemParent.parentElement.parentElement.parentElement?.classList.contains(
                        "root-item"
                    )
                ) {
                    dropDownItemParent = dropDownItemParent.parentElement.parentElement.parentElement;
                    if(dropDownItemParent.previousElementSibling){
                        if (
                            collapseSidebarId?.classList.contains("expand-sidebar")

                        ) {
                            prevItems.push(dropDownItemParent.previousElementSibling);
                        }

                        dropDownItemParent.previousElementSibling?.classList.add("active-menu");
                        dropDownItemParent.previousElementSibling?.classList.add("active-on");
                    }

                    getParent();
                }
            }

            getParent();
        }

        prevItems.forEach((w) => {
            if (w !== undefined) {
                if(w.nextElementSibling){
                    w.nextElementSibling.setAttribute("data-collapse", "true");
                    w.nextElementSibling.style.height = null;
                }
                w?.classList.add("active-menu");
                w?.classList.add("active-on");
            }
        });
    });

    let isProcess = true;

    document.querySelectorAll(".drop-down-header")?.forEach((el) => {
        el?.addEventListener("click", () => {
            sunMenuFunc(el);
        });
    });

    collapseSidebarId?.addEventListener("animationend", () => {
        collapseSidebarId?.classList.remove("fade-in");
    });

    function removeElement(data,prevArray){
        let elements = data.parentElement.parentElement.querySelectorAll('.drop-down-header');
        elements.forEach(el=>{
            if(prevArray.includes(el)){
                let i = prevArray.indexOf(el);
                prevArray.splice(i,1);
            }
        })
    }

    function sunMenuFunc(data) {
        if (isProcess) {
            if (data && data.nextElementSibling && data.children[1] && data.children[1].classList.contains('menu-arrow')) {
                isProcess = false;
                prevItems.forEach(prev=>{

                    let underHeader = data.parentElement.parentElement.querySelectorAll('.drop-down-header');

                    if(prev && underHeader && [...underHeader].includes(prev)){
                        prev.classList.remove('active-on');

                        let dropDown = prev.nextElementSibling;

                        if(dropDown){
                            const xxScrollHeights = dropDown.scrollHeight;
                            let elementTransitions =
                            dropDown.style.transition;
                            dropDown.style.transition = "";

                            requestAnimationFrame(function () {
                                dropDown.style.height =
                                    xxScrollHeights + "px";
                                dropDown.style.transition =
                                    elementTransitions;
                                requestAnimationFrame(function () {
                                    dropDown.style.height = 0 + "px";
                                });
                            });
                        }
                    }
                })

                if(!prevItems.includes(data)){

                    data.classList.add('active-on');
                    removeElement(data,prevItems);
                    prevItems.push(data);

                    let elementHeight = data.nextElementSibling.scrollHeight;
                        data.nextElementSibling.style.height = elementHeight + "px";

                        data.nextElementSibling.addEventListener(
                            "transitionend",
                            function (e) {
                                isProcess = true;
                                data.nextElementSibling.removeEventListener(
                                    "transitionend",
                                    arguments.callee
                                );
                                data.nextElementSibling.style.height = null;
                            }
                        );
                }else{
                    removeElement(data,prevItems)
                    data.nextElementSibling.addEventListener(
                        "transitionend",
                        function (e) {
                            isProcess = true;
                            data.nextElementSibling.removeEventListener(
                                "transitionend",
                                arguments.callee
                            );
                        }
                    );
                }
            }
        }
    }

}
