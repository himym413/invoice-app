class DetailsView {
  #parentEl;
  #data;
  #deleteButtons;
  #confirmBtn;
  #markAsPaidButtons;

  addHandlerLoad(handler) {
    window.addEventListener("DOMContentLoaded", handler);
  }

  addHandlerDeleteInvoice(handler) {
    this.#deleteButtons = Array.from(
      document.querySelectorAll("#invoice .delete_button")
    );
    this.#deleteButtons.forEach((btn) =>
      btn.addEventListener("click", handler)
    );
  }

  addHandlerMarkAsPaid(handler) {
    this.#markAsPaidButtons = Array.from(
      document.querySelectorAll("#invoice .markAsPaid_button")
    );
    this.#markAsPaidButtons.forEach((btn) =>
      btn.addEventListener("click", handler)
    );
  }

  setParentEl(el) {
    this.#parentEl = el.querySelector(".invoice_wrapper");
  }

  render(data) {
    this.#data = data;
    const markup = this.#generateMarkup();
    this.#parentEl.insertAdjacentHTML("beforeend", markup);
  }

  showDeleteModal() {
    const markup = this.#generateDeleteModalMarkup();
    document.body.insertAdjacentHTML("afterbegin", markup);

    const modalOverlay = document.querySelector(".overlay_delete-modal");
    const cancelBtn = document.querySelector(".delete-modal_cancelBtn");
    this.#confirmBtn = document.querySelector(".delete-modal_deleteBtn");

    [modalOverlay, cancelBtn].forEach((el) =>
      el.addEventListener("click", this.#hideDeleteModal.bind(this))
    );

    // confirmBtn.addEventListener("click", this.#deleteInvoice.bind(this));
  }

  #hideDeleteModal() {
    const discardModal = document.querySelector(".delete-modal");
    const modalOverlay = document.querySelector(".overlay_delete-modal");
    [discardModal, modalOverlay].forEach((el) => el.remove());
  }

  addHandlerConfirmDelete(handler) {
    this.#confirmBtn.addEventListener("click", handler);
  }

  deleteInvoice() {
    this.#hideDeleteModal();
  }

  #generateDeleteModalMarkup() {
    return `
    <div class="overlay_delete-modal"></div>
    
    <div class="delete-modal">
      <h2 class="font-heading-M dark-color">Confirm Deletion</h2>
      <p class="font-body faded-color">
        Are you sure you want to delete invoice?
      </p>
      <div class="flex">
        <button class="delete-modal_cancelBtn | font-heading-S-2 faded-color">
          Cancel
        </button>
        <button class="delete-modal_deleteBtn | font-heading-S-2 light-color">
          Delete
        </button>
      </div>
    </div>
    `;
  }

  #generateMarkup() {
    return `
    <section class="status_card | flex">
      <div class="status_card-left | flex">
        <p class="status_card-text | font-body faded-color">Status</p>
        <div class="status_card-status ${this.#data.status}-background | flex">
          <span class="dot-${this.#data.status}"></span>
          <p class="${this.#data.status}-color font-heading-S-2">${
      this.#data.status.charAt(0).toUpperCase() + this.#data.status.slice(1)
    }</p>
        </div>
      </div>

      <div class="status_card-right">
        <button class="edit_button | font-heading-S-2 draft-color">
          Edit
        </button>
        <button class="delete_button | font-heading-S-2 light-color">
          Delete
        </button>
        <button class="markAsPaid_button | font-heading-S-2 light-color" style="${
          this.#data.status === "paid" || this.#data.status === "draft"
            ? "opacity:0.5;cursor:default!important;"
            : ""
        }">
          Mark as Paid
        </button>
      </div>
    </section>

    <section class="details">
      <div class="details_top | flex">
        <div class="details_top-left | flex">
          <h1 class="details_top-id | font-heading-S-2 dark-color">
            <span class="primary-color">#</span>${this.#data.id}
          </h1>
          <p class="details_top-description | font-body faded-color">
            ${this.#data.description}
          </p>
        </div>
        <div class="details_top-address">
          <p class="details_top-address-street | font-body faded-color">
            ${this.#data.senderAddress.street}
          </p>
          <p class="details_top-address-city | font-body faded-color">
          ${this.#data.senderAddress.city}
          </p>
          <p class="details_top-address-postCode | font-body faded-color">
          ${this.#data.senderAddress.postCode}
          </p>
          <p class="details_top-address-country | font-body faded-color">
          ${this.#data.senderAddress.country}
          </p>
        </div>
      </div>

      <div class="details_bottom | flex">
        <div class="details_bottom-left | flex">
          <div class="details_date | flex">
            <p class="details_date-about | font-body faded-color">
              Invoice Date
            </p>
            <p class="details_date-date | font-heading-S dark-color">
              ${this.#data.createdAt}
            </p>
          </div>
          <div class="details_due | flex">
            <p class="details_due-about | font-body faded-color">
              Payment Due
            </p>
            <p class="details_due-date | font-heading-S dark-color">
              ${this.#data.paymentDue}
            </p>
          </div>
          <div class="details_sent | flex">
            <p class="details_sent-about | font-body faded-color">
              Sent to
            </p>
            <p class="details_sent-email | font-heading-S dark-color">
              ${this.#data.clientEmail}
            </p>
          </div>
        </div>
        <div class="details_bill | flex">
          <p class="details_bill-about | font-body faded-color">Bill to</p>
          <p class="details_bill-name | font-heading-S dark-color">
            ${this.#data.clientName}
          </p>
          <div class="details_bill-address">
            <p class="details_bill-address-street | font-body faded-color">
            ${this.#data.clientAddress.street}
            </p>
            <p class="details_bill-address-city | font-body faded-color">
            ${this.#data.clientAddress.city}
            </p>
            <p
              class="details_bill-address-postCode | font-body faded-color"
            >
            ${this.#data.clientAddress.postCode}
            </p>
            <p class="details_bill-address-country | font-body faded-color">
            ${this.#data.clientAddress.country}
            </p>
          </div>
        </div>
      </div>

      <div class="details_footer">
        <div class="details_footer-general | flex">
          <p class="font-body faded-color">Item Name</p>
          <div class="details_footer-general-right | flex">
            <p class="font-body faded-color">QTY.</p>
            <p class="font-body faded-color">Price</p>
            <p class="font-body faded-color">Total</p>
          </div>
        </div>

        <ul class="details_footer-item-list">
          ${this.#data.items.map((item) => this.#generateItem(item)).join("")}
        </ul>

        <div class="details_footer-bottom | flex">
          <p
            class="details_footer-bottom-text-mobile | font-body light-color"
          >
            Grand Total
          </p>
          <p
            class="details_footer-bottom-text-desktop | font-body light-color"
          >
            Amount Due
          </p>
          <p
            class="details_footer-bottom-amount | font-heading-M light-color"
          >
            £ ${this.#data.total
              .toFixed(2)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </p>
        </div>
      </div>
    </section>
    `;
  }

  #generateItem(item) {
    return `
    <li class="details_footer-item | flex">
      <h4
        class="details_footer-item-name | font-heading-S-2 dark-color"
      >
        ${item.name}
      </h4>
      <div class="details_footer-item-about | flex">
        <p
          class="details_footer-item-about-qty | font-heading-S-2 faded-color"
        >
          ${item.quantity}
        </p>
        <span class="font-heading-S-2 faded-color">x</span>
        <p
          class="details_footer-item-about-price | font-heading-S-2 faded-color"
        >
          £ ${item.price
            .toFixed(2)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </p>
        <div
          class="details_footer-item-about-total | font-heading-S-2 dark-color"
        >
          £ ${item.total
            .toFixed(2)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </div>
      </div>
    </li>
  `;
  }
}

export default new DetailsView();
