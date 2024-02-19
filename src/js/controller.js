import "core-js/stable";
import "regenerator-runtime/runtime";
import * as model from "./model";
import darkModeView from "./views/darkModeView";
import invoicesView from "./views/invoicesView";
import detailsView from "./views/detailsView";
import filterView from "./views/filterView";
import newInvoiceView from "./views/newInvoiceView";
import paymentView from "./views/paymentView";
import editInvoiceView from "./views/editInvoiceView";

// DARK MODE
const controlDarkMode = () => {
  // at page load, checks system and user preference for dark mode
  model.getLocalStorage("darkMode") ? setDarkMode() : removeDarkMode();
};

const controlDarkModeSystem = () => {
  // Handles system preference every time user changes his computer settings
  darkModeView.systemPreferenceDark() ? setDarkMode() : removeDarkMode();
};

const controlDarkModeToggle = () => {
  // Handles mode when user clicks the button
  darkModeView.getButtonAttribute() === "true"
    ? removeDarkMode()
    : setDarkMode();
};

const setDarkMode = () => {
  // sets dark mode
  darkModeView.setDarkMode();
  model.setLocalStorage("darkMode", true);
  darkModeView.setButtonAttribute(true);
};

const removeDarkMode = () => {
  // removes dark mode
  darkModeView.removeDarkMode();
  model.setLocalStorage("darkMode", false);
  darkModeView.setButtonAttribute(false);
};

const controlCheckPage = () => {
  controlDarkMode();
  // on each load, check what page is opened with pathname
  let page = window.location.pathname;
  // use data.json elements if its first time loading the page
  model.state.invoices = model.getLocalStorage("invoices") || model.state.data;

  if (page !== "/invoice.html") {
    newInvoiceView.addHandlerToggleNewInvoiceForm(controlNewInvoiceForm);
    // home page
    // set needed parent element for render and render loader
    let el = document.body;
    invoicesView.setParentEl(el);
    invoicesView.renderSpinner();

    invoicesView.renderNumberOfInvoices(model.state.invoices.length);
    // if no invoices, render empty message
    if (model.state.invoices.length === 0)
      return invoicesView.renderNoResults();

    // format dates, MAYBE UNNECESARY TO DO EVERY TIME!!!
    model.formatDates();
    // render invoices
    invoicesView.render(model.state.invoices);
    // when on home page, use filterView
    filterView.addHandlerFilterClick(controlFilterClick);
  }

  if (page === "/invoice.html") {
    editInvoiceView.addHandlerToggleEditInvoiceForm(controlEditInvoiceForm);
    // details page
    // set needed parent element for render
    let el = document.body;
    detailsView.setParentEl(el);
    // Get id from local storage
    const id = model.getLocalStorage("invoiceId");
    // Find invoice
    model.findInvoice(id);
    // Format dates, FIX !!!!!
    model.state.invoice.createdAt = model.formatDate(
      model.state.invoice.createdAt
    );
    model.state.invoice.paymentDue = model.formatDate(
      model.state.invoice.paymentDue
    );
    // render invoice details
    detailsView.render(model.state.invoice);
    // Add handler for deleting invoice
    detailsView.addHandlerDeleteInvoice(controlDeleteInvoice);
    // Add handler for marking invoice as paid
    detailsView.addHandlerMarkAsPaid(controlMarkAsPaid);
  }
};

const controlInvoiceClick = (e) => {
  e.preventDefault();

  if (!e.target.closest("li")) return;

  const id = e.target
    .closest(".invoices_list-item")
    .querySelector(".invoices_list-item-id")
    .innerText.slice(1);

  // Remember id in local storage
  model.setLocalStorage("invoiceId", id);

  window.location.assign("invoice.html");
};

const controlFilterClick = () => {
  // Show/hide options box
  filterView.toggleFilterOptions();
  // Add handler to each of displayed options
  filterView.addHandlerOptionClick(controlOptionClick);
};

const controlOptionClick = (e) => {
  // Get element
  const clickedOptionEl = e.target.closest(
    ".secondary_header-right-filter-options-option"
  );
  // Set elements styling and data attribute
  filterView.filterOptionClick(clickedOptionEl);

  // Get tagged queries
  const queries = filterView.getQueries();

  // Render all invoices if all or none queries selected
  if (queries.length === 0 || queries.length === 3) {
    invoicesView.renderSpinner();
    invoicesView.render(model.state.invoices);
    return;
  }

  // Filter invoices if 1 or 2 queries selected
  model.filterInvoices(queries);
  invoicesView.renderSpinner();
  model.state.filteredInvoices.length !== 0
    ? invoicesView.render(model.state.filteredInvoices)
    : invoicesView.renderNoResults();
};

const controlDeleteInvoice = () => {
  // Show modal for deleting invoice and add handler for confirming deletion
  detailsView.showDeleteModal();
  detailsView.addHandlerConfirmDelete(controlConfirmDelete);
};

const controlConfirmDelete = () => {
  detailsView.deleteInvoice();
  // Delete invoice from localStorage file, render home page
  let index = model.state.invoices.indexOf(model.state.invoice);
  model.state.invoices.splice(index, 1);
  model.setLocalStorage("invoices", model.state.invoices);
  window.location.assign("index.html");
};

