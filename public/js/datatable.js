let responsiveTable = document.querySelector(".def-table");
let tableWrapper = responsiveTable;

window.onload = () => {
  initializeTableRows();
  responsiveTableFunc();
  showRowBtnManage();
};

window.addEventListener("resize", debounce(responsiveTableFunc, 200));

function initializeTableRows() {
  let allTr = responsiveTable?.querySelectorAll("tbody tr");
  if (!allTr || allTr.length <= 0) return;

  let thead = responsiveTable?.querySelectorAll("thead th");
  if (thead) {
    let alwaysHiddenTh = [...thead].filter((el) =>
      el.classList.contains("always-hidden")
    );
    if (alwaysHiddenTh && alwaysHiddenTh.length > 0) {
      alwaysHiddenTh.forEach((el) => {
        let thCell = el.cellIndex;
        allTr.forEach((tr) => {
          let trTd = tr.children[thCell];
          trTd?.classList.add("no-display");
        });
      });
    }
  }

  if (allTr && allTr.length > 0) {
    allTr.forEach((tr, i) => {
      tr.classList.add(i % 2 === 0 ? "odd" : "even");

      let td = tr.querySelector("td:first-child");
      if (td) {
        let tdContent = td.innerHTML;
        td.innerHTML = "";
        let div = document.createElement("div");
        div.className = "first-column";
        div.innerHTML = `
          <button class="tableDropBtn">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="plus">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"></path>
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="minus">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15"></path>
            </svg>
          </button>
          <div>${tdContent}</div>
        `;
        td.prepend(div);
      }
    });
  }
}

function showRowBtnManage() {
  let theadTH = responsiveTable?.querySelectorAll("thead th");
  if (!theadTH) return;
  let isAnyThHidden = [...theadTH].some(
    (el) =>
      el.classList.contains("no-display") ||
      el.classList.contains("always-hidden")
  );

  let tableDropBtns = responsiveTable?.querySelectorAll(".tableDropBtn");

  tableDropBtns.forEach((btn) => {
    btn.classList.add("no-display");
  });

  responsiveTable?.classList.remove("has-hidden");

  if (isAnyThHidden) {
    responsiveTable?.classList.add("has-hidden");
    tableDropBtns.forEach((btn) => {
      btn.classList.remove("no-display");
    });
  }
}

responsiveTable?.addEventListener("click", (e) => {
  if (e.target.closest(".tableDropBtn")) {
    let showBtn = e.target.closest(".tableDropBtn");
    toggleRow(showBtn);
  }
});

function toggleRow(btn) {
  if (!btn) return;
  let thisRow = btn.closest("tr");
  thisRow.classList.toggle("parent");
  btn.classList.toggle("active");

  if (
    thisRow.classList.contains("parent") &&
    btn.classList.contains("active")
  ) {
    let newRow = document.createElement("tr");
    newRow.className = "child";
    thisRow.insertAdjacentElement("afterEnd", newRow);
    addingListHtml();
  } else {
    let nextRow = thisRow.nextElementSibling;
    if (nextRow?.classList.contains("child")) {
      nextRow.remove();
    }
  }
}

function addingListHtml() {
  let parentRows = responsiveTable?.querySelectorAll("tbody .parent");
  if (!parentRows || parentRows.length <= 0) return;

  parentRows.forEach((row) => {
    let newRow = row?.nextElementSibling;
    if (newRow?.classList.contains("child")) {
      newRow.innerHTML = "";
      let noDisplayTd = row.querySelectorAll(".no-display");

      let listUl = document.createElement("ul");
      if (noDisplayTd && noDisplayTd.length > 0) {
        let thead = responsiveTable?.querySelectorAll("thead tr th");

        noDisplayTd.forEach((el) => {
          let cellNum = el.cellIndex;

          if (!thead || thead.length <= 0) return;

          let theadTh = thead[cellNum];
          if (!theadTh) return;

          let label = theadTh.dataset.label || theadTh.innerText;
          let content = el.innerHTML;
          listUl.innerHTML += `
              <li>
              <label>${label}:</label>
              <span class="content">${content}</span>
              </li>`;
        });
        
        newRow.innerHTML = `<td class="child-td">${listUl.outerHTML}</td>`;
        newRow.children[0].setAttribute("colspan", row.children.length);
      }
    }
  });
}

let prevWidth = window.innerWidth;

function responsiveTableFunc() {
  let table = tableWrapper?.querySelector("table");
  if (!table) return;

  if (prevWidth < window.innerWidth) {
    let responsiveHidden = table.querySelectorAll(".responsive-hidden");
    if (responsiveHidden && responsiveHidden.length > 0) {
      responsiveHidden.forEach((el) => {
        el.classList.remove("no-display");
        el.classList.remove("responsive-hidden");
      });
      showRowBtnManage();
      addingListHtml();
    }
  }

  prevWidth = window.innerWidth;

  let tableWrapperWidth = tableWrapper.clientWidth;
  let tableWidth = table.clientWidth;

  if (tableWidth <= tableWrapperWidth) {
    return;
  }

  let responsiveThs = table.querySelectorAll(
    "th[data-serial]:not(.no-display)"
  );
  let serialNumbers = [...responsiveThs].map((th) => +th.dataset.serial);
  let minSerial = Math.min(...serialNumbers);

  let minSerialTh = [...responsiveThs].find(
    (th) => +th.dataset.serial === minSerial
  );

  if (!minSerialTh) return;

  minSerialTh.classList.add("no-display", "responsive-hidden");

  let colIndex = minSerialTh.cellIndex;

  table.querySelectorAll("tbody tr:not(.child)").forEach((row) => {
    let col = row.children[colIndex];
    col?.classList.add("no-display", "responsive-hidden");
  });

  addingListHtml();

  showRowBtnManage();

  

  tableWidth = table.clientWidth;
  if (tableWidth > tableWrapperWidth) {
    responsiveTableFunc();
  }
}

function debounce(func, delay) {
  let timeout;
  return function () {
    clearTimeout(timeout);
    timeout = setTimeout(func, delay);
  };
}
