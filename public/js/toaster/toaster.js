  if (!document.querySelector(".toaster-container")) {
    let toasterContainerElement = document.createElement("div");
    toasterContainerElement.className = "toaster-container";
    document.querySelector("body").append(toasterContainerElement);
  }

  function numCheck(num) {
    num = parseInt(num);

    if (!Number.isNaN(num)) {
      return true;
    } else {
      return false;
    }
  }

  function toaster({
    status,
    title,
    body,
    statusIcon,
    cancelIcon,
    stay,
    transition
  }) {
    stay == undefined || !numCheck(stay)
      ? (stay = toasterConfig.toasters[status]
          ? toasterConfig.toasters[status].stay
          : toasterConfig.toasters[toasterConfig?.defaultStatus].stay)
      : (stay = +stay);

    transition == undefined || !numCheck(transition)
      ? (transition = 300)
      : (transition = +transition);

    if (toasterConfig.toasters[status] == undefined) status = toasterConfig?.defaultStatus;

    createToasterPopUp(
      passedParams({
        status,
        title,
        body,
        statusIcon,
        cancelIcon,
        stay,
        transition
      })
    );
  }

  function passedParams({
    status,
    title,
    body,
    statusIcon,
    cancelIcon,
    stay,
    transition
  }) {
    return {
      status,
      title: title ? title : toasterConfig.toasters[status].title,
      body: body ? body : toasterConfig.toasters[status].body,
      statusIcon: statusIcon
        ? statusIcon
        : toasterConfig.toasters[status].statusIcon,
      cancelIcon: cancelIcon
        ? cancelIcon
        : toasterConfig?.cancelIcon,
      stay,
      transition,
    };
  }

  function createToasterPopUp({
    status,
    title,
    body,
    statusIcon,
    cancelIcon,
    stay,
    transition
  }) {
    let div = document.createElement("div");

    div.style.transition = `all ${transition}ms ease-out`;
    div.style.transform = "translateX(100%)";
    div.style.opacity = "0";

    requestAnimationFrame(() => {
      div.style.opacity = "1";
      div.style.transform = "translateX(0%)";
    });

    div.innerHTML = template
      ? template({
          status,
          cancelIcon,
          statusIcon,
          title,
          body
        })
      : "";

    let toasterContainerElement = document.querySelector(".toaster-container");

    if (toasterContainerElement) {
      toasterContainerElement.append(div);
    }

    let cancelBtn = div.querySelector(".toaster-cancel-btn");

    let toasterPopUp = div.querySelector(".toaster-pop-up");
    toasterPopUp.style.transition = `all ${transition}ms ease-out`;

    let autoRemove = setTimeout(() => {
      setTimeout(() => {
        div.style.height = "0px";
        div.style.pointerEvents = "none";
      }, transition);

      setTimeout(() => {
        div.remove();
      }, 2 * transition);

      toasterPopUp?.classList.add('toaster-pop-up-hidden')
    }, stay);

    let gap = toasterConfig.gap ? toasterConfig.gap : 32;

    div.style.height = div.scrollHeight + gap + "px";

    toasterPopUp.style.transition = `all ${transition}ms ease-in-out`;

    cancelBtn.onclick = () =>
      removeToaster({
        cancelBtn,
        div,
        transition,
        toasterPopUp,
        autoRemove,
      });
    toasterPopUp.onmouseover = () => stayToaster(autoRemove);
    // toasterPopUp.onmouseleave = ()=> removeToaster({cancelBtn,div,transition,toasterPopUp,autoRemove})
  }

  function removeToaster(obj) {
    let { cancelBtn, div, transition, toasterPopUp, autoRemove } = obj;

    setTimeout(() => {
      div.style.height = "0px";
      div.style.pointerEvents = "none";
    }, transition);

    setTimeout(() => {
      div.remove();
    }, 2 * transition);

    toasterPopUp?.classList.add('toaster-pop-up-hidden')

    if (autoRemove) {
      clearTimeout(autoRemove);
    }

    if (cancelBtn) {
      cancelBtn.disabled = true;
    }
  }

  function stayToaster(autoRemove) {
    clearTimeout(autoRemove);
  }
