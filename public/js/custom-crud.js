{
  let fetchData = async function fetchData(obj) {
    let { route, form, relations, options, modalWrapper } = obj;

    try {
      modalWrapper?.classList.add("loading");

      let response = await fetch(route);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      let data = await response.json();

      if (data.success) {
        modalWrapper?.classList.remove("loading");

        data = data.data;

        if (form) {
          let formData = new FormData(form);
          let keyWithoutArray;

          for (let [key] of formData) {
            if (key.endsWith("[]")) {
              keyWithoutArray = key.replace("[", "").replace("]", "");
              if (keyWithoutArray in data) {
                insertValueOnField(key, form, data, options);
              }
            }

            if (key in data) {
              insertValueOnField(key, form, data, options);
            }

            if (relations?.length) {
              relations.forEach((relation) => {
                if (key.endsWith("[]")) {
                  if (keyWithoutArray in data[relation]) {
                    insertValueOnField(key, form, data[relation], options);
                  }
                }

                if (key in data[relation]) {
                  insertValueOnField(key, form, data[relation], options);
                }
              });
            }
          }
        }

        return data;
      } else {
        throw new Error("Data fetch was not successful");
      }
    } catch (error) {
      modalWrapper?.classList.remove("loading");
      return null;
    }
  };
  function insertValueOnField(index, form, data, fetchOptions) {
    if (index.endsWith("[]")) {
      let multipleSelectFields = form.querySelectorAll("select[multiple]");
      if (multipleSelectFields.length) {
        processForMultipleSelect(index, form, multipleSelectFields, data);
        return;
      }
    }

    let field = form.querySelectorAll(`[name=${index}]`)[0];
    let options;

    if (field.getAttribute("type") == "file") {
      field.src = data[index];
    } else if (
      field.type === "text" ||
      field.type === "date" ||
      field.type === "number" ||
      field.type === "email" ||
      field.type === "hidden"
    ) {
      field.value = data[index];
    } else if (field.type === "radio") {
      form.querySelectorAll(`[name=${index}]`).forEach((radio) => {
        if (radio.hasAttribute("checked")) {
          radio.removeAttribute("checked");
        }

        if (radio.value === data[index]) {
          radio.setAttribute("checked", true);
        }
      });
    } else if (field.type === "textarea") {
      field.innerHTML = data[index];
    } else if (field.type === "select-one") {
      let parent = field.closest(".custom-select");
      if (parent) {
        let selectSelected = parent.querySelector(".select-selected");
        let optionItems = parent.querySelectorAll(".select-items > div");

        optionItems?.forEach((element) => {
          element.removeAttribute("class");
          selectSelected.innerHTML = "Please Select";
          if (element.getAttribute("data-value") == data[index]) {
            selectSelected.innerHTML = element.innerHTML;
            element.className = "same-as-selected active";
          }
        });
        options = field.querySelectorAll("option");
        options?.forEach((element) => {
          element.removeAttribute("selected");
          if (element.value == data[index]) {
            element.setAttribute("selected", "");
          }
        });
      } else {
        try {
          if (fetchOptions["choice_instance"]) {
            let id = field.id;
            let selecteInstant = fetchOptions["choice_instance"][id];

            selecteInstant.setChoiceByValue(data[index]);
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
  }

  async function submit(route, form, method, submitButtonId, isLoad = true) {
    let formData = new FormData(form);
    formData.append(
      "_token",
      document.querySelector('meta[name="csrf-token"]').content
    );
    if (method !== "POST") {
      formData.append("_method", method);
    }

    document
      .querySelector(`#${submitButtonId}`)
      ?.classList.add("pointer-events-none");

    try {
      const response = await fetch(route, {
        headers: {
          Accept: "application/json",
        },
        method: "post",
        body: formData,
      });

      if (!response.ok) {
        throw response;
      }

      const data = await response.json();

      document
        .querySelector(`#${submitButtonId}`)
        ?.classList.remove("pointer-events-none");

      if (data?.data?.redirect_url) {
        location.replace(data.data.redirect_url);
      } else {
        if (isLoad) {
          location.reload();
        } else {
          form.parentElement.classList.add("hidden");
          form.reset();
        }
      }
    } catch (errors) {
      errorHandler(errors, form, submitButtonId);
    }
  }

  function processForMultipleSelect(index, form, multipleSelectFields, data) {
    multipleSelectFields.forEach((multipleSelectField) => {
      if (index === multipleSelectField.name) {
        let options;
        let indexWithoutArray = index.replace("[", "").replace("]", "");
        options = multipleSelectField.querySelectorAll("option");
        options?.forEach((option) => {
          if (option.value === "-100") {
            multipleSelectField.remove(option.index);
          }

          if (data[indexWithoutArray].length) {
            data[indexWithoutArray].forEach((data) => {
              if (data == option.value) {
                option.setAttribute("selected", "");
              }
            });
          }
        });
        let oldElements = form.querySelectorAll(".multiselect-dropdown");
        oldElements.forEach((oldElement) => {
          oldElement.remove();
        });
        multipleSelectDropdownCall(); // it's used from multi-select-dropdown.js file
        return true;
      }
    });
  }

  function errorHandler(errors, form, submitButtonId) {
    document
      .querySelector(`#${submitButtonId}`)
      ?.classList.remove("pointer-events-none");

    if (errors.status === 422) {
      let name;
      errors.json().then((errorMessages) => {
        let formData = new FormData(form);

        let specialInput = form.querySelectorAll(".check-for-error");

        if (specialInput) {
          let isAtLestOneCheck = [...specialInput].some(
            (el) => el.checked == true
          );
          if (!isAtLestOneCheck) {
            if (specialInput[0] && specialInput[0].dataset.name) {
              let name = specialInput[0].dataset.name.replace(/\[\]/g, "");
              formData.append(name, "");
            }
          }
        }

        for (let [name] of formData) {
          if (name === "_token") {
            continue;
          }
          name = name
            .replace(/\[\]/g, "")
            .replace(/\]\[/g, ".")
            .replace("]", "")
            .replace("[", ".")
            .replace(/\'/g, "");
          setErrorMessage(form, name);

          if (name in errorMessages.errors) {
            setErrorMessage(form, name, errorMessages.errors[name][0]);
          }
        }
      });
    } else {
      flashBox("error", errors.statusText);
    }
  }

  let resetErrorMessages = async function resetErrorMessages(form) {
    let formData = new FormData(form);
    for (let [name] of formData) {
      if (name === "_token") {
        continue;
      }

      setErrorMessage(form, name);
    }
  };

  function setErrorMessage(form, name, error = "") {
    name = name.replace(/\./g, "-").replace(/\'/g, "");

    let errorField = form.querySelector(`.${name}:not(.jselect__hidden)`);

    if (errorField) {
      errorField.classList.add("hidden");
      errorField.classList.remove("active");
      if (error != "") {
        errorField.classList.remove("hidden");
        errorField.classList.add("active");
      }
      errorField.innerHTML = error;
    }
  }

  window.fetchData = fetchData;
  window.submit = submit;
  window.resetErrorMessages = resetErrorMessages;
  window.insertValueOnField = insertValueOnField;
}
