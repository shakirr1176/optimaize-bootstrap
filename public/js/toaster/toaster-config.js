let toasterConfig = {
  gap: 32,
  defaultStatus: "info",

  cancelIcon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
  </svg>`,

  toasters: {
    error: {
      title: "error",
      body: "There is something wrong",
      statusIcon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
              `,
      stay: 3000,
    },

    warning: {
      title: "warning",
      body: "Something shouldn't happen",
      statusIcon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
              `,
      stay: 3000,
    },

    success: {
      title: "success",
      body: "Operation done successfully",
      statusIcon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              `,
      stay: 3000,
    },

    info: {
      title: "info",
      body: "Information",
      statusIcon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.25-8.25-3.286Zm0 13.036h.008v.008H12v-.008Z" />
              </svg>
              `,
      stay: 3000,
    },
  },
};

let template = function ({ status, cancelIcon, statusIcon, title, body }) {
  return `
        <div class="toaster-pop-up ${status}">
            <button class="toaster-cancel-btn">${
              cancelIcon ? cancelIcon : "x"
            }</button>
            ${
              statusIcon
                ? `<span class="icon-wrapper">${statusIcon}</span>`
                : ""
            }
            <div class="msg-body">
                ${title ? `<h3 class="title">${title}</h3>` : ""}
                ${body ? `<p class="msg">${body}</p>` : ""}
            </div>
        </div>`;
};
