import FormView from "../views/FormView";

class NewInvoiceView extends FormView {
  _newInvoiceButton = document.querySelector(
    ".secondary_header-right-newInvoice-button"
  );
  _newInvoiceForm = document.querySelector(".newForm");
  _overlay = document.querySelector(".overlay");
  _hideFormMobileButton = document.querySelector("#home .go-back-button");
  _statusEl;
  _idEl;
  _dateEl = document.querySelector("#home #date_to");
  _paymentEl = document.querySelector("#home #payment_to");
  _addItemBtn = document.querySelector("#home .add_item-button");
  _formInputs = Array.from(document.querySelectorAll("#home input"));
  _emailInput = document.querySelector("#home #clients_email_to");
  _itemList = document.querySelector("#home .item_list");
  // element to add error to
  _focusElement = document.querySelector("#home .form_header-list");
  _saveInvoiceButton;
  _saveDraftButton;

  addHandlerToggleNewInvoiceForm(handler) {
    this._newInvoiceButton?.addEventListener("click", handler);
  }

  showNewInvoiceForm() {
    this._newInvoiceForm.classList.remove("hide");
    this._overlay.classList.remove("hide");

    // disable body scroll
    document.body.style.overflow = "hidden";
    document.body.style.height = "100%";

    this._newInvoiceForm.querySelector("#street_address_from").focus();

    // Events for hiding form
    [this._overlay, this._hideFormMobileButton].forEach((el) =>
      el.addEventListener("click", this._hideNewInvoiceForm.bind(this))
    );
  }

  _hideNewInvoiceForm(e) {
    e?.preventDefault();
    this._newInvoiceForm.classList.add("hide");
    this._overlay.classList.add("hide");

    // enabling body scroll which was previously disabled
    document.body.style.overflow = "auto";
    document.body.style.height = "auto";
  }

  setInvoiceDate(date) {
    this._dateEl.textContent = date;
  }

  addHandlerAddDeleteItem(handler) {
    this._addItemBtn.addEventListener("click", handler);
  }

  addHandlerDiscardInvoice(handler) {
    let discardBtn = document.querySelector("#home .newForm .cancel-button");
    discardBtn.addEventListener("click", handler);
  }

  showDiscardModal() {
    const markup = this._generateDiscardModalMarkup();
    document.body.insertAdjacentHTML("afterbegin", markup);

    const modalOverlay = document.querySelector(".overlay_delete-modal");
    const cancelBtn = document.querySelector(".delete-modal_cancelBtn");
    const confirmBtn = document.querySelector(".delete-modal_deleteBtn");

    [modalOverlay, cancelBtn].forEach((el) =>
      el.addEventListener("click", this._hideDiscardModal)
    );

    confirmBtn.addEventListener("click", this.resetInvoice.bind(this));
  }

  _hideDiscardModal() {
    const discardModal = document.querySelector(".delete-modal");
    const modalOverlay = document.querySelector(".overlay_delete-modal");
    [discardModal, modalOverlay].forEach((el) => el?.remove());
  }

  resetInvoice() {
    this._hideDiscardModal();
    this._clearFields();
    this._setDefaultPayment();
    this._removeItems();
    this._hideNewInvoiceForm();
  }

  _clearFields() {
    const formInputs = document.querySelectorAll("#home .newForm input");
    formInputs.forEach((input) => {
      input.value = "";
      input.parentElement.classList.contains("error_empty-input2")
        ? input.parentElement.classList.remove("error_empty-input2")
        : "";
      input.closest("div").classList.contains("error_empty-input")
        ? input.closest("div").classList.remove("error_empty-input")
        : "";
      input.parentElement.classList.contains("error_empty-input-email")
        ? input.parentElement.classList.remove("error_empty-input-email")
        : "";
    });

    const itemList = document.querySelector("#home .item_list");
    itemList.classList.contains("error_no-items")
      ? itemList.classList.remove("error_no-items")
      : "";
  }

  _setDefaultPayment() {
    document.querySelector("#home #payment_to").textContent = "Net 30 Days";
  }

  addHandlerSaveInvoice(handler) {
    this._saveInvoiceButton = document.querySelector("#home .save-button");
    this._saveInvoiceButton.addEventListener("click", handler);
    this._newInvoiceForm.addEventListener("keydown", handler);
  }

  addHandlerSaveDraft(handler) {
    this._saveDraftButton = document.querySelector("#home .draft-button");
    this._saveDraftButton.addEventListener("click", handler);
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

  _generateDiscardModalMarkup() {
    return `
    <div class="overlay_delete-modal"></div>
    
    <div class="delete-modal ">
      <h2 class="font-heading-M dark-color">Confirm Deletion</h2>
      <p class="font-body faded-color">
        Are you sure you want to discard invoice?
      </p>
      <div class="flex">
        <button class="delete-modal_cancelBtn | font-heading-S-2 faded-color">
          Cancel
        </button>
        <button class="delete-modal_deleteBtn | font-heading-S-2 light-color">
          Discard
        </button>
      </div>
    </div>
    `;
  }

  _generateItemMarkup() {
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
        />
      </div>
      <div class="flex flex_for_mobile_three-items">
        <div>
          <label for="item_qty" class="font-body faded-color">Qty.</label>
          <input
            type="number"
            name="item_qty"
            id="item_qty"
            class="font-heading-S-2 dark-color"
            min="1"
          />
        </div>
        <div>
          <label for="item_price" class="font-body faded-color">Price</label>
          <input
            type="number"
            step=".01"
            name="item_price"
            id="item_price"
            class="font-heading-S-2 dark-color"
            min="1"
          />
        </div>
        <div>
          <p class="false_label | font-body faded-color">Total</p>
          <p id="item_totalPrice" class="false_input | font-heading-S-2 faded-color">0.00</p>
        </div>
        <button class="delete_item-button">
          <svg width="13" height="16" xmlns="http://www.w3.org/2000/svg"><path d="M11.583 3.556v10.666c0 .982-.795 1.778-1.777 1.778H2.694a1.777 1.777 0 01-1.777-1.778V3.556h10.666zM8.473 0l.888.889h3.111v1.778H.028V.889h3.11L4.029 0h4.444z" fill="#888EB0" fill-rule="nonzero"/></svg>
        </button>
      </div>
    </li>
    `;
  }
}

export default new NewInvoiceView();
