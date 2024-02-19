import arrowDownIcon from "url:../../assets/icon-arrow-down.svg";
import arrowUpIcon from "url:../../assets/icon-arrow-up.svg";
import checkmarkIcon from "url:../../assets/icon-check.svg";

class FilterView {
  #filterBtn = document.querySelector(".secondary_header-right-filter-button");
  #filterOptions = document.querySelector(
    ".secondary_header-right-filter-options"
  );
  #filterIcon = this.#filterBtn?.querySelector("img");
  #optionArr = this.#filterOptions?.querySelectorAll(
    ".secondary_header-right-filter-options-option"
  );

  addHandlerFilterClick(handler) {
    this.#filterBtn.addEventListener("click", handler);
  }

  addHandlerOptionClick(handler) {
    this.#optionArr = Array.from(this.#optionArr);
    this.#optionArr.forEach((el) => el.addEventListener("click", handler));
  }

  toggleFilterOptions() {
    // show/hide options
    if (this.#filterOptions.classList.contains("hide")) {
      this.#filterOptions.classList.remove("hide");
      this.#filterIcon.src = arrowUpIcon;
      return;
    }

    this.#filterOptions.classList.add("hide");
    this.#filterIcon.src = arrowDownIcon;
  }

  filterOptionClick(el) {
    const checkmark = el.querySelector(".checkmark");

    // Styling checkmark based on click
    if (el.dataset.checked === "false") {
      el.dataset.checked = "true";
      checkmark.style.backgroundImage = `url(${checkmarkIcon})`;
      checkmark.style.backgroundColor = "#7c5dfa";
    } else {
      el.dataset.checked = "false";
      checkmark.style.backgroundImage = "none";
      checkmark.style.backgroundColor = "#dfe3fa";
    }
  }

  getQueries() {
    let arr = this.#optionArr.map((el) =>
      el.getAttribute("data-checked") === "true"
        ? el.querySelector("p").textContent.toLowerCase()
        : ""
    );

    arr = arr.filter((e) => e);
    return arr;
  }
}

export default new FilterView();
