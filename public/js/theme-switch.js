let darkLight = document.querySelector(".dark-light");

darkLight?.addEventListener("click", () => {
  const body = document.querySelector("body");

  body.classList.toggle("dark");

  if (body.classList.contains("dark")) {
    setCookie("dark", "true", 10);
  } else {
    removeCookie("dark");
  }
});
