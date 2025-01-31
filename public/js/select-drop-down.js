function dropDownFun(selectWrapper) {
  if (selectWrapper.querySelector(".select-selected")) return;

  let selElmnt = selectWrapper.querySelector("select");
  let ll = selElmnt.length;

  let a = document.createElement("DIV");
  a.setAttribute("class", "select-selected");
  a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
  selectWrapper.appendChild(a);

  let b = document.createElement("ul");
  b.setAttribute("class", "select-items select-hide");

  for (let j = 0; j < ll; j++) {
    let c = document.createElement("li");
    c.innerHTML = selElmnt.options[j].innerHTML;
    c.dataset.value = selElmnt.options[j].value;
    if (selElmnt.value === selElmnt.options[j].value) {
      c.classList.add("same-as-selected", "active");
    }

    c.addEventListener("click", function () {
      selElmnt.selectedIndex = [...selElmnt.options].findIndex(
        (opt) => opt.value === this.dataset.value
      );
      a.innerHTML = this.innerHTML;
      b.querySelectorAll(".same-as-selected").forEach((el) =>
        el.classList.remove("same-as-selected", "active")
      );
      this.classList.add("same-as-selected", "active");
      
    });

    b.appendChild(c);
  }

  selectWrapper.appendChild(b);

  a.addEventListener("click", function () {
    closeAllSelect(this);
    this.nextSibling.classList.toggle("select-hide");
    this.classList.toggle("select-arrow-active");
  });
}

function closeAllSelect(event) {
  document.querySelectorAll(".select-selected").forEach((sel) => {
    if (sel !== event) sel.classList.remove("select-arrow-active");
  });

  document.querySelectorAll(".select-items").forEach((item) => {
    if (!item.previousSibling.isSameNode(event)) {
      item.classList.add("select-hide");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".custom-select").forEach(dropDownFun);
});

document.addEventListener("click", (e) => {
  if (!e.target.classList.contains("select-selected")) {
    closeAllSelect(e.target);
  }
});
