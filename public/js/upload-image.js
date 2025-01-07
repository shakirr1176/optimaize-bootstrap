{

    let uploadImageParents = document.querySelectorAll('.upload-image-parent')

    uploadImageParents.forEach(uploadImageParent=>{
        let getFile = uploadImageParent.querySelector(".getFile");
        let uploadImage = uploadImageParent.querySelector(".uploadImage");
        let getImage = uploadImageParent.querySelector(".getImage");

        getImage.addEventListener("click", () => {
            getFile.value = null;
            getFile.click();
        });

        let file = "";
        getFile.addEventListener("change", function () {
            file = this.files[0];
            let validFile = [
                "image/jpeg",
                "image/jpg",
                "image/png",
                "image/svg",
                "image/webp",
                "image/webp",
            ];
            if (file && validFile.includes(file.type)) {
                uploadImage.classList.remove("hidden");
                getImage.previousElementSibling.classList.add("hidden");
                const reader = new FileReader();
                reader.onload = function () {
                    const result = reader.result;
                    uploadImage.src = result;
                };
                reader.readAsDataURL(file);
            }
        });
    })

}
