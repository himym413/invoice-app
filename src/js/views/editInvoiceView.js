import { mark } from "regenerator-runtime";
import FormView from "./FormView";

class EditInvoiceView extends FormView {
  _editInvoiceButtons;
  _editInvoiceForm;
  _overlay = document.querySelector(".overlay");
  _hideFormMobileButton = document.querySelector(
    "#invoice .editForm .go-back-button"
  );
  _hideFormCancelButton = document.querySelector(
    "#invoice .editForm .cancel-button"
  );
  _statusEl;
  _idEl;
  _dateEl = document.querySelector("#invoice #date_to");
  _paymentEl = document.querySelector("#invoice #payment_to");
  _addItemBtn = document.querySelector("#invoice .add_item-button");
  _saveChangesBtn = document.querySelector("#invoice .save-button");
  _formInputs = Array.from(document.querySelectorAll("#invoice input"));
  _emailInput = document.querySelector("#invoice #clients_email_to");
  _itemList = document.querySelector("#invoice .item_list");
  // element to add error to
  _focusElement = document.querySelector("#invoice .form_header-list");

  addHandlerToggleEditInvoiceForm(handler) {
    // Wait for load to target buttons and form, then add handler
    window.addEventListener("load", () => {
      this._editInvoiceButtons = Array.from(
        document.querySelectorAll(".edit_button")
      );
      this._editInvoiceForm = document.querySelector(".editForm");

      this._editInvoiceButtons.forEach((btn) =>
        btn.addEventListener("click", handler)
      );
    });

    // Events for hiding form added here so they are added only once, not every time form is displayed
    [
      this._overlay,
      this._hideFormMobileButton,
      this._hideFormCancelButton,
    ].forEach((el) =>
      el.addEventListener("click", this._hideEditInvoiceForm.bind(this))
    );
  }

  showEditInvoiceForm(id) {
    this._editInvoiceForm.classList.remove("hide");
    this._overlay.classList.remove("hide");

    // disable body scroll
    document.body.style.overflow = "hidden";
    document.body.style.height = "100%";

    // header with id, if it already exists, remove it
    const headerIdEl = document.querySelector(".form_header");
    if (headerIdEl) headerIdEl.remove();
    const markup = this._generateHeaderIDMarkup(id);
    const el = document.querySelector(".form_header-from");
    el.insertAdjacentHTML("beforebegin", markup);
  }

  _hideEditInvoiceForm(e) {
    e?.preventDefault();

    // hide errors displayed earlier
    if (
      e.target.classList.contains("cancel-button") ||
      e.target.classList.contains("go-back-button")
    ) {
      this._hideAllErrors();
    }
    // Remove items so it does not load same items on every click
    this._removeItems();
    this._editInvoiceForm.classList.add("hide");
    this._overlay.classList.add("hide");

    // enabling body scroll which was previously disabled
    document.body.style.overflow = "auto";
    document.body.style.height = "auto";
  }

  _hideAllErrors() {
    // get elements
    const err1 = Array.from(document.querySelectorAll(".error_empty-input"));
    this._hideError(err1, "error_empty-input");

    const err2 = Array.from(document.querySelectorAll(".error_empty-input2"));
    this._hideError(err2, "error_empty-input2");

    const err3 = Array.from(
      document.querySelectorAll(".error_empty-input-email")
    );
    this._hideError(err3, "error_empty-input-email");

    const err4 = Array.from(document.querySelectorAll(".error_no-items"));
    this._hideError(err4, "error_no-items");

    const err5 = Array.from(document.querySelectorAll(".error_value"));
    this._hideError(err5, "error_value");
  }

  _hideError(arr, error) {
    if (arr.length < 0) return;

    arr.forEach((el) => el.classList.remove(`${error}`));
  }

  setInvoiceDate(date) {
    this._dateEl.textContent = date;
  }

  setInvoicePayment(numberOfDays) {
    this._paymentEl.textContent = `Net ${numberOfDays} Day${
      numberOfDays > 1 ? "s" : ""
    }`;
  }

  fillFormElements(invoice) {
    // Get elements
    const senderStreetEl = document.getElementById("street_address_from");
    const senderCityEl = document.getElementById("city_from");
    const senderPostCodeEl = document.getElementById("post_code_from");
    const senderCountryEl = document.getElementById("country_from");
    const sender = [
      senderStreetEl,
      senderCityEl,
      senderPostCodeEl,
      senderCountryEl,
    ];

    const clientStreetEl = document.getElementById("street_address_to");
    const clientCityEl = document.getElementById("city_to");
    const clientPostCodeEl = document.getElementById("post_code_to");
    const clientCountryEl = document.getElementById("country_to");
    const client = [
      clientStreetEl,
      clientCityEl,
      clientPostCodeEl,
      clientCountryEl,
    ];

    const clientNameEl = document.getElementById("clients_name_to");
    const clientEmailEl = document.getElementById("clients_email_to");
    const descriptionEl = document.getElementById("description_to");

    // Set elements values
    sender.forEach(
      (el, i) => (el.value = Object.values(invoice.senderAddress)[i])
    );
    client.forEach(
      (el, i) => (el.value = Object.values(invoice.clientAddress)[i])
    );
    clientNameEl.value = invoice.clientName;
    clientEmailEl.value = invoice.clientEmail;
    descriptionEl.value = invoice.description;

    if (invoice.items.length > 0)
      invoice.items.forEach((item) => this._addItem(item));
  }

