export function getAppointmentsForDay(state, day) {
  let apptsArray = [];
  let selectedDay = state.days.find(dayObject => dayObject.name === day);
  if (selectedDay) {
    for (const id of selectedDay.appointments) {
      apptsArray.push(state.appointments[id]);
    }
  }
  return apptsArray;
}