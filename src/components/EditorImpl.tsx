import styled from "@emotion/styled"
import { PrivateSpec } from "../util/stateInterfaces"
import ButtonEditor from "./ButtonEditor"
import { v4 } from "uuid"
import { useTranslation } from "react-i18next"
import { css } from "@emotion/css"
import { useExeciseEditorOutputState } from "../hooks/useOutputState"

const NewButton = styled.button`
  margin: 0 auto;
  margin-bottom: 1rem;
  width: 100%;
  display: block;
  padding: 0.5rem;
  background-color: white;
  border: 1px solid black;
  transition: all 0.3s;

  &:hover {
    background-color: #f1f1f1;
  }
`

const EditorImpl = () => {
  const { t } = useTranslation()

  const { selected, updateState } = useExeciseEditorOutputState<PrivateSpec>(
    (privateSpec) => privateSpec,
  )
  if (!selected) {
    return null
  }

  return (
    <div
      className={css`
        padding: 1rem 0;
      `}
    >
      {selected.map((o) => (
        <ButtonEditor
          key={o.id}
          item={o}
          onDelete={() => {
            updateState((oldState) => {
              if (!oldState) {
                return
              }
              const index = oldState.findIndex((e) => e.id === o.id)
              oldState.splice(index, 1)
            })
          }}
          onChange={(task) => {
            updateState((oldState) => {
              if (!oldState) {
                return
              }
              const index = oldState.findIndex((e) => e.id === task.id)
              oldState[index] = task
            })
          }}
        />
      ))}
      <NewButton
        onClick={() => {
          updateState((oldState) => {
            if (!oldState) {
              return
            }
            oldState.push({ name: "", correct: false, id: v4() })
          })
        }}
      >
        {t("new")}
      </NewButton>
    </div>
  )
}

export default EditorImpl
