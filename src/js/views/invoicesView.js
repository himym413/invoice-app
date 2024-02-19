import arrowRightIcon from "../../assets/icon-arrow-right.svg";

class InvoicesView {
  #parentEl;
  #data;

  addHandlerLoad(handler) {
    window.addEventListener("DOMContentLoaded", handler);
  }

  addHandlerClick(handler) {
    document
      .querySelector(".invoices .invoices_list")
      ?.addEventListener("click", handler);
  }

  setParentEl(el) {
    this.#parentEl = document.querySelector("#home .invoices .invoices_list");
  }

  renderNoResults() {
    const markup = `
    <div class="invoices_list-empty | flex">
      <div class="invoices_list-empty-ilustration"></div>
      <h2 class="font-heading-L">There is nothing here</h2>
      <p class="font-body faded-color">
        Create an invoice by clicking the
      </p>
      <p class="font-body faded-color">
        <strong>New</strong> button and get started
      </p>
    </div>
    `;

    setTimeout(() => {
      this.#parentEl.innerHTML = "";
      this.#parentEl.insertAdjacentHTML("beforeend", markup);
    }, 300);
  }

  renderNumberOfInvoices(number) {
    const numberOfInvoicesEl = document.querySelector(
      ".secondary_header .numberOfInvoices"
    );

    numberOfInvoicesEl.textContent = number;
  }

  renderSpinner() {
    const markup = `
    <div class="lds-ring">
      <div></div>
      <div></div>
      <div></div>
    </div>
    `;
    this.#parentEl.innerHTML = "";
    this.#parentEl.insertAdjacentHTML("beforeend", markup);
    setTimeout(() => {
      this.#parentEl.querySelector(".lds-ring").remove();
    }, 300);
  }

  render(data) {
    this.#data = data;
    const markup = this.#generateMarkup();
    setTimeout(() => {
      this.#parentEl.innerHTML = "";
      this.#parentEl.insertAdjacentHTML("beforeend", markup);
    }, 300);
  }

  #generateMarkup() {
    return this.#data.map((invoice) => this.#generateItem(invoice)).join("");
  }

  #generateItem(invoice) {
    return `
    <li class="invoices_list-item">
      <a href="https://himym413-invoice-app.vercel.app/invoice.html">
        <h2 class="invoices_list-item-id | font-heading-S-2 dark-color">
          <span class="primary-color">#</span>${invoice.id}
        </h2>

        <p class="invoices_list-item-date | font-body faded-color">Due ${
          invoice.paymentDue
        }</p>

        <p class="invoices_list-item-client | font-body faded-color">${
          invoice.clientName
        }</p>

        <p class="invoices_list-item-amount | font-heading-S dark-color">£${invoice.total
          .toFixed(2)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>

        <div class="invoices_list-item-status | flex ${invoice.status}-color ${
      invoice.status
    }-background font-heading-S-2">
          <span class="dot-${invoice.status}"></span>
          <p>${
            invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)
          }</p>
        </div>

        <img class="hidden-for-mobile"
          src="${arrowRightIcon}"
          alt="Arrow right"/>
      </a>
    </li>
    `;
  }
}

export default new InvoicesView();
