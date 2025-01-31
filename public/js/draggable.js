function initializeDrag(dragEndCallBack = null) {
    let listContainer;
    let draggableItem;
    let pointerStartX;
    let pointerStartY;
    let itemsGap = 0;
    let items = [];
    let lastItemPrevIndex;
    let lastItemCurrentIndex;
  
    function getAllItems() {
      items = [...listContainer.querySelectorAll('.list__item')];
      return items;
    }
  
    function getIdleItems() {
      return getAllItems().filter((item) => item.classList.contains('is-idle'));
    }
  
    function isItemAbove(item) {
      return item.hasAttribute('data-is-above');
    }
  
    function isItemToggled(item) {
      return item.hasAttribute('data-is-toggled');
    }
  
    // Setup
    function setup() {
      listContainer = document.querySelector('.js-list');
  
      if (!listContainer) return;
  
      listContainer.addEventListener('mousedown', dragStart);
      listContainer.addEventListener('touchstart', dragStart);
  
      document.addEventListener('mouseup', dragEnd);
      document.addEventListener('touchend', dragEnd);
    }
  
    // Drag Start
    function dragStart(e) {
      // Check if the item has the 'not-draggable' class and prevent dragging if so
      if (
        !listContainer.classList.contains('editing') &&
        e.target.closest('.drag-with') &&
        !e.target.closest('.not-draggable')
      ) {
        draggableItem = e.target.closest('.list__item');
      }
  
      if (!draggableItem || draggableItem.classList.contains('not-draggable')) return;
  
      pointerStartX = e.clientX || e.touches[0].clientX;
      pointerStartY = e.clientY || e.touches[0].clientY;
  
      setItemsGap();
      disablePageScroll();
      initDraggableItem();
      initItemsState();
  
      document.addEventListener('mousemove', drag);
      document.addEventListener('touchmove', drag, {
        passive: false,
      });
    }
  
    function setItemsGap() {
      if (getIdleItems().length <= 1) {
        itemsGap = 0;
        return;
      }
  
      const item1 = getIdleItems()[0];
      const item2 = getIdleItems()[1];
  
      const item1Rect = item1.getBoundingClientRect();
      const item2Rect = item2.getBoundingClientRect();
  
      itemsGap = Math.abs(item1Rect.bottom - item2Rect.top);
    }
  
    function disablePageScroll() {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
      document.body.style.userSelect = 'none';
    }
  
    function initItemsState() {
      getIdleItems().forEach((item, i) => {
        if (getAllItems().indexOf(draggableItem) > i) {
          item.dataset.isAbove = '';
        }
      });
    }
  
    function initDraggableItem() {
      draggableItem.classList.remove('is-idle');
      draggableItem.classList.add('is-draggable');
    }
  
    // Drag
    function drag(e) {
      if (!draggableItem || draggableItem.classList.contains('not-draggable')) return;
  
      e.preventDefault();
  
      const clientX = e.clientX || e.touches[0].clientX;
      const clientY = e.clientY || e.touches[0].clientY;
  
      const pointerOffsetX = clientX - pointerStartX;
      const pointerOffsetY = clientY - pointerStartY;
  
      draggableItem.style.transform = `translate(${pointerOffsetX}px, ${pointerOffsetY}px)`;
      draggableItem.classList.add('is-moved');
      updateIdleItemsStateAndPosition();
    }
  
    function updateIdleItemsStateAndPosition() {
      const draggableItemRect = draggableItem.getBoundingClientRect();
      const draggableItemY = draggableItemRect.top + draggableItemRect.height / 2;
  
      // Update state
      getIdleItems().forEach((item) => {
        // Skip items with the 'not-draggable' class
        if (item.classList.contains('not-draggable')) return;
  
        const itemRect = item.getBoundingClientRect();
        const itemY = itemRect.top + itemRect.height / 2;
  
        if (isItemAbove(item)) {
          if (draggableItemY <= itemY) {
            item.dataset.isToggled = '';
          } else {
            delete item.dataset.isToggled;
          }
        } else {
          if (draggableItemY >= itemY) {
            item.dataset.isToggled = '';
          } else {
            delete item.dataset.isToggled;
          }
        }
      });
  
      // Update position
      getIdleItems().forEach((item) => {
        // Skip items with the 'not-draggable' class
        if (item.classList.contains('not-draggable')) return;
  
        if (isItemToggled(item)) {
          const direction = isItemAbove(item) ? 1 : -1;
          item.style.transform = `translateY(${direction * (draggableItemRect.height + itemsGap)}px)`;
        } else {
          item.style.transform = '';
        }
      });
    }
  
    // Drag End
    function dragEnd() {
      if (!draggableItem || draggableItem.classList.contains('not-draggable')) return;
  
      draggableItem.classList.add('last-drag-item');
  
      let draggableItemRect = draggableItem.getBoundingClientRect();
  
      let prevY = draggableItemRect.top;
      let prevX = draggableItemRect.left;
  
      lastItemPrevIndex = getAllItems().indexOf(draggableItem);
  
      applyNewItemsOrder();
  
      cleanup();
  
      let lastDragItem = document.querySelector('.last-drag-item');
  
      lastItemCurrentIndex = getAllItems().indexOf(lastDragItem);
  
      let lastDragItemReact = lastDragItem.getBoundingClientRect();
  
      let curY = lastDragItemReact.top;
      let curX = lastDragItemReact.left;
  
      let passedX = prevX - curX;
      let passedY = prevY - curY;
  
      if (lastDragItem.classList.contains('is-moved')) {
        lastDragItem.style.transition = '0ms';
        lastDragItem.style.transform = `translate(${passedX}px,${passedY}px)`;
  
        requestAnimationFrame(() => {
          lastDragItem.classList.add('pointer-events-none');
          lastDragItem.style.transition = '0.25s ease transform';
          lastDragItem.style.transform = `translate(0,0)`;
        });
  
        lastDragItem.addEventListener('transitionend', transitionend);
  
        function transitionend() {
          lastDragItem.style.transition = null;
          lastDragItem.classList.remove(
            'pointer-events-none',
            'last-drag-item',
            'is-moved'
          );
        }
      } else {
        lastDragItem.classList.remove('last-drag-item');
      }
  
      if (dragEndCallBack) {
        dragEndCallBack({ lastDragItem, lastItemPrevIndex, lastItemCurrentIndex });
      }
    }
  
    function applyNewItemsOrder() {
      const reorderedItems = [];
      getAllItems().forEach((item, index) => {
        // Ignore 'not-draggable' items in the reordering
        if (item === draggableItem || item.classList.contains('not-draggable')) {
          return;
        }
        if (!isItemToggled(item)) {
          reorderedItems[index] = item;
          return;
        }
        const newIndex = isItemAbove(item) ? index + 1 : index - 1;
        reorderedItems[newIndex] = item;
      });
      for (let index = 0; index < getAllItems().length; index++) {
        const item = reorderedItems[index];
        if (typeof item === 'undefined') {
          reorderedItems[index] = draggableItem;
        }
      }
  
      reorderedItems.forEach((item) => {
        listContainer.appendChild(item);
      });
    }
  
    function cleanup() {
      itemsGap = 0;
      items = [];
  
      unsetDraggableItem();
      unsetItemState();
      enablePageScroll();
  
      document.removeEventListener('mousemove', drag);
      document.removeEventListener('touchmove', drag);
    }
  
    function unsetDraggableItem() {
      draggableItem.style = null;
      draggableItem.classList.remove('is-draggable');
      draggableItem.classList.add('is-idle');
      draggableItem = null;
    }
  
    function unsetItemState() {
      getIdleItems().forEach((item, i) => {
        delete item.dataset.isAbove;
        delete item.dataset.isToggled;
        item.style.transform = '';
      });
    }
  
    function enablePageScroll() {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
      document.body.style.userSelect = '';
    }
  
    setup();
  }
  
  window.initializeDrag = initializeDrag;
  