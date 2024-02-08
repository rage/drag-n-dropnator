import { PrivateSpec } from "../util/stateInterfaces"

import { useState } from "react"
import EditorImpl from "./EditorImpl"
import { ExerciseServiceExerciseEditorContext } from "../contexts/exerciseServiceContext"

interface Props {
  privateSpec: PrivateSpec
  port: MessagePort
}

const ExerciseEditor: React.FC<React.PropsWithChildren<Props>> = ({ port, privateSpec }) => {
  const [outputState, setOutputState] = useState<PrivateSpec | null>(privateSpec)

  return (
    <ExerciseServiceExerciseEditorContext.Provider
      value={{
        outputState,
        port: port,
        _rawSetOutputState: setOutputState,
        validate: () => true,
      }}
    >
      <EditorImpl />
    </ExerciseServiceExerciseEditorContext.Provider>
  )
}

export default ExerciseEditor
