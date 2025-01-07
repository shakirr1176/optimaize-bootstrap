{
    let rolePermission = document.querySelectorAll(".role-permission");
    rolePermission.forEach((el) => {
        let mainInput = el.querySelector(".main-input").querySelector("input");
        let allInput = el.querySelectorAll(".all-input");
        let subRowInput = el.querySelectorAll(".sub-row-input");
        let subColInput = el.querySelectorAll(".sub-col-input");

        window.addEventListener("load", function () {
            // main input checked

            if (mainInput.checked) {
                allInput.forEach((x) => {
                    if (x.querySelector("input")) {
                        x.querySelector("input").checked = true;
                    }

                    subRowInput.forEach((x) => {
                        if (x.querySelector("input")) {
                            x.querySelector("input").checked = true;
                        }
                    });

                    subColInput.forEach((x) => {
                        if (x.querySelector("input")) {
                            x.querySelector("input").checked = true;
                        }
                    });
                });
            }

            // subcol input checked

            subColInput.forEach((x, inx) => {
                if (x.querySelector("input")) {
                    if (x.querySelector("input").checked) {
                        subRowInput.forEach((o) => {
                            if (
                                o.nextElementSibling.children[0].children[
                                    inx
                                ] &&
                                o.nextElementSibling.children[0].children[
                                    inx
                                ].querySelector("input")
                            ) {
                                o.nextElementSibling.children[0].children[
                                    inx
                                ].querySelector("input").checked = true;
                            }
                        });
                    }

                    let isAll = true;

                    allInput.forEach((y) => {
                        if (
                            y.querySelector("input") &&
                            y.querySelector("input").checked == false
                        ) {
                            isAll = false;
                        }
                    });

                    if (isAll == true) {
                        mainInput.checked = true;
                    } else {
                        mainInput.checked = false;
                    }

                    subRowInput.forEach((x) => {
                        if (x.querySelector("input").checked == false) {
                            let inputLength = 0;
                            let checkedInput = 0;

                            for (
                                let i = 0;
                                i <
                                x.nextElementSibling.children[0].children
                                    .length;
                                i++
                            ) {
                                const el =
                                    x.nextElementSibling.children[0].children[
                                        i
                                    ];
                                if (el && el.querySelector("input")) {
                                    inputLength++;
                                }

                                if (el && el.querySelector("input")) {
                                    if (
                                        el.querySelector("input").checked ==
                                        true
                                    ) {
                                        checkedInput++;
                                    }
                                }
                            }

                            if (
                                checkedInput != 0 &&
                                inputLength == checkedInput
                            ) {
                                if (x.querySelector("input")) {
                                    x.querySelector("input").checked = true;
                                }
                            } else {
                                if (x.querySelector("input")) {
                                    x.querySelector("input").checked = false;
                                }
                            }
                        }
                    });
                }
            });

            // subrow input checked

            subRowInput.forEach((x) => {
                if (x.querySelector("input")) {
                    let subRowAllInput = x
                        .closest(".sub-row-input-parent")
                        .querySelectorAll(".all-input");
                    if (x.querySelector("input").checked) {
                        subRowAllInput.forEach((y) => {
                            if (y.querySelector("input")) {
                                y.querySelector("input").checked = true;
                            }
                        });
                    }

                    let isAll = true;

                    allInput.forEach((x) => {
                        if (
                            x.querySelector("input") &&
                            x.querySelector("input").checked == false
                        ) {
                            isAll = false;
                        }
                    });

                    if (isAll == true) {
                        mainInput.checked = true;
                    } else {
                        mainInput.checked = false;
                    }

                    subColInput.forEach((y, inx) => {
                        if (y.querySelector("input").checked == false) {
                            let inputLength = 0;
                            let checkedInput = 0;

                            subRowInput.forEach((o) => {
                                if (
                                    o.nextElementSibling.children[0].children[
                                        inx
                                    ] &&
                                    o.nextElementSibling.children[0].children[
                                        inx
                                    ].querySelector("input")
                                ) {
                                    inputLength++;
                                }

                                if (
                                    o.nextElementSibling.children[0].children[
                                        inx
                                    ] &&
                                    o.nextElementSibling.children[0].children[
                                        inx
                                    ].querySelector("input")
                                ) {
                                    if (
                                        o.nextElementSibling.children[0].children[
                                            inx
                                        ].querySelector("input").checked == true
                                    ) {
                                        checkedInput++;
                                    }
                                }
                            });

                            if (
                                checkedInput != 0 &&
                                inputLength == checkedInput
                            ) {
                                if (y.querySelector("input")) {
                                    y.querySelector("input").checked = true;
                                }
                            } else {
                                if (y.querySelector("input")) {
                                    y.querySelector("input").checked = false;
                                }
                            }
                        }
                    });
                }
            });
        });

        // main input action

        function allInputCheck(check) {
            allInput.forEach((x) => {
                if (x.querySelector("input")) {
                    x.querySelector("input").checked = check;
                }

                subRowInput.forEach((x) => {
                    if (x.querySelector("input")) {
                        x.querySelector("input").checked = check;
                    }
                });

                subColInput.forEach((x) => {
                    if (x.querySelector("input")) {
                        x.querySelector("input").checked = check;
                    }
                });
            });
        }

        mainInput.addEventListener("click", function () {
            if (this.checked) {
                allInputCheck(true);
            } else {
                allInputCheck(false);
            }
        });

        // subrow input action

        subRowInput.forEach((x) => {
            if (x.querySelector("input")) {
                x.querySelector("input").addEventListener("click", function () {
                    let subRowAllInput = x
                        .closest(".sub-row-input-parent")
                        .querySelectorAll(".all-input");
                    if (x.querySelector("input").checked) {
                        subRowAllInput.forEach((y) => {
                            if (y.querySelector("input")) {
                                y.querySelector("input").checked = true;
                            }
                        });
                    } else {
                        subRowAllInput.forEach((y) => {
                            if (y.querySelector("input")) {
                                y.querySelector("input").checked = false;
                            }
                        });
                    }

                    let isAll = true;

                    allInput.forEach((x) => {
                        if (
                            x.querySelector("input") &&
                            x.querySelector("input").checked == false
                        ) {
                            isAll = false;
                        }
                    });

                    if (isAll == true) {
                        mainInput.checked = true;
                    } else {
                        mainInput.checked = false;
                    }

                    subColInput.forEach((y, inx) => {
                        let inputLength = 0;
                        let checkedInput = 0;

                        subRowInput.forEach((o) => {
                            if (
                                o.nextElementSibling.children[0].children[
                                    inx
                                ] &&
                                o.nextElementSibling.children[0].children[
                                    inx
                                ].querySelector("input")
                            ) {
                                inputLength++;
                            }

                            if (
                                o.nextElementSibling.children[0].children[
                                    inx
                                ] &&
                                o.nextElementSibling.children[0].children[
                                    inx
                                ].querySelector("input")
                            ) {
                                if (
                                    o.nextElementSibling.children[0].children[
                                        inx
                                    ].querySelector("input").checked == true
                                ) {
                                    checkedInput++;
                                }
                            }
                        });

                        if (checkedInput != 0 && inputLength == checkedInput) {
                            if (y.querySelector("input")) {
                                y.querySelector("input").checked = true;
                            }
                        } else {
                            if (y.querySelector("input")) {
                                y.querySelector("input").checked = false;
                            }
                        }
                    });
                });
            }
        });

        // subcol input action

        subColInput.forEach((x, inx) => {
            if (x.querySelector("input")) {
                x.querySelector("input").addEventListener("click", function () {
                    if (x.querySelector("input").checked) {
                        subRowInput.forEach((o) => {
                            if (
                                o.nextElementSibling.children[0].children[
                                    inx
                                ] &&
                                o.nextElementSibling.children[0].children[
                                    inx
                                ].querySelector("input")
                            ) {
                                o.nextElementSibling.children[0].children[
                                    inx
                                ].querySelector("input").checked = true;
                            }
                        });
                    } else {
                        subRowInput.forEach((o) => {
                            if (
                                o.nextElementSibling.children[0].children[
                                    inx
                                ] &&
                                o.nextElementSibling.children[0].children[
                                    inx
                                ].querySelector("input")
                            ) {
                                o.nextElementSibling.children[0].children[
                                    inx
                                ].querySelector("input").checked = false;
                            }
                        });
                    }

                    let isAll = true;

                    allInput.forEach((y) => {
                        if (
                            y.querySelector("input") &&
                            y.querySelector("input").checked == false
                        ) {
                            isAll = false;
                        }
                    });

                    if (isAll == true) {
                        mainInput.checked = true;
                    } else {
                        mainInput.checked = false;
                    }

                    subRowInput.forEach((x) => {
                        let inputLength = 0;
                        let checkedInput = 0;

                        for (
                            let i = 0;
                            i <
                            x.nextElementSibling.children[0].children.length;
                            i++
                        ) {
                            const el =
                                x.nextElementSibling.children[0].children[i];
                            if (el && el.querySelector("input")) {
                                inputLength++;
                            }

                            if (el && el.querySelector("input")) {
                                if (el.querySelector("input").checked == true) {
                                    checkedInput++;
                                }
                            }
                        }

                        if (checkedInput != 0 && inputLength == checkedInput) {
                            if (x.querySelector("input")) {
                                x.querySelector("input").checked = true;
                            }
                        } else {
                            if (x.querySelector("input")) {
                                x.querySelector("input").checked = false;
                            }
                        }
                    });
                });
            }
        });

        // all input action

        allInput.forEach((el) => {
            if (el.querySelector("input")) {
                el.querySelector("input").addEventListener(
                    "click",
                    function () {
                        let isTruForAll = true;
                        allInput.forEach((el) => {
                            if (el.querySelector("input")) {
                                if (
                                    el.querySelector("input").checked == false
                                ) {
                                    isTruForAll = false;
                                }
                            }
                        });

                        if (isTruForAll == true) {
                            mainInput.checked = true;
                        } else {
                            mainInput.checked = false;
                        }

                        let subRowInputParent = el.closest(
                            ".sub-row-input-parent"
                        );
                        subRowInputParent.querySelectorAll(".all-input");

                        let isAlla = true;

                        subRowInputParent
                            .querySelectorAll(".all-input")
                            .forEach((x) => {
                                if (
                                    x.querySelector("input") &&
                                    x.querySelector("input").checked == false
                                ) {
                                    isAlla = false;
                                }
                            });

                        if (isAlla == true) {
                            if (
                                subRowInputParent.children[0].children[0].querySelector(
                                    "input"
                                )
                            ) {
                                subRowInputParent.children[0].children[0].querySelector(
                                    "input"
                                ).checked = true;
                            }
                        } else {
                            if (
                                subRowInputParent.children[0].children[0].querySelector(
                                    "input"
                                )
                            ) {
                                subRowInputParent.children[0].children[0].querySelector(
                                    "input"
                                ).checked = false;
                            }
                        }

                        subRowInputParent
                            .querySelectorAll(".all-input")
                            .forEach((z, ind) => {
                                z.addEventListener("click", () => {
                                    let isTrue = true;
                                    subRowInputParent.querySelectorAll(
                                        ".sub-row-input"
                                    );
                                    subRowInput.forEach((el) => {
                                        if (
                                            el.nextElementSibling.children[0]
                                                .children[ind] &&
                                            el.nextElementSibling.children[0].children[
                                                ind
                                            ].querySelector("input")
                                        ) {
                                            if (
                                                el.nextElementSibling.children[0].children[
                                                    ind
                                                ].querySelector("input")
                                                    .checked == false
                                            ) {
                                                isTrue = false;
                                            }
                                        }
                                    });

                                    if (isTrue == true) {
                                        if (
                                            subColInput[ind] &&
                                            subColInput[ind].querySelector(
                                                "input"
                                            )
                                        ) {
                                            subColInput[ind].querySelector(
                                                "input"
                                            ).checked = true;
                                        }
                                    } else {
                                        if (
                                            subColInput[ind] &&
                                            subColInput[ind].querySelector(
                                                "input"
                                            )
                                        ) {
                                            subColInput[ind].querySelector(
                                                "input"
                                            ).checked = false;
                                        }
                                    }
                                });
                            });
                    }
                );
            }
        });
    });
}
