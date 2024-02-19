class PaymentView {
  #paymentEl = document.querySelector("#payment_to");
  #paymentTermsList = document.querySelector(".options");
  #paymentTermsItems = Array.from(document.querySelectorAll(".options span"));

  addHandlerShowOptions(handler) {
    this.#paymentEl.addEventListener("click", handler);
  }

  toggleOptions() {
    if (this.#paymentTermsList.classList.contains("hide")) {
      this.#showOptions();
      this.#paymentTermsItems.forEach((el) =>
        el.addEventListener("click", this.#optionClick.bind(this))
      );
      return;
    }

    this.#hideOptions();
  }

  #showOptions() {
    this.#paymentTermsList.classList.remove("hide");
  }

  #hideOptions() {
    this.#paymentTermsList.classList.add("hide");
  }

  #optionClick(e) {
    const option = e.target.closest("span").textContent;
    this.#paymentEl.textContent = option;
    this.#paymentTermsList.classList.add("hide");
  }
}

export default new PaymentView();
