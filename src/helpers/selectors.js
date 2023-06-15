// Create a function to return an array of appointments for the given day
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

// Create a function to return an array of interviewer id for the given day
export function getInterviewersForDay(state, day) {
  let interviewersArray = [];
  let selectedDay = state.days.find(dayObject => dayObject.name === day);
  if (selectedDay) {
    for (const id of selectedDay.interviewers) {
      interviewersArray.push(state.interviewers[id]);
    }
  }
  return interviewersArray;
}

// Create a function to return an object with the interviewer data
// It will return null if no interview is booked
export function getInterview(state, interview) {
  if (interview && interview.interviewer) {
    return {...interview, interviewer: state.interviewers[interview.interviewer]};
  }
  return null;
};