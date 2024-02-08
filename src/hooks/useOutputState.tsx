import {
  ExerciseServiceAnswerExerciseContext,
  ExerciseServiceExerciseEditorContext,
} from "../contexts/exerciseServiceContext"
import useExerciseServiceOutputState from "../shared-module/hooks/exerciseServiceHooks/useExerciseServiceOutputState"
import { Answer, PrivateSpec } from "../util/stateInterfaces"

export const useExeciseEditorOutputState = <SelectorReturnType,>(
  selector: (arg: PrivateSpec | null) => SelectorReturnType | null,
) => {
  return useExerciseServiceOutputState(
    ExerciseServiceExerciseEditorContext,
    selector,
    "private_spec",
  )
}

export const useAnswerExerciseOutputState = <SelectorReturnType,>(
  selector: (arg: Answer | null) => SelectorReturnType | null,
) => {
  return useExerciseServiceOutputState(
    ExerciseServiceAnswerExerciseContext,
    selector,
    "user_answer",
  )
}