  _addItem(item) {
    const markupLabels = this._generateLabelsMarkup();
    const markupItem = this._generateItemMarkup(item);
    // Only add markupLabels on first click, not every time
    if (markupLabels)
      this._itemList.insertAdjacentHTML("afterbegin", markupLabels);
    // Add item on every button click
    this._addItemBtn.insertAdjacentHTML("beforebegin", markupItem);
    // Get last added element
    const lastItemAdded = Array.from(
      this._itemList.querySelectorAll(".item")
    ).slice(-1)[0];
    // Add event listener to calculate total for every item
    lastItemAdded
      .querySelector("#item_qty")
      .addEventListener("input", this._calculateTotal.bind(this));
    lastItemAdded
      .querySelector("#item_price")
      .addEventListener("input", this._calculateTotal.bind(this));
    // Add event listener for deleting an item
    lastItemAdded
      .querySelector(".delete_item-button")
      .addEventListener("click", this._deleteItem.bind(this));
  }

  addHandlerSaveChanges(handler) {
    this._saveChangesBtn.addEventListener("click", handler);
  }

  addHandlerAddDeleteItem(handler) {
    this._addItemBtn.addEventListener("click", handler);
  }

  getInvoiceData(draft = false) {
    this._statusEl = document.querySelector(".status_card-status p");
    this._idEl = document.querySelector(".form_header");
    let invoice = {
      id: this._idEl.textContent.trim().split("#")[1] || "",
      createdAt: this._dateEl.textContent,
      paymentDue: this._getPaymentDue(
        this._dateEl.textContent,
        +this._paymentEl.textContent.replace(/\D/g, "")
      ),
      description: this._getInputValue(this._formInputs, "description_to"),
      paymentTerms: +this._paymentEl.textContent.replace(/\D/g, ""),
      clientName: this._getInputValue(this._formInputs, "clients_name_to"),
      clientEmail: this._getInputValue(this._formInputs, "clients_email_to"),
      status:
        this._statusEl?.textContent.toLowerCase() === "paid"
          ? "paid"
          : draft
          ? "draft"
          : "pending",
      senderAddress: {
        street: this._getInputValue(this._formInputs, "street_address_from"),
        city: this._getInputValue(this._formInputs, "city_from"),
        postCode: this._getInputValue(this._formInputs, "post_code_from"),
        country: this._getInputValue(this._formInputs, "country_from"),
      },
      clientAddress: {
        street: this._getInputValue(this._formInputs, "street_address_to"),
        city: this._getInputValue(this._formInputs, "city_to"),
        postCode: this._getInputValue(this._formInputs, "post_code_to"),
        country: this._getInputValue(this._formInputs, "country_to"),
      },
      items: [],
      total: 0,
    };

    // Check if there are any items, if there are, start pushing one by one
    let items = Array.from(document.querySelectorAll(".item"));
    if (items.length === 0) return invoice;

    items.forEach((item) => {
      let object = {
        name: item.querySelector("#item_name").value,
        quantity: +item.querySelector("#item_qty").value,
        price: +item.querySelector("#item_price").value,
        total:
          +item.querySelector("#item_qty").value *
          +item.querySelector("#item_price").value,
      };

      invoice.items.push(object);
    });

    // Get total invoice price
    let invoiceTotal = 0;
    invoice.items.forEach((item) => (invoiceTotal += item.total));
    invoice.total = invoiceTotal;

    return invoice;
  }

  _getInputValue(arr, id) {
    return arr.find((inp) => inp.id === id).value;
  }

  _getPaymentDue(date, days) {
    let paymentDueDate = new Date(date);
    paymentDueDate.setDate(paymentDueDate.getDate() + days);
    return paymentDueDate;
  }

  _generateHeaderIDMarkup(id) {
    return `
    <h2 class="form_header | font-heading-M">
      Edit <span class="faded-color">#</span>${id}
    </h2>
        `;
  }

  _generateItemMarkup(item) {
    if (!item) item = "";
    return `
    <li class="flex_for_tablet item">
      <div>
        <label for="item_name" class="font-body faded-color"
          >Item Name</label>
        <input
          type="text"
          name="item_name"
          id="item_name"
          class="font-heading-S-2 dark-color"
          value="${item.name || ""}"
        />
      </div>
      <div class="flex flex_for_mobile_three-items">
        <div>
          <label for="item_qty" class="font-body faded-color">Qty.</label>
          <input
            type="number"
            min="1"
            name="item_qty"
            id="item_qty"
            class="font-heading-S-2 dark-color"
            value="${item.quantity || ""}"
            />
            </div>
            <div>
            <label for="item_price" class="font-body faded-color">Price</label>
          <input
          type="number"
          step=".01"
          min="1"
          name="item_price"
          id="item_price"
          class="font-heading-S-2 dark-color"
          value="${item.price || ""}"
          />
          </div>
          <div>
          <p class="false_label | font-body faded-color">Total</p>
          <p id="item_totalPrice" class="false_input | font-heading-S-2 faded-color">${
            item.total || "0.00"
          }</p>
          </div>
          <button class="delete_item-button">
          <svg width="13" height="16" xmlns="http://www.w3.org/2000/svg"><path d="M11.583 3.556v10.666c0 .982-.795 1.778-1.777 1.778H2.694a1.777 1.777 0 01-1.777-1.778V3.556h10.666zM8.473 0l.888.889h3.111v1.778H.028V.889h3.11L4.029 0h4.444z" fill="#888EB0" fill-rule="nonzero"/></svg>
          </button>
          </div>
    </li>
    `;
  }
}

export default new EditInvoiceView();
