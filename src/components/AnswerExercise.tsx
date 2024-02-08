import { useState } from "react"

import { Answer, PublicSpec } from "../util/stateInterfaces"

import AnswerExerciseImpl from "./AnswerExerciseImpl"
import { ExerciseServiceAnswerExerciseContext } from "../contexts/exerciseServiceContext"

interface Props {
  publicSpec: PublicSpec
  port: MessagePort
}

const Exercise: React.FC<React.PropsWithChildren<Props>> = ({ port, publicSpec }) => {
  const [outputState, setOutputState] = useState<Answer | null>({ selectedOptionId: null })

  return (
    <ExerciseServiceAnswerExerciseContext.Provider
      value={{
        outputState: outputState,
        port: port,
        _rawSetOutputState: setOutputState,
        validate: () => true,
      }}
    >
      <AnswerExerciseImpl publicSpec={publicSpec} />
    </ExerciseServiceAnswerExerciseContext.Provider>
  )
}

export default Exercise
