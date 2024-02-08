/* eslint-disable i18next/no-literal-string */
import type { NextApiRequest, NextApiResponse } from "next"

import {
  GradingRequest,
  GradingResult,
} from "../../shared-module/exercise-service-protocol-types-2"
import { isNonGenericGradingRequest } from "../../shared-module/exercise-service-protocol-types.guard"
import { Alternative, Answer, GradingFeedback, PrivateSpec } from "../../util/stateInterfaces"

import { cors, runMiddleware } from "../../util/cors"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await runMiddleware(req, res, cors)
  if (req.method !== "POST") {
    return res.status(404).json({ message: "Not found" })
  }

  try {
    if (!isNonGenericGradingRequest(req.body)) {
      throw new Error("Invalid grading request")
    }
    return handlePost(req, res)
  } catch (e) {
    console.error("Grading request failed:", e)
    if (e instanceof Error) {
      return res.status(500).json({
        error_name: e.name,
        error_message: e.message,
        error_stack: e.stack,
      })
    }
  }
}

type ExampleExerciseGradingResult = GradingResult<GradingFeedback | null>

type ServiceGradingRequest = GradingRequest<PrivateSpec, Answer>

const handlePost = (req: NextApiRequest, res: NextApiResponse<ExampleExerciseGradingResult>) => {
  const gradingRequest: ServiceGradingRequest = req.body

  if (!gradingRequest?.submission_data?.selectedOptionId) {
    return res.status(200).json({
      grading_progress: "FullyGraded",
      score_given: 0,
      score_maximum: 1,
      feedback_text: "You didn't select anything",
      feedback_json: null,
    })
  }

  const selectedOptionId = gradingRequest?.submission_data?.selectedOptionId

  const selectedOptionSpec = gradingRequest?.exercise_spec.find((o) => o.id == selectedOptionId)
  if (!selectedOptionSpec || !selectedOptionSpec.correct) {
    return res.status(200).json({
      grading_progress: "FullyGraded",
      score_given: 0,
      score_maximum: 1,
      feedback_text: "Your answer was not correct",
      feedback_json: { selectedOptionIsCorrect: false },
    })
  }

  res.status(200).json({
    grading_progress: "FullyGraded",
    score_given: 1,
    score_maximum: 1,
    feedback_text: "Good job!",
    feedback_json: { selectedOptionIsCorrect: true },
  })
}
