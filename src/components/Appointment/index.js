import React from "react";
import "components/Appointment/styles.scss"

import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";
import useVisualMode from "hooks/useVisualMode";

export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const CONFIRM = "CONFIRM";
  const EDIT = "EDIT";
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE";

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewerId) {
    const interview = {
      student: name,
      interviewer: interviewerId
    };
    transition(SAVING);
    props
      .bookInterview(props.id, interview)
      .then(() => transition(SHOW)) // transition to SHOW when the promise returned resolved
      .catch(error => transition(ERROR_SAVE, true)); // transition to ERROR_SAVE, repalce the current mode in history
  }

  function destroy() {
    transition(DELETING, true); // show the DELETING indicator, and replace the current mode in history
    props
      .cancelInterview(props.id)
      .then(() => transition(EMPTY)) // transition to EMPTY when the promise returned resolved
      .catch(error => transition(ERROR_DELETE, true)); // transition to ERROR_DELETE, repalce the current mode in history
  }

  return (
    <article className="appointment" data-testid="appointment" >
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={() => transition(CONFIRM)}
          onEdit={() => transition(EDIT)}
        />
      )}
      {mode === CREATE && (
        <Form
          interviewers={props.interviewers}
          onCancel={back}
          onSave={save}
        />
      )}
      {mode === SAVING && <Status message='Saving' />}
      {mode === DELETING && <Status message='Deleting' />}
      {mode === CONFIRM && (
        <Confirm
          message='Are you sure you would like to delete?'
          onCancel={back}
          onConfirm={destroy}
        />
      )}
      {mode === EDIT && (
        <Form
          student={props.interview.student}
          interviewerId={props.interview.interviewer.id}
          interviewers={props.interviewers}
          onCancel={back}
          onSave={save}
        />
      )}
      {mode === ERROR_SAVE && (
        <Error
          message="Could not save appoinment."
          onClose={back}
        />
      )}
      {mode === ERROR_DELETE && (
        <Error
          message="Could not cancel appoinment."
          onClose={back}
        />
      )}
    </article>
  );
}