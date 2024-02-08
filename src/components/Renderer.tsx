import React from "react"
import { useTranslation } from "react-i18next"

import { State } from "../pages/iframe"
import { EXERCISE_SERVICE_CONTENT_ID } from "../shared-module/utils/constants"
import withErrorBoundary from "../shared-module/utils/withErrorBoundary"
import withNoSsr from "../shared-module/utils/withNoSsr"

import AnswerExercise from "./AnswerExercise"
import ExerciseEditor from "./ExerciseEditor"
import ViewSubmission from "./ViewSubmission"

import { GradingFeedback } from "../util/stateInterfaces"

interface RendererProps {
  state: State | null
  port: MessagePort | null
}

const Renderer: React.FC<React.PropsWithChildren<RendererProps>> = ({ state, port }) => {
  const { t } = useTranslation()

  if (!port) {
    return <>{t("waiting-for-port")}</>
  }

  if (!state) {
    return <>{t("waiting-for-content")}</>
  }

  if (state.view_type === "answer-exercise") {
    return (
      <div id={EXERCISE_SERVICE_CONTENT_ID}>
        <AnswerExercise port={port} publicSpec={state.public_spec} />
      </div>
    )
  } else if (state.view_type === "view-submission") {
    const feedbackJson: unknown | null = state.grading?.feedback_json
    const GradingFeedback = feedbackJson ? (feedbackJson as GradingFeedback) : null
    return (
      <div id={EXERCISE_SERVICE_CONTENT_ID}>
        <ViewSubmission
          port={port}
          publicSpec={state.public_spec}
          answer={state.answer}
          gradingFeedback={GradingFeedback}
          modelSolutionSpec={state.model_solution_spec ?? null}
        />
      </div>
    )
  } else if (state.view_type === "exercise-editor") {
    return (
      <div id={EXERCISE_SERVICE_CONTENT_ID}>
        <ExerciseEditor privateSpec={state.private_spec} port={port} />
      </div>
    )
  } else {
    return <>{t("waiting-for-content")}</>
  }
}

export default withErrorBoundary(withNoSsr(Renderer))
