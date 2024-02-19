import data from "../data.json";

export const state = {
  data: data,
  invoices: [],
  invoice: {},
  filteredInvoices: [],
};

export const formatDate = (string) => {
  // Fix single date format
  let date = new Date(string);
  let year = new Intl.DateTimeFormat("en", { year: "numeric" }).format(date);
  let month = new Intl.DateTimeFormat("en", { month: "short" }).format(date);
  let day = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(date);
  return `${day} ${month} ${year}`;
};

export const formatDates = () => {
  // Loop through invoices and fix all dates
  state.invoices.forEach((inv) => {
    inv.paymentDue = formatDate(inv.paymentDue);
    inv.createdAt = formatDate(inv.createdAt);
  });
};

export const findInvoice = (id) => {
  state.invoice = state.invoices.find((inv) => inv.id === id);
};

export const filterInvoices = (queries) => {
  // Maximum of 2 queries, if there are 3 it should display all invoices
  let [q1, q2] = queries;
  state.filteredInvoices = state.invoices.filter(
    (invoice) => invoice.status === q1 || invoice.status === q2
  );
};

export const getCurrentDate = () => {
  return formatDate(new Date());
};

export const generateUniqueId = () => {
  let id;
  do {
    id = "";
    let counter = 0;
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const charactersLength = characters.length;
    const numbers = "0123456789";
    const numbersLength = numbers.length;

    while (counter < 6) {
      id +=
        counter < 2
          ? characters.charAt(Math.floor(Math.random() * charactersLength))
          : numbers.charAt(Math.floor(Math.random() * numbersLength));
      counter++;
    }
  } while (state.invoices.findIndex((inv) => inv.id === id) !== -1);

  return id;
};

export const setLocalStorage = (key, value) => {
  localStorage.setItem(`${key}`, JSON.stringify(value));
};

export const getLocalStorage = (key) => {
  return JSON.parse(localStorage.getItem(`${key}`));
};

// localStorage.clear();
