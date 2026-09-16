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
  arrival.min = today;
  departure.min = nextDay(today);
  arrival.addEventListener("change", () => {
    if (day(arrival.value)) departure.min = nextDay(arrival.value);
    if (departure.value && departure.value <= arrival.value) departure.value = "";
    error.textContent = "";
  });
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
    const description = `${fmt.format(start)} — ${fmt.format(end)} · ${nights} ${T(nights === 1 ? "night" : "nights", nights === 1 ? "noche" : "noches")} · ${guestLabel}`;
    summary.querySelector(".stay-selection").textContent = description;
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
