import { useAnswerExerciseOutputState } from "../hooks/useOutputState"
import { Answer, PublicSpec } from "../util/stateInterfaces"
import ExerciseBase from "./ExerciseBase"

interface Props {
  publicSpec: PublicSpec
}

const AnswerExerciseImpl: React.FC<Props> = ({ publicSpec }) => {
  const { selected, updateState } = useAnswerExerciseOutputState<Answer>((answer) => answer)

  return (
    <ExerciseBase
      alternatives={publicSpec}
      selectedId={selected?.selectedOptionId ?? null}
      onClick={(selectedId) => {
        updateState((oldState) => {
          if (oldState === null) {
            throw new Error("oldState is null")
          }
          oldState.selectedOptionId = selectedId
        })
      }}
      interactable={true}
      model_solutions={null}
    />
  )
}

export default AnswerExerciseImpl
