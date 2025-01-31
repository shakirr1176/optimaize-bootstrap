# anyToggle Usage Guide

## Overview
`anyToggle` is a global object that provides custom event handling for the toggle modal system. It allows you to execute custom functions when a toggle action occurs or when a modal is closed using a cancel button.

## Defining Custom Actions
You can define custom behaviors using the `anyToggle` object. The available properties are:

### 1. `anyToggle.action`
Called when a toggle action occurs (i.e., when a header element is clicked).

#### Example:
```js
anyToggle.action = ({ groupButtons, thisHeader, thisHeaderIndex, groupContents, thisContent, thisContentIndex }) => {
    console.log("Header clicked:", thisHeader);
    console.log("Content toggled:", thisContent);
    console.log("All headers in group:", groupButtons);
    console.log("All contents in group:", groupContents);
};
```

#### Parameters:
- `groupButtons` (NodeList) – All header elements in the group.
- `thisHeader` (HTMLElement) – The clicked header element.
- `thisHeaderIndex` (number) – Index of the clicked header within the group.
- `groupContents` (NodeList) – All content elements in the group.
- `thisContent` (HTMLElement | undefined) – The associated content element.
- `thisContentIndex` (number) – Index of the associated content within the group.

---

### 2. `anyToggle.cancel`
Called when a modal or toggleable content is closed via an outside click or cancel button.

#### Example:
```js
anyToggle.cancel = ({ thisCancelBtn, thisHeader, thisContent, outsideClickActiveHeaders, outsideClickActiveContents }) => {
    console.log("Cancel button clicked:", thisCancelBtn);
    console.log("Header being closed:", thisHeader);
    console.log("Content being closed:", thisContent);
    console.log("Other active headers:", outsideClickActiveHeaders);
    console.log("Other active contents:", outsideClickActiveContents);
};
```

#### Parameters:
- `thisCancelBtn` (HTMLElement | undefined) – The cancel button clicked.
- `thisHeader` (HTMLElement | undefined) – The header element being closed.
- `thisContent` (HTMLElement | undefined) – The content element being closed.
- `outsideClickActiveHeaders` (NodeList) – Other active headers being closed due to outside click.
- `outsideClickActiveContents` (NodeList) – Other active contents being closed due to outside click.

---

## Example Usage
### Basic Toggle with Custom Events
```js
anyToggle.action = ({ thisHeader, thisContent }) => {
    thisHeader.style.backgroundColor = "lightblue";
    console.log("Opened section:", thisHeader.textContent);
};

anyToggle.cancel = ({ thisHeader }) => {
    if (thisHeader) thisHeader.style.backgroundColor = "";
    console.log("Closed section:", thisHeader ? thisHeader.textContent : "Unknown");
};
```

### Example HTML Structure
```html
<button data-role="header" data-group="menu" data-name="menu1" data-mode="toggle">
    Menu 1
</button>
<div data-role="content" data-group="menu" data-name="menu1">
    Menu Content
    <button data-role="cancel" data-group="menu" data-name="menu1">Close</button>
</div>
```

## Conclusion
`anyToggle` provides an easy way to add custom behavior to your modal system. By defining `anyToggle.action` and `anyToggle.cancel`, you can control the behavior of modals, dropdowns, or any other toggleable elements based on user interactions.

