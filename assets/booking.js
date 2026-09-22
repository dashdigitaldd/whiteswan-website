(() => {
  const form = document.querySelector("#stay-request");
  if (!form) return;
  const es = document.documentElement.lang === "es";
  const T = (en, spanish) => (es ? spanish : en);
  const arrival = form.elements.arrival;
  const departure = form.elements.departure;
  const summary = document.querySelector("#stay-summary");
  const error = document.querySelector("#stay-error");
  // Property-local date, independent of the visitor's time zone.
  const todayParts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/El_Salvador",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const part = (type) => todayParts.find((p) => p.type === type).value;
  const today = `${part("year")}-${part("month")}-${part("day")}`;
  const day = (value) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
    const date = new Date(`${value}T00:00:00Z`);
    return Number.isFinite(+date) && date.toISOString().slice(0, 10) === value ? date : null;
  };
  const nextDay = (value) => {
    const date = day(value);
    date.setUTCDate(date.getUTCDate() + 1);
    return date.toISOString().slice(0, 10);
  };
  const duration = document.querySelector(".stay-duration");
  const updateDuration = () => {
    if (!duration) return;
    const start = day(arrival.value), end = day(departure.value);
    const valid = start && end && arrival.value >= today && end > start;
    duration.hidden = !valid;
    if (!valid) { duration.textContent = ""; return; }
    const nights = Math.round((end - start) / 86400000);
    duration.textContent = `${nights} ${T(nights === 1 ? "night at White Swan" : "nights at White Swan", nights === 1 ? "noche en White Swan" : "noches en White Swan")} · ${T("Entire private villa", "Villa privada completa")}`;
  };
  arrival.min = today;
  departure.min = nextDay(today);
  arrival.addEventListener("change", () => {
    departure.min = day(arrival.value) ? nextDay(arrival.value) : nextDay(today);
    if (departure.value && departure.value <= arrival.value) departure.value = "";
    error.textContent = "";
    updateDuration();
  });
  departure.addEventListener("change", updateDuration);
  // Carry only valid dates and group size into the matching language page.
  const languageLink = document.querySelector(".header-actions .language");
  const parameters = new URLSearchParams(location.search);
  const savedArrival = parameters.get("arrival"), savedDeparture = parameters.get("departure");
  if (day(savedArrival || "") && savedArrival >= today) {
    arrival.value = savedArrival;
    departure.min = nextDay(savedArrival);
    if (day(savedDeparture || "") && savedDeparture > savedArrival) departure.value = savedDeparture;
  }
  if (/^(?:[1-8]|larger)$/.test(parameters.get("guests") || "")) form.elements.guests.value = parameters.get("guests");
  const preserveSelection = () => {
    if (!languageLink) return;
    const target = new URL(languageLink.href);
    target.search = "";
    if (day(arrival.value) && arrival.value >= today) {
      target.searchParams.set("arrival", arrival.value);
      if (day(departure.value) && departure.value > arrival.value) target.searchParams.set("departure", departure.value);
    }
    target.searchParams.set("guests", form.elements.guests.value);
    languageLink.href = target.pathname + target.search;
  };
  form.addEventListener("change", preserveSelection);
  languageLink?.addEventListener("click", preserveSelection);
  preserveSelection();
  updateDuration();
  form.hidden = false;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const start = day(arrival.value),
      end = day(departure.value);
    if (!start || !end || arrival.value < today || end <= start) {
      error.textContent = T(
        "Choose an arrival date from today onward and a departure after arrival.",
        "Elige una llegada desde hoy y una salida posterior a la llegada.",
      );
      return;
    }
    const nights = Math.round((end - start) / 86400000);
    const guests = form.elements.guests.value;
    const fmt = new Intl.DateTimeFormat(es ? "es-SV" : "en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    });
    const guestLabel =
      guests === "larger"
        ? T("Larger group — please confirm capacity", "Grupo más grande — confirmar capacidad")
        : `${guests} ${T(Number(guests) === 1 ? "guest" : "guests", Number(guests) === 1 ? "huésped" : "huéspedes")}`;
    const description = `${nights} ${T(nights === 1 ? "night" : "nights", nights === 1 ? "noche" : "noches")} · ${T("Entire private villa", "Villa privada completa")}`;
    summary.querySelector(".stay-selection").textContent = description;
    const details = summary.querySelector(".stay-summary-details");
    details.replaceChildren();
    for (const [label, value] of [[T("Arrival", "Llegada"), fmt.format(start)], [T("Departure", "Salida"), fmt.format(end)], [T("Your group", "Tu grupo"), guestLabel]]) {
      const row = document.createElement("div"), term = document.createElement("dt"), definition = document.createElement("dd");
      term.textContent = label;
      definition.textContent = value;
      row.append(term, definition);
      details.append(row);
    }
    const message = T(
      `Hello White Swan! I’d like to request a stay.\nArrival: ${arrival.value}\nDeparture: ${departure.value}\n${guestLabel}\nPlease confirm availability, total price and booking/payment terms. Sent from staywhiteswan.com.`,
      `¡Hola White Swan! Me gustaría solicitar una estadía.\nLlegada: ${arrival.value}\nSalida: ${departure.value}\n${guestLabel}\nPor favor confirmen disponibilidad, precio total y condiciones de reserva/pago. Desde staywhiteswan.com.`,
    );
    summary.querySelector(".stay-whatsapp").href =
      `https://wa.me/50370528003?text=${encodeURIComponent(message)}`;
    error.textContent = "";
    form.hidden = true;
    summary.hidden = false;
    summary.focus();
  });
  document.querySelector("#edit-stay").addEventListener("click", () => {
    summary.hidden = true;
    form.hidden = false;
    arrival.focus();
  });
})();
