class DarkModeView {
  #parentEl = document.querySelector("body");
  #toggleDarkModeButton = document.querySelector(
    ".primary_header-right-toggleDarkMode"
  );

  systemPreferenceDark() {
    // check system preference
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  systemPreferenceChangeHandler(handler) {
    // add hanlder to system preference change
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", handler);
  }

  addHandlerButton(handler) {
    // add handler to toggle darkmode button click
    this.#toggleDarkModeButton.addEventListener("click", handler);
  }

  getButtonAttribute() {
    // return button attribute
    return this.#toggleDarkModeButton.dataset.darkmode;
  }

  setButtonAttribute(boolean) {
    // set button attribute
    if (this.getButtonAttribute() === +boolean) return;
    this.#toggleDarkModeButton.dataset.darkmode = boolean;
  }

  setDarkMode() {
    // set dark mode to body
    if (!this.#parentEl.classList.contains("darkMode"))
      this.#parentEl.classList.add("darkMode");
  }

  removeDarkMode() {
    // remove dark mode from body
    if (this.#parentEl.classList.contains("darkMode"))
      this.#parentEl.classList.remove("darkMode");
  }
}

export default new DarkModeView();