const controlMarkAsPaid = () => {
  if (model.state.invoice.status !== "pending") return;

  // when clicked, reload the page and mark invoice as paid, also set it as first invoice in list
  let index = model.state.invoices.indexOf(model.state.invoice);
  model.state.invoices[index].status = "paid";
  model.state.invoices.sort(function (x, y) {
    return x === model.state.invoices[index]
      ? -1
      : y === model.state.invoices[index]
      ? 1
      : 0;
  });
  model.setLocalStorage("invoices", model.state.invoices);
  window.location.assign("index.html");
};

const controlNewInvoiceForm = () => {
  // Show new invoice or hide it if clicked on overlay or go-back button on mobile
  newInvoiceView.showNewInvoiceForm();
  // Set current date for calendar
  const currentDate = model.getCurrentDate();
  newInvoiceView.setInvoiceDate(currentDate);
  // Control payment terms options
  paymentView.addHandlerShowOptions(controlPaymentTerms);
  // Add or delete item
  newInvoiceView.addHandlerAddDeleteItem(controlAddDeleteItem);
  // Discard invoice
  newInvoiceView.addHandlerDiscardInvoice(controlDiscard);
  // Save invoice
  newInvoiceView.addHandlerSaveInvoice(controlSaveInvoice);
  // Save as draft
  newInvoiceView.addHandlerSaveDraft(controlSaveDraft);
};

const controlPaymentTerms = () => {
  paymentView.toggleOptions();
};

const controlAddDeleteItem = (e) => {
  e.preventDefault();
  // Add item and attach event listener for deleting item
  if (e.target.closest("body").id === "home") newInvoiceView.addNewItem();

  if (e.target.closest("body").id === "invoice") editInvoiceView.addNewItem();
};

const controlDiscard = (e) => {
  e.preventDefault();
  newInvoiceView.showDiscardModal();
};

const controlSaveInvoice = (e) => {
  if (
    (e.key && e.key === "Enter") ||
    e.target.classList.contains("save-button")
  ) {
    e.preventDefault();
    // it has to be like this in order to complete every check, so it can show if there are more than one errors
    const firstCheck = newInvoiceView.checkForEmptyFields();
    const secondCheck = !newInvoiceView.validEmail();
    const thirdCheck = !newInvoiceView.anyItems();
    if (firstCheck || secondCheck || thirdCheck) return;

    saveInvoiceData(false, false);
  }
};

// CONTINUE WORKING ON SAVING AS DRAFT!!!
const controlSaveDraft = (e) => {
  e.preventDefault();

  saveInvoiceData(true, false);
};

const saveInvoiceData = (draft = false, edit = false) => {
  // for new invoice
  if (!edit) {
    // store invoice in model
    model.state.invoice = newInvoiceView.getInvoiceData(draft);
    // reset form
    newInvoiceView.resetInvoice();
    // generate unique id and format date
    model.state.invoice.id = model.generateUniqueId();
    model.state.invoice.paymentDue = model.formatDate(
      model.state.invoice.paymentDue
    );
    // add invoice to first place in array
    model.state.invoices.unshift(model.state.invoice);
  }

  // for edited invoice
  if (edit) {
    // store invoice in model
    model.state.invoice = editInvoiceView.getInvoiceData();

    // format date
    model.state.invoice.paymentDue = model.formatDate(
      model.state.invoice.paymentDue
    );

    // add invoice to first place in array
    const index = model.state.invoices.findIndex(
      (inv) => inv.id === model.state.invoice.id
    );
    model.state.invoices[index] = model.state.invoices[0];
    model.state.invoices[0] = model.state.invoice;

    window.location.assign("index.html");
  }

  model.setLocalStorage("invoices", model.state.invoices);
  // reload page
  controlCheckPage();
};

const controlEditInvoiceForm = () => {
  // Show edit invoice or hide it if clicked on overlay or go-back button on mobile
  editInvoiceView.showEditInvoiceForm(model.state.invoice.id);
  // Set invoice date for calendar
  const invoiceDate = model.state.invoice.createdAt;
  editInvoiceView.setInvoiceDate(invoiceDate);
  // Set invoice payment terms
  const paymentTerms = model.state.invoice.paymentTerms;
  editInvoiceView.setInvoicePayment(paymentTerms);
  // Control payment terms options
  paymentView.addHandlerShowOptions(controlPaymentTerms);
  // Fill out rest of the fields
  editInvoiceView.fillFormElements(model.state.invoice);
  // Add or delete item
  editInvoiceView.addHandlerAddDeleteItem(controlAddDeleteItem);
  // add handler to save changes
  editInvoiceView.addHandlerSaveChanges(controlSaveChanges);
};

const controlSaveChanges = (e) => {
  e.preventDefault();

  // it has to be like this in order to complete every check, so it can show if there are more than one errors
  const firstCheck = editInvoiceView.checkForEmptyFields();
  const secondCheck = !editInvoiceView.validEmail();
  const thirdCheck = !editInvoiceView.anyItems();
  if (firstCheck || secondCheck || thirdCheck) return;

  saveInvoiceData(false, true);
};

const init = () => {
  // localStorage.clear();
  controlDarkMode();
  darkModeView.addHandlerButton(controlDarkModeToggle);
  darkModeView.systemPreferenceChangeHandler(controlDarkModeSystem);
  invoicesView.addHandlerLoad(controlCheckPage);
  invoicesView.addHandlerClick(controlInvoiceClick);
  detailsView.addHandlerLoad(controlCheckPage);
};
init();
