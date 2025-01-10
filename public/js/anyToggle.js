 let anyToggle = {};

function closeModalOutSideClick(activeHeaderElements,thisCancelBtn,thisHeader,thisContent){
  let activeContents = [];

  if(activeHeaderElements && activeHeaderElements.length){
    activeHeaderElements.forEach((el) => {
      el.classList.remove("active");
      let contentName = el.dataset.name;
      let contentGroup = el.dataset.group;
  
      if (contentName && contentGroup) {
        let thisContent = document.querySelector(
          `[data-name="${contentName}"][data-role="content"][data-group="${contentGroup}"].active`
        );
        thisContent?.classList.remove("active");
  
        if(thisContent){
          activeContents.push(thisContent)
        }
      }
    });
  }

  if(anyToggle && anyToggle.cancel){
    anyToggle.cancel({
      thisCancelBtn: thisCancelBtn,
      thisHeader: thisHeader,
      thisContent: thisContent,
      outsideClickActiveHeaders: activeHeaderElements,
      outsideClickActiveContents: activeContents
    })
  }
}

window.addEventListener("click", (e) => {
  let content = e.target.closest("[data-name][data-role][data-group]");
  let isHeader;

  if (content) {
    isHeader = document.querySelector(
      `[data-name="${content.dataset.name}"][data-outsideclick="true"][data-role][data-group="${content.dataset.group}"]`
    );
  }

  let thisCancelBtn;
  let thisHeader;
  let thisContent;

  if (e.target.closest('[data-role="cancel"][data-group]')) {
    let cancelBtn = e.target.closest('[data-role="cancel"][data-group]');
    thisCancelBtn = cancelBtn
    let groupName = cancelBtn?.dataset.group;

    let name = cancelBtn?.dataset.name;

    let activeElements;

    if (name) {
      activeElements = document.querySelectorAll(
        `[data-name="${name}"][data-group="${groupName}"].active`
      );

      thisHeader = document.querySelector(
        `[data-name="${name}"][data-role="header"][data-group="${groupName}"].active`
      )
      thisContent = document.querySelector(
        `[data-name="${name}"][data-role="content"][data-group="${groupName}"].active`
      )

    } else {
      activeElements = document.querySelectorAll(
        `[data-group="${groupName}"].active`
      );

    }

    activeElements?.forEach((el) => {
      el.classList.remove("active");
    });
  }

  if (
    !e.target.closest('[data-outsideclick="true"][data-role][data-group]') &&
    !isHeader
  ) {
    let activeHeaderElements = document.querySelectorAll(
      '[data-outsideclick="true"][data-role="header"][data-group].active'
    );

    closeModalOutSideClick(activeHeaderElements,thisCancelBtn,thisHeader,thisContent)
   
  }else{

    let activeHeaderElements = document.querySelectorAll(
      '[data-outsideclick="true"][data-role="header"][data-group].active'
    );

    let allHeaderExceptThis = isHeader ? [...activeHeaderElements].filter( el=> el !== isHeader) : []

    closeModalOutSideClick(allHeaderExceptThis,thisCancelBtn,thisHeader,thisContent)

  } 

  if (e.target.closest('[data-role="header"][data-group]')) {
    let el = e.target.closest('[data-role="header"][data-group]');
    eventFunc(el, anyToggle);
  }
});

function eventFunc(el, anyToggle) {

  let mode = el.dataset.mode;

  let groupName = el.dataset.group;

  let relatedName = el.dataset.name;

  let relatedContent = document.querySelector(
    `[data-role="content"][data-name="${relatedName}"][data-group="${groupName}"]`
  );

  let groupButtons = document.querySelectorAll(
    `[data-role="header"][data-group="${groupName}"]`
  );

  let groupContents = document.querySelectorAll(
    `[data-role="content"][data-group="${groupName}"]`
  );

  let i = [...groupButtons].indexOf(el);

  let indexOfRelatedContent = [...groupContents].indexOf(relatedContent);

  if (mode !== "toggle") {
    groupButtons?.forEach((btn, j) => {
      if (i != j) {
        btn.classList.remove("active");
      }
    });

    groupContents?.forEach((content, j) => {
      if (indexOfRelatedContent != j) {
        content.classList.remove("active");
      }
    });
  }

  if (mode === "openedOnlyOne" || mode === "toggle") {
    el?.classList.toggle("active");

    if (el?.classList.contains("active")) {
      relatedContent?.classList.add("active");
    } else {
      relatedContent?.classList.remove("active");
    }
  } else {
    el?.classList.add("active");
    relatedContent?.classList.add("active");
  }

  if (anyToggle.action) {
    anyToggle.action({
      groupButtons: groupButtons,
      thisHeader: el,
      thisHeaderIndex: i,
      groupContents: groupContents,
      thisContent: relatedContent ? relatedContent : undefined,
      thisContentIndex: indexOfRelatedContent,
    });
  }
}
