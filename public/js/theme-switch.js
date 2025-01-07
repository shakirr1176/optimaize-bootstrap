{
    let darkLight = document.querySelector(".dark-light");

    window.addEventListener('load',()=>{
        if (localStorage.getItem("dark") == "true") {
            document.querySelector("body").classList.add("dark");
        } else {
            document.querySelector("body").classList.remove("dark");
        }
    })

    darkLight?.addEventListener("click", () => {
        document.querySelector("body").classList.toggle("dark");
        if (document.querySelector("body").classList.contains("dark")) {
            localStorage.setItem("dark", true);
        } else {
            localStorage.removeItem("dark");
        }
    });
}
