export default class FormView {
  _emptyFieldsBoolean = false;
  _validEmailBoolean = true;
  _item;
  _items;

  _calculateTotal(e) {
    const el1 = e.target;
    const el2 =
      el1.id === "item_qty"
        ? el1.closest("div").nextElementSibling.querySelector("#item_price")
        : el1.closest("div").previousElementSibling.querySelector("#item_qty");

    const number1 = +el1.value;
    const number2 = +el2.value;

    const total = number1 * number2;
    const totalPriceEl = el1.closest("li").querySelector("#item_totalPrice");
    totalPriceEl.textContent = total.toFixed(2);
  }

  addNewItem() {
    const markupLabels = this._generateLabelsMarkup();
    const markupItem = this._generateItemMarkup();

    // Only add markupLabels on first click, not every time
    if (markupLabels)
      this._itemList.insertAdjacentHTML("afterbegin", markupLabels);

    // Add item on every button click
    this._addItemBtn.insertAdjacentHTML("beforebegin", markupItem);
    // Focus on last added element
    const lastItemAdded = Array.from(
      this._itemList.querySelectorAll(".item")
    ).slice(-1)[0];
    lastItemAdded.querySelector("#item_name").focus();

    // Add event listener to calculate total for every item
    lastItemAdded
      .querySelector("#item_qty")
      .addEventListener("input", this._calculateTotal.bind(this));
    lastItemAdded
      .querySelector("#item_price")
      .addEventListener("input", this._calculateTotal.bind(this));

    // Add event listener for deleting item
    lastItemAdded
      .querySelector(".delete_item-button")
      .addEventListener("click", this._deleteItem.bind(this));
  }

  _deleteItem(e) {
    e.preventDefault();

    const item = e.target.closest(".item");
    item.remove();

    // If there are no more items, remove labels
    if (!document.querySelector(".item"))
      document.querySelector(".item_labels").remove();
  }

  _removeItems() {
    const items = Array.from(this._itemList.querySelectorAll(".item"));
    const labels = this._itemList.querySelector(".item_labels");

    labels?.remove();
    items?.forEach((item) => item.remove());
  }

  checkForEmptyFields() {
    // mark empty fields and focus on the first one
    this._formInputs.forEach((input) => {
      if (input.value === "") this._showErrorEmpty(input);
      if (input.value !== "") this._hideErrorEmpty(input);
    });

    let firstEmptyInput = this._formInputs.find((input) => input.value === "");
    firstEmptyInput?.scrollIntoView({
      block: "center",
      behavior: "smooth",
    });
    firstEmptyInput?.focus();

    if (firstEmptyInput) return (this._emptyFieldsBoolean = true);

    return (this._emptyFieldsBoolean = false);
  }

  _showErrorEmpty(el) {
    if (
      el.parentElement.parentElement.classList.contains("flex_for_mobile") ||
      el.parentElement.parentElement.classList.contains("flex_for_tablet") ||
      el.parentElement.parentElement.classList.contains(
        "flex_for_mobile_three-items"
      )
    )
      return el.parentElement.classList.add("error_empty-input2");

    if (!el.closest("li"))
      return el.parentElement.classList.add("error_empty-input");

    // el.closest("li").classList.add("error_empty-input");
  }

  _hideErrorEmpty(el) {
    if (
      el.parentElement.parentElement.classList.contains("flex_for_mobile") ||
      el.parentElement.parentElement.classList.contains("flex_for_tablet") ||
      el.parentElement.parentElement.classList.contains(
        "flex_for_mobile_three-items"
      )
    )
      return el.parentElement.classList.contains("error_empty-input2")
        ? el.parentElement.classList.remove("error_empty-input2")
        : "";

    if (!el.closest("li"))
      return el.parentElement.classList.contains("error_empty-input")
        ? el.parentElement.classList.remove("error_empty-input")
        : "";

    el.closest("li").classList.contains("error_empty-input")
      ? el.closest("li").classList.remove("error_empty-input")
      : "";
  }

  validEmail() {
    const email = this._emailInput.value;

    // if valid email, return
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      this._hideErrorEmail(this._emailInput);
      return (this._validEmailBoolean = true);
    }

    // if not valid email, show error
    // focus on email input error if there are no empty inputs
    if (!this._emptyFieldsBoolean) {
      this._emailInput.scrollIntoView({
        block: "center",
        behavior: "smooth",
      });
      this._emailInput.focus();
    }
    // set cursor at the end of input value by deleting and creating value again
    let value = this._emailInput.value;
    this._emailInput.value = "";
    this._emailInput.value = value;
    this._showErrorEmail(this._emailInput);
    return (this._validEmailBoolean = false);
  }

  _showErrorEmail(el) {
    el.parentElement.classList.add("error_empty-input-email");
  }

  _hideErrorEmail(el) {
    el.parentElement.classList.contains("error_empty-input-email")
      ? el.parentElement.classList.remove("error_empty-input-email")
      : "";
  }

  anyItems() {
    this._item = document.querySelector(".item");
    // if there is at least 1 item, return
    if (this._item) {
      this._hideErrorItems(this._itemList);
      if (this._checkValues(this._focusElement)) return false;
      return true;
    }

    // if there are no items, show error
    this._showErrorItems(this._itemList);
    if (!this._emptyFieldsBoolean && this._validEmailBoolean) {
      this._focusElement.focus();
      this._focusElement.scrollIntoView();
    }

    return false;
  }

  _showErrorItems(el) {
    el.classList.add("error_no-items");
  }

  _hideErrorItems(el) {
    el.classList.contains("error_no-items")
      ? el.classList.remove("error_no-items")
      : "";
  }

  _checkValues(focusElement) {
    this._items = Array.from(document.querySelectorAll(".item"));
    let error = false;
    this._items.forEach((item) => {
      const qtyEl = item.querySelector("#item_qty");
      const priceEl = item.querySelector("#item_price");
      const qty = qtyEl.value;
      const price = priceEl.value;

      if (qty !== "" && +qty < 1) {
        this._showErrorValue(qtyEl, focusElement);
        error = true;
      } else {
        this._hideErrorValue(qtyEl);
      }

      if (price !== "" && +price <= 0) {
        this._showErrorValue(priceEl, focusElement);
        error = true;
      } else {
        this._hideErrorValue(priceEl);
      }
    });

    if (!error && focusElement.classList.contains("error_value"))
      focusElement.classList.remove("error_value");

    return error;
  }

  _showErrorValue(el, focusElement) {
    el.parentElement.classList.add("error_empty-input2");
    focusElement.classList.add("error_value");

    // focus if there are no empty fields and if email is okay
    if (!this._emptyFieldsBoolean && this._validEmailBoolean) {
      this._focusElement.focus();
      this._focusElement.scrollIntoView();
    }
  }

  _hideErrorValue(el) {
    el.parentElement.classList.contains("error_empty-input2")
      ? el.parentElement.classList.remove("error_empty-input2")
      : "";
  }

  _generateLabelsMarkup() {
    if (document.querySelector(".item_labels")) return false;

    return `
    <div class="item_labels hidden-for-mobile flex_for_tablet">
      <p class="font-body faded-color">Item Name</p>
      <p class="font-body faded-color">Qty.</p>
      <p class="font-body faded-color">Price</p>
      <p class="font-body faded-color">Total</p>
    </div>
    `;
  }
}
