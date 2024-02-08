import { createExerciseServiceContext } from "../shared-module/contexts/ExerciseServiceContext"
import { Answer, PrivateSpec } from "../util/stateInterfaces"

export const ExerciseServiceExerciseEditorContext = createExerciseServiceContext<PrivateSpec>(
  () => false,
)

export const ExerciseServiceAnswerExerciseContext = createExerciseServiceContext<Answer>(
  () => false,
)
