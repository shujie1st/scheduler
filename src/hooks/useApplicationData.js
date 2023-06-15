import { useState, useEffect } from "react";
import axios from "axios";

// Create a custom hook to load the initial data from the API
// Also provide actions to update the sate
export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });
  
  const setDay = day => setState({ ...state, day });
  
  // Fetch data for days, appointments, interviewers
  // Then update the state
  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ]).then((all) => {
      setState(prev => ({...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data }));
    });  
  }, []);
  
  // Create a function to update spots value for days
  function getDaysWithUpdatedSpots(appointmentId, appointments) {
    let days = [...state.days];
    let day = state.days.find(day => day.appointments.includes(appointmentId));
    day.spots = day.appointments
      .filter(appointmentId => appointments[appointmentId].interview === null)
      .length;
    return days;
  }

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    
    // To book an interview: makes an HTTP request, then updates the local state
    return axios.put(`/api/appointments/${id}`, {interview: interview})
      .then(() => {
        setState({
          ...state,
          days: getDaysWithUpdatedSpots(id, appointments),
          appointments 
        });
      });
  }

  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    
    // To cancel an interview: makes an HTTP request, then updates the local state
    return axios.delete(`/api/appointments/${id}`)
      .then(() => {
        setState({
          ...state,
          days: getDaysWithUpdatedSpots(id, appointments),
          appointments
        });
      });
  }


  return { state, setDay, bookInterview, cancelInterview };
}