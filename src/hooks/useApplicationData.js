import { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });
  
  const setDay = day => setState({ ...state, day });

  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ]).then((all) => {
      setState(prev => ({...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data }));
    });  
  }, []);

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    const dayIndex = state.days.findIndex(day => day.appointments.includes(id));
    let days = [...state.days]
    if (state.appointments[id].interview === null) {
      days[dayIndex].spots = state.days[dayIndex].spots - 1;
    }
    
    return axios.put(`/api/appointments/${id}`, {interview: interview})
      .then(() => {
        setState({
          ...state,
          days,
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
    const dayIndex = state.days.findIndex(day => day.appointments.includes(id));
    let days = [...state.days];
    days[dayIndex].spots = state.days[dayIndex].spots + 1;

    return axios.delete(`/api/appointments/${id}`)
      .then(() => {
        setState({
          ...state,
          days,
          appointments
        });
      });
  }


  return { state, setDay, bookInterview, cancelInterview };
}