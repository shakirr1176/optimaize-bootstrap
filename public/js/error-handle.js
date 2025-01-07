{
    window.addEventListener("input", (e) => {
        let fieldName = e.target.name;
        let form = e.target.closest("form");

        if (fieldName && form) {
            handleError(fieldName, form);
        }
    });

    window.addEventListener("click", (e) => {
        if (e.target.closest(".select-items")) {
            let isCustomSelect = e.target.closest(".custom-select");
            let form = e.target.closest("form");

            if (isCustomSelect) {
                let fieldName = isCustomSelect.querySelector("select").name;
                if (fieldName && form) {
                    handleError(fieldName, form);
                }
            }
        }
    });

    window.addEventListener("change", (e) => {
        let fieldName = e.target.name;
        let form = e.target.closest("form");

        if (fieldName && form) {
            handleError(fieldName, form);
        }
    });
    
    window.addEventListener("click", (e) => {
        if (e.target.closest("form") && e.target.closest('button[type="reset"]')) {

            let form = e.target.closest("form");
            let resetBtn = form.querySelector('button[type="reset"]');

            if (resetBtn) {
                let allErrorField = form.querySelectorAll(".error-message");
                if (allErrorField && allErrorField.length > 0) {
                    allErrorField.forEach((field) => {
                        field.innerHTML = "";
                        field.classList.remove("active");
                    });
                }
            }

            let fileUploadParent = form.querySelectorAll('.file-upload-parent')

            if(fileUploadParent && fileUploadParent.length > 0){
                fileUploadParent.forEach(el=>{
                    let removeBtn = el.querySelector('.image-remove-btn')
                    if(removeBtn){
                        removeBtn.click()
                    }
                })
            }

            setTimeout(() => {
                let customSelect = form.querySelectorAll('.custom-select')

                if(customSelect && customSelect.length > 0){
                    dropDownFun(customSelect)
                }
            }, 0);
        }
    });

    function handleError(fieldName, form) {
        let errorTagId =
            fieldName
                .replace(/\[\]/g, "")
                .replace(/\]\[/g, ".")
                .replace("]", "")
                .replace("[", ".")
                .replace(/\'/g, "")
                .replace(/\./g, "-")
                .replace(/\'/g, "") + "-error";

        let finalId =
            form.dataset.formType == "update"
                ? "update" + "-" + errorTagId
                : errorTagId;

        let errorTag = form.querySelector(`#${finalId}`);

        if (errorTag && errorTag.innerHTML != "") {
            errorTag.innerHTML = "";
        }
    }
}
