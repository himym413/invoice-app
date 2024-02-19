import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

let calendar;
const calendarEl = document.getElementById("calendar");
const showCalendarBtn = document.querySelector("#home #date_to");
const dateEl = document.querySelector("#home #date_to");
let calendarShown = false;

if (calendarEl)
  calendar = new Calendar(calendarEl, {
    plugins: [dayGridPlugin, interactionPlugin],
    height: "auto",
    titleFormat: {
      month: "short",
      year: "numeric",
    },

    headerToolbar: {
      left: "prev",
      center: "title",
      right: "next",
    },

    dateClick: function (info) {
      dateEl.textContent = formatDate(info.dateStr);
      hideCalendar();
    },

    fixedWeekCount: false,
  });

showCalendarBtn?.addEventListener("click", () => {
  if (calendarShown) return hideCalendar();

  showCalendar();
});

// Helper functions for calendar
const formatDate = (string) => {
  // Fix single date format
  let date = new Date(string);
  let year = new Intl.DateTimeFormat("en", { year: "numeric" }).format(date);
  let month = new Intl.DateTimeFormat("en", { month: "short" }).format(date);
  let day = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(date);
  return `${day} ${month} ${year}`;
};

const hideCalendar = () => {
  calendarEl.classList.add("hide");
  calendarShown = false;
};

const showCalendar = () => {
  calendarEl.classList.remove("hide");
  calendarShown = true;
  calendar.render();
};
