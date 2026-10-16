const { test } = require('node:test');
const assert = require('node:assert/strict');
require('../assets/booking.js');
const { departureState, requiredMonths } = globalThis.WhiteSwanCalendar;
const day = (date, status = 'available', extra = {}) => [date, {date, status, minStay:1, closedCheckin:false, closedCheckout:false, ...extra}];
test('an occupied checkout day is allowed, but its night cannot be crossed', () => {
  const days = new Map([day('2026-11-10'), day('2026-11-11','unavailable'), day('2026-11-12')]);
  assert.equal(departureState('2026-11-10','2026-11-11',days),'available');
  assert.equal(departureState('2026-11-10','2026-11-12',days),'unavailable_nights');
  assert.equal(departureState('2026-11-11','2026-11-12',days),'unavailable_nights');
});
test('month boundary follows the same overnight rule', () => {
  const days = new Map([day('2026-10-31'),day('2026-11-01','unavailable'),day('2026-11-02')]);
  assert.equal(departureState('2026-10-31','2026-11-01',days),'available');
  assert.equal(departureState('2026-10-31','2026-11-02',days),'unavailable_nights');
});
test('restrictions, missing nights and date bounds cannot be bypassed', () => {
  let days = new Map([day('2026-11-10','available',{minStay:2}),day('2026-11-11'),day('2026-11-12')]);
  assert.equal(departureState('2026-11-10','2026-11-11',days),'minimum_stay');
  assert.equal(departureState('2026-11-10','2026-11-12',days),'available');
  days.set(...day('2026-11-12','available',{closedCheckout:true}));
  assert.equal(departureState('2026-11-10','2026-11-12',days),'closed_departure');
  days.delete('2026-11-12');
  assert.equal(departureState('2026-11-10','2026-11-12',days),'unknown');
  days.set(...day('2026-11-12')); days.delete('2026-11-11');
  assert.equal(departureState('2026-11-10','2026-11-12',days),'unknown');
  assert.equal(departureState('2026-11-10','2026-11-10',days),'invalid');
  assert.equal(departureState('2026-11-10','2026-12-11',days),'invalid');
  days.set(...day('2026-11-10','available',{closedCheckin:true}));
  assert.equal(departureState('2026-11-10','2026-11-12',days),'closed_arrival');
});
test('bounded month loading includes intermediate February and never fetches arbitrary history', () => {
  assert.deepEqual(requiredMonths('2027-03','2027-01-31').sort(), ['2027-01','2027-02','2027-03']);
  assert.deepEqual(requiredMonths('2027-03','2026-10-10'),['2027-03']);
  assert.deepEqual(requiredMonths('2026-11','2026-10-31').sort(),['2026-10','2026-11']);
  assert.deepEqual(requiredMonths('2026-11',''),['2026-11']);
});
