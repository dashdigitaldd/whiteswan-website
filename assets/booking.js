(() => {
  "use strict";
  const form = document.querySelector("#stay-request");
  if (!form) return;
  const es = document.documentElement.lang === "es",
    T = (en, sp) => (es ? sp : en);
  const origin = window.WHITE_SWAN_CONFIG?.intakeOrigin;
  const arrival = form.elements.arrival,
    departure = form.elements.departure,
    summary = document.querySelector("#stay-summary"),
    error = document.querySelector("#stay-error"),
    contact = document.querySelector("#stay-contact");
  const date = (v) =>
    /^\d{4}-\d{2}-\d{2}$/.test(v || "") &&
    Number.isFinite(Date.parse(v)) &&
    new Date(v).toISOString().slice(0, 10) === v;
  const shift = (v, n) => new Date(Date.parse(v) + n * 86400000).toISOString().slice(0, 10);
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/El_Salvador",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  const horizon = shift(today, 365),
    fmt = new Intl.DateTimeFormat(es ? "es-SV" : "en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    });
  const params = new URLSearchParams(location.search),
    languageLink = document.querySelector(".header-actions .language");
  let month = today.slice(0, 7),
    days = [],
    picking = "arrival",
    sequence = 0,
    calendarLoading = false,
    selection = null,
    session = null,
    sent = false,
    pending = false,
    submission = null;
  const months = new Map(),
    calendar = document.querySelector(".availability-browser"),
    grid = document.querySelector("#availability-days"),
    calendarStatus = document.querySelector("#availability-status");
  async function api(path, data) {
    if (!origin || !/^https:\/\//.test(origin)) throw new Error("offline");
    const response = await fetch(origin + path, {
      method: data ? "POST" : "GET",
      credentials: "omit",
      headers: data ? { "Content-Type": "application/json" } : {},
      body: data ? JSON.stringify(data) : undefined,
      signal: AbortSignal.timeout(18000),
    });
    const result = await response.json();
    if (!response.ok) {
      const e = new Error(result.error || "offline");
      e.status = response.status;
      throw e;
    }
    return result;
  }
  const progress = (n) =>
    document.querySelectorAll(".booking-progress li").forEach((li, i) => {
      if (i === n) li.setAttribute("aria-current", "step");
      else li.removeAttribute("aria-current");
    });
  function update() {
    departure.min = date(arrival.value) ? shift(arrival.value, 1) : shift(today, 1);
    const nights =
      date(arrival.value) && date(departure.value)
        ? (Date.parse(departure.value) - Date.parse(arrival.value)) / 86400000
        : 0;
    const duration = document.querySelector(".stay-duration");
    duration.hidden = nights <= 0;
    duration.textContent =
      nights > 0
        ? `${nights} ${T(nights === 1 ? "night at White Swan" : "nights at White Swan", nights === 1 ? "noche en White Swan" : "noches en White Swan")}`
        : "";
    if (languageLink) {
      const url = new URL(languageLink.href);
      url.search = "";
      for (const key of ["arrival", "departure"])
        if (date(form.elements[key].value)) url.searchParams.set(key, form.elements[key].value);
      url.searchParams.set("guests", form.elements.guests.value);
      languageLink.href = url.pathname + url.search;
    }
    for (const control of document.querySelectorAll(".date-choice")) {
      const field = control.dataset.pick;
      control.dataset.active = String(field === picking);
      control.setAttribute("aria-pressed", String(field === picking));
      control.querySelector("strong").textContent = date(form.elements[field].value)
        ? fmt.format(new Date(form.elements[field].value))
        : T("Choose date", "Elige fecha");
    }
    document.querySelector("#clear-dates").hidden = !arrival.value && !departure.value;
    document.querySelector(".calendar-instruction").textContent = picking === "departure"
      ? T("Choose departure. Your last night must be available.", "Elige salida. Tu última noche debe estar disponible.")
      : arrival.value && departure.value
        ? T("Your dates are selected.", "Tus fechas, listas para consultar.")
        : T("Choose your arrival date.", "Elige tu fecha de llegada.");
    renderDays();
  }
  function knownDays() {
    return new Map([...months.values()]
      .filter((result) => Date.parse(result.expiresAt) > Date.now())
      .flatMap((result) => result.days.map((day) => [day.date, day])));
  }
  function renderDays() {
    const known = knownDays();
    const focusedDate = grid.contains(document.activeElement) ? document.activeElement.dataset.date : null;
    grid.replaceChildren();
    for (let i = 0; i < 7; i++) {
      const label = document.createElement("span");
      label.className = "calendar-weekday";
      label.textContent = new Intl.DateTimeFormat(es ? "es-SV" : "en-US", {
        weekday: "short",
        timeZone: "UTC",
      }).format(new Date(Date.UTC(2026, 9, 11 + i)));
      grid.append(label);
    }
    const first = new Date(month + "-01T00:00:00Z");
    for (let i = 0; i < first.getUTCDay(); i++) grid.append(document.createElement("span"));
    const total = new Date(
      Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0),
    ).getUTCDate();
    for (let n = 1; n <= total; n++) {
      const value = `${month}-${String(n).padStart(2, "0")}`,
        d = days.find((x) => x.date === value),
        state = d?.status || "unknown",
        button = document.createElement("button");
      const pickingEnd = picking === "departure" && date(arrival.value) && value > arrival.value;
      const endState = (pickingEnd || (date(arrival.value) && value === departure.value))
        ? WhiteSwanCalendar.departureState(arrival.value, value, known)
        : null;
      const checkoutOnly = (pickingEnd || value === departure.value) && endState === "available" && state === "unavailable";
      button.type = "button";
      button.dataset.checkoutOnly = String(checkoutOnly);
      button.className = "calendar-day";
      button.dataset.state = state;
      button.dataset.date = value;
      if (value === today) button.setAttribute("aria-current", "date");
      button.textContent = String(n);
      button.disabled =
        calendarLoading || !d || value < today || value > horizon ||
        (picking === "departure" && date(arrival.value) && value < arrival.value) ||
        (pickingEnd ? endState !== "available" : state !== "available" || d?.closedCheckin !== false);
      const meaning = checkoutOnly
        ? T("checkout only, no overnight stay", "solo salida, no se puede pasar la noche")
        : pickingEnd && endState === "unavailable_nights"
          ? T("stay crosses unavailable nights", "la estadía incluye noches no disponibles")
          : pickingEnd && endState === "minimum_stay"
            ? T("minimum stay not met", "no cumple la estadía mínima")
            : pickingEnd && endState === "closed_departure"
              ? T("departure not permitted", "salida no permitida")
              : state === "available"
                ? T("available", "disponible")
                : state === "unavailable"
                  ? T("unavailable", "no disponible")
                  : T("not yet verified", "sin verificar");
      button.setAttribute("aria-label", `${fmt.format(new Date(value))}, ${meaning}`);
      button.setAttribute(
        "aria-pressed",
        String(value === arrival.value || value === departure.value),
      );
      if (value === arrival.value) button.classList.add("range-start");
      if (value === departure.value) button.classList.add("range-end");
      if (arrival.value && departure.value && value > arrival.value && value < departure.value)
        button.classList.add("in-range");
      button.addEventListener("click", () => {
        if (button.disabled) return;
        if (pickingEnd) {
          departure.value = value;
          picking = "arrival";
        }
        else {
          arrival.value = value;
          departure.value = "";
          picking = "departure";
        }
        error.textContent = "";
        update();
      });
      button.addEventListener("keydown", (event) => {
        const delta = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[event.key];
        if (!delta) return;
        event.preventDefault();
        let next = shift(value, delta);
        while (next.slice(0, 7) === month) {
          const target = grid.querySelector(`[data-date="${next}"]`);
          if (target && !target.disabled) { target.focus(); return; }
          next = shift(next, delta > 0 ? 1 : -1);
        }
      });
      grid.append(button);
    }
    document.querySelector(".legend-checkout").hidden = !grid.querySelector('[data-checkout-only="true"]:not(:disabled)');
    if (focusedDate) {
      const target = grid.querySelector(`[data-date="${focusedDate}"]:not(:disabled)`)
        || document.querySelector(`[data-pick="${picking}"]`);
      target?.focus({ preventScroll: true });
    }
  }
  async function loadMonth(force = false) {
    const current = ++sequence;
    document.querySelector("#calendar-month").textContent = new Intl.DateTimeFormat(
      es ? "es-SV" : "en-US",
      { month: "long", year: "numeric", timeZone: "UTC" },
    ).format(new Date(month + "-01"));
    document.querySelector("#previous-month").disabled = month <= today.slice(0, 7);
    document.querySelector("#next-month").disabled = month >= horizon.slice(0, 7);
    calendarLoading = true;
    days = [];
    renderDays();
    calendarStatus.textContent = T("Checking the calendar…", "Consultando el calendario…");
    document.querySelector("#retry-calendar").hidden = true;
    grid.setAttribute("aria-busy", "true");
    try {
      const requestedMonth = month;
      const results = await Promise.all(WhiteSwanCalendar.requiredMonths(month, arrival.value).map(async (key) => {
        let result = months.get(key);
        if (force || !result || Date.parse(result.expiresAt) <= Date.now())
          result = await api("/v1/availability?month=" + key);
        if (!Array.isArray(result.days) || !Number.isFinite(Date.parse(result.expiresAt)) || Date.parse(result.expiresAt) <= Date.now())
          throw new Error("stale");
        return [key, result];
      }));
      if (current !== sequence) return;
      for (const [key, result] of results) months.set(key, result);
      const result = months.get(requestedMonth);
      calendarLoading = false;
      days = result.days;
      renderDays();
      calendarStatus.textContent =
        T("Calendar checked at ", "Calendario consultado a las ") +
        new Intl.DateTimeFormat(es ? "es-SV" : "en-US", {
          timeZone: "America/El_Salvador",
          hour: "numeric",
          minute: "2-digit",
        }).format(new Date(result.checkedAt)) +
        T(
          " · El Salvador time. Dates are checked again when you continue.",
          " · Hora de El Salvador. Verificamos las fechas otra vez al continuar.",
        );
    } catch {
      if (current !== sequence) return;
      calendarStatus.textContent = T(
        "We couldn’t load availability. Try again or ask us on WhatsApp.",
        "No pudimos consultar disponibilidad. Intenta de nuevo o escríbenos por WhatsApp.",
      );
      document.querySelector("#retry-calendar").hidden = false;
    } finally {
      if (current === sequence) {
        calendarLoading = false;
        renderDays();
        grid.setAttribute("aria-busy", "false");
      }
    }
  }
  for (const [id, delta] of [
    ["previous-month", -1],
    ["next-month", 1],
  ])
    document.querySelector("#" + id).addEventListener("click", () => {
      const d = new Date(month + "-01");
      d.setUTCMonth(d.getUTCMonth() + delta);
      month = d.toISOString().slice(0, 7);
      void loadMonth();
    });
  document.querySelector("#retry-calendar").addEventListener("click", () => void loadMonth(true));
  for (const control of document.querySelectorAll(".date-choice")) {
    control.addEventListener("click", () => {
      picking = control.dataset.pick;
      if (picking === "departure" && !date(arrival.value)) picking = "arrival";
      const value = form.elements[picking].value || arrival.value || today;
      const nextMonth = value.slice(0, 7);
      const changed = month !== nextMonth;
      month = nextMonth;
      update();
      if (changed) void loadMonth();
    });
  }
  document.querySelector("#clear-dates").addEventListener("click", () => {
    arrival.value = "";
    departure.value = "";
    picking = "arrival";
    error.textContent = "";
    update();
    document.querySelector('[data-pick="arrival"]').focus();
  });
  // Reveal native date fields if browser validation needs one of them.
  for (const field of [arrival, departure]) field.addEventListener("invalid", () => {
    document.querySelector(".manual-dates").open = true;
  });
  arrival.min = today;
  arrival.max = horizon;
  departure.max = horizon;
  if (
    date(params.get("arrival")) &&
    params.get("arrival") >= today &&
    params.get("arrival") <= horizon
  ) {
    arrival.value = params.get("arrival");
    month = arrival.value.slice(0, 7);
  }
  if (
    date(params.get("departure")) &&
    params.get("departure") > arrival.value &&
    params.get("departure") <= horizon
  )
    departure.value = params.get("departure");
  if (/^(?:[1-9]|10)$/.test(params.get("guests") || ""))
    form.elements.guests.value = params.get("guests");
  arrival.addEventListener("change", () => {
    if (departure.value <= arrival.value) departure.value = "";
    if (date(arrival.value) && arrival.value >= today && arrival.value <= horizon) {
      month = arrival.value.slice(0, 7);
      void loadMonth();
    }
    picking = departure.value ? "arrival" : "departure";
    error.textContent = "";
    update();
  });
  departure.addEventListener("change", () => { picking = "arrival"; });
  form.addEventListener("change", update);
  picking = arrival.value && !departure.value ? "departure" : "arrival";
  update();
  form.hidden = false;
  calendar.hidden = false;
  void loadMonth();
  const issues = {
    unavailable_nights: T(
      "One or more nights are unavailable. Please choose different dates.",
      "Una o más noches no están disponibles. Elige otras fechas.",
    ),
    closed_arrival: T("Choose a different arrival date.", "Elige otra fecha de llegada."),
    closed_departure: T("Choose a different departure date.", "Elige otra fecha de salida."),
    minimum_stay: T(
      "These dates require a longer stay. Minimum nights: ",
      "Estas fechas requieren una estadía más larga. Mínimo de noches: ",
    ),
  };
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (pending) return;
    const nights = (Date.parse(departure.value) - Date.parse(arrival.value)) / 86400000;
    if (
      !date(arrival.value) ||
      !date(departure.value) ||
      arrival.value < today ||
      departure.value > horizon ||
      nights < 1 ||
      nights > 30
    ) {
      error.textContent = T(
        "Choose 1 to 30 nights within the next year.",
        "Elige de 1 a 30 noches dentro del próximo año.",
      );
      return;
    }
    const rangeState = WhiteSwanCalendar.departureState(arrival.value, departure.value, knownDays());
    if (issues[rangeState]) {
      error.textContent = issues[rangeState] + (rangeState === "minimum_stay" ? knownDays().get(arrival.value).minStay : "");
      picking = "departure";
      update();
      return;
    }
    pending = true;
    const submit = form.querySelector('[type="submit"]');
    submit.disabled = true;
    submit.textContent = T("Checking your dates…", "Consultando tus fechas…");
    error.textContent = "";
    selection = {
      arrival: arrival.value,
      departure: departure.value,
      guests: Number(form.elements.guests.value),
    };
    let result;
    try {
      result = await api("/v1/stay-check", selection);
    } catch {
      result = { status: "unknown" };
    }
    pending = false;
    submit.disabled = false;
    submit.textContent = T("Check these dates →", "Consultar estas fechas →");
    if (result.status === "unavailable") {
      error.textContent = (result.issues || [])
        .map((x) => (issues[x] || "") + (x === "minimum_stay" ? result.minStay : ""))
        .filter(Boolean)
        .join(" ");
      return;
    }
    summary.querySelector(".stay-selection").textContent =
      `${nights} ${T(nights === 1 ? "night" : "nights", nights === 1 ? "noche" : "noches")} · ${T("Entire private villa", "Villa privada completa")}`;
    const details = summary.querySelector(".stay-summary-details");
    details.replaceChildren();
    for (const [label, value] of [
      [T("Arrival", "Llegada"), fmt.format(new Date(selection.arrival))],
      [T("Departure", "Salida"), fmt.format(new Date(selection.departure))],
      [
        T("Your group", "Tu grupo"),
        selection.guests +
          " " +
          T(
            selection.guests === 1 ? "guest" : "guests",
            selection.guests === 1 ? "huésped" : "huéspedes",
          ),
      ],
    ]) {
      const row = document.createElement("div"),
        dt = document.createElement("dt"),
        dd = document.createElement("dd");
      dt.textContent = label;
      dd.textContent = value;
      row.append(dt, dd);
      details.append(row);
    }
    const check = document.querySelector("#stay-check-status");
    check.dataset.state = result.status;
    check.textContent =
      result.status === "available"
        ? T(
            "Your dates are currently open. Your host will confirm the permitted group size, total price and terms.",
            "Tus fechas están disponibles por ahora. Tu anfitrión confirmará el grupo permitido, precio total y condiciones.",
          )
        : T(
            "We couldn’t fully verify these dates. Ask your host to check availability and price.",
            "No pudimos verificar todas las fechas. Consulta disponibilidad y precio con tu anfitrión.",
          );
    const message = T(
      `Hello White Swan! I’d like to request a stay.\nArrival: ${selection.arrival}\nDeparture: ${selection.departure}\nGuests: ${selection.guests}\nPlease confirm availability, total price and booking terms.`,
      `¡Hola White Swan! Me gustaría solicitar una estadía.\nLlegada: ${selection.arrival}\nSalida: ${selection.departure}\nHuéspedes: ${selection.guests}\nPor favor confirmen disponibilidad, precio total y condiciones.`,
    );
    summary.querySelector(".stay-whatsapp").href =
      "https://wa.me/50370528003?text=" + encodeURIComponent(message);
    contact.hidden = !origin || result.status !== "available";
    if (!contact.hidden && !session)
      session = api("/v1/session")
        .then(async (r) => {
          await new Promise((resolve) => setTimeout(resolve, 1600));
          return r.challenge;
        })
        .catch(() => {
          session = null;
          return null;
        });
    form.hidden = true;
    summary.hidden = false;
    progress(1);
    summary.focus();
  });
  document.querySelector("#edit-stay").addEventListener("click", () => {
    if (sent || pending || submission) return;
    summary.hidden = true;
    form.hidden = false;
    progress(0);
    document.querySelector('[data-pick="arrival"]').focus();
  });
  contact.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (pending || sent) return;
    pending = true;
    const button = contact.querySelector('[type="submit"]'),
      status = contact.querySelector(".form-status");
    button.disabled = true;
    button.textContent = T("Sending your request…", "Enviando tu solicitud…");
    status.textContent = "";
    try {
      if (!session)
        session = api("/v1/session")
          .then(async (r) => {
            await new Promise((resolve) => setTimeout(resolve, 1600));
            return r.challenge;
          })
          .catch(() => {
            session = null;
            return null;
          });
      const challenge = await session;
      if (!challenge) throw new Error("session");
      // Keep the original payload after an uncertain response so retry cannot duplicate or alter it.
      if (!submission)
        submission = {
          ...selection,
          challenge,
          name: contact.elements.name.value,
          email: contact.elements.email.value,
          phone: contact.elements.phone.value,
          message: contact.elements.message.value,
          website: contact.elements.website.value,
          contactConsent: contact.elements.contactConsent.checked,
          service: "stay",
          language: es ? "es" : "en",
          attribution: { path: location.pathname },
        };
      const receipt = await api("/v1/stay-requests", submission);
      const continuation = summary.querySelector(".stay-whatsapp");
      const link = new URL(continuation.href);
      link.searchParams.set(
        "text",
        link.searchParams.get("text") +
          "\n" +
          T("Request reference: ", "Referencia de solicitud: ") +
          receipt.reference,
      );
      continuation.href = link.href;
      sent = true;
      contact.hidden = true;
      document.querySelector("#edit-stay").hidden = true;
      document.querySelector("#stay-received").hidden = false;
      document.querySelector("#stay-received .receipt").textContent =
        T("Your reference: ", "Tu referencia: ") + receipt.reference;
      document.querySelector("#stay-received").focus();
      progress(2);
    } catch (e) {
      if (e.status && e.status < 500) {
        submission = null;
      }
      if (submission) {
        for (const el of contact.elements) if (el !== button) el.disabled = true;
        document.querySelector("#edit-stay").disabled = true;
      }
      status.textContent =
        e.message === "dates_unavailable"
          ? T(
              "These dates are no longer available. Change your dates and try again.",
              "Estas fechas ya no están disponibles. Cambia las fechas e intenta de nuevo.",
            )
          : T(
              "We couldn’t confirm receipt. Your details are still here. Retry with the same details or contact us on WhatsApp.",
              "No pudimos confirmar la recepción. Tus datos siguen aquí. Intenta de nuevo con los mismos datos o escríbenos por WhatsApp.",
            );
    } finally {
      pending = false;
      button.disabled = false;
      button.textContent = T("Send stay request →", "Enviar solicitud →");
    }
  });
})();
