/* Civil dates describe occupied nights. Departure is an exclusive boundary. */
(() => {
  const shift = (date, days) => new Date(Date.parse(date) + days * 86400000).toISOString().slice(0, 10);
  function departureState(arrival, departure, days) {
    const nights = (Date.parse(departure) - Date.parse(arrival)) / 86400000;
    if (!Number.isInteger(nights) || nights < 1 || nights > 30) return 'invalid';
    const first = days.get(arrival);
    if (first?.closedCheckin === true) return 'closed_arrival';
    // Stop at the first occupied NIGHT, not at an occupied checkout day.
    let unknown = false;
    for (let day = arrival; day < departure; day = shift(day, 1)) {
      const status = days.get(day)?.status;
      if (status === 'unavailable') return 'unavailable_nights';
      if (status !== 'available') unknown = true;
    }
    const last = days.get(departure);
    if (last?.closedCheckout === true) return 'closed_departure';
    if (Number.isInteger(first?.minStay) && nights < Math.max(1, first.minStay)) return 'minimum_stay';
    if (unknown || first?.closedCheckin !== false || !Number.isInteger(first?.minStay) || last?.closedCheckout !== false) return 'unknown';
    return 'available';
  }
  // Fetch only months needed to evaluate up to 30 occupied nights, including
  // the checkout boundary. This also covers January 31 through early March.
  function requiredMonths(month, arrival) {
    const keys = new Set([month]);
    if (/^\d{4}-\d{2}-\d{2}$/.test(arrival || '') && arrival.slice(0, 7) <= month &&
        Date.parse(month + '-01') - Date.parse(arrival) <= 30 * 86400000) {
      for (let i = 0; i <= 30; i++) {
        const key = shift(arrival, i).slice(0, 7);
        if (key > month) break;
        keys.add(key);
      }
    }
    return [...keys];
  }
  globalThis.WhiteSwanCalendar = Object.freeze({ departureState, requiredMonths });
})();
