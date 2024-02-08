import React, { useState } from "react"
import ReactDOM from "react-dom"
import { useTranslation } from "react-i18next"

import Renderer from "../components/Renderer"
import { ExerciseTaskGradingResult } from "../shared-module/bindings"
import HeightTrackingContainer from "../shared-module/components/HeightTrackingContainer"
import { forgivingIsSetStateMessage } from "../shared-module/exercise-service-protocol-types"
import { isSetLanguageMessage } from "../shared-module/exercise-service-protocol-types.guard"
import useExerciseServiceParentConnection from "../shared-module/hooks/useExerciseServiceParentConnection"
import withErrorBoundary from "../shared-module/utils/withErrorBoundary"
import {
  Alternative,
  Answer,
  GradingFeedback,
  ModelSolutionSpec,
  PrivateSpec,
  PublicSpec,
} from "../util/stateInterfaces"

export interface SubmissionData {
  grading: ExerciseTaskGradingResult
  user_answer: Answer
  public_spec: PublicSpec
}

export type State =
  | {
      view_type: "answer-exercise"
      public_spec: PublicSpec
    }
  | {
      view_type: "view-submission"
      public_spec: PublicSpec
      answer: Answer
      feedback_json: GradingFeedback | null
      model_solution_spec: ModelSolutionSpec | null
      grading: ExerciseTaskGradingResult | null
    }
  | {
      view_type: "exercise-editor"
      private_spec: PrivateSpec
    }

const Iframe: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { i18n } = useTranslation()
  const [state, setState] = useState<State | null>(null)

  const port = useExerciseServiceParentConnection((messageData) => {
    if (forgivingIsSetStateMessage(messageData)) {
      ReactDOM.flushSync(() => {
        if (messageData.view_type === "answer-exercise") {
          setState({
            view_type: messageData.view_type,
            public_spec: messageData.data.public_spec as PublicSpec,
          })
        } else if (messageData.view_type === "exercise-editor") {
          setState({
            view_type: messageData.view_type,
            private_spec: (messageData.data.private_spec as Alternative[]) || [],
          })
        } else if (messageData.view_type === "view-submission") {
          const userAnswer = messageData.data.user_answer as Answer
          setState({
            view_type: messageData.view_type,
            public_spec: messageData.data.public_spec as PublicSpec,
            answer: userAnswer,
            feedback_json: messageData.data.grading?.feedback_json as GradingFeedback | null,
            model_solution_spec: messageData.data.model_solution_spec as ModelSolutionSpec | null,
            grading: messageData.data.grading,
          })
        } else {
          // eslint-disable-next-line i18next/no-literal-string
          console.error("Unknown view type received from parent")
        }
      })
    } else if (isSetLanguageMessage(messageData)) {
      i18n.changeLanguage(messageData.data)
    } else {
      // eslint-disable-next-line i18next/no-literal-string
      console.error("Frame received an unknown message from message port")
    }
  })

  return (
    <HeightTrackingContainer port={port}>
      <div>
        <Renderer port={port} setState={setState} state={state} />
      </div>
    </HeightTrackingContainer>
  )
}

export default withErrorBoundary(Iframe)
