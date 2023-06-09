import React, { useState } from "react";
import InterviewerList from "components/InterviewerList";
import Button from "components/Button";

export default function Form(props) {
  const [student, setStudent] = useState(props.student || "");
  const [interviewerId, setInterviewerId] = useState(props.interviewerId || null);
  const [error, setError] = useState("");

  const reset = () => {
    setStudent("");
    setInterviewerId(null);
  }

  const cancel = () => {
    reset();
    props.onCancel();
  }
  
  // Validate student input is not empty and interviewer is selected
  // Then calls props.onSave
  function validate() {
    if (student === "") {
      setError("Student name cannot be blank");
      return;
    }

    if (interviewerId === null) {
      setError("Please select an interviewer");
      return;
    }

    setError("");
    props.onSave(student, interviewerId);
  }

  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form onSubmit={event => event.preventDefault()} autoComplete="off">
          <input
            className="appointment__create-input text--semi-bold"
            name="name"
            type="text"
            placeholder="Enter Student Name"
            value={student}
            onChange={(event) => setStudent(event.target.value)}
            data-testid="student-name-input"
          />
        </form>
        <section className="appointment__validation">{error}</section>
        <InterviewerList 
          interviewers={props.interviewers}
          value={interviewerId}
          onChange={setInterviewerId}
        />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button danger onClick={cancel} >Cancel</Button>
          <Button confirm onClick={validate} >Save</Button>
        </section>
      </section>
    </main>
  );
}