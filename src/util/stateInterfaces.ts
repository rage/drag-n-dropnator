export type PrivateSpec = Alternative[]

export type PublicSpec = PublicAlternative[]

export interface ModelSolutionSpec {
  correctOptionIds: string[]
}

export interface Answer {
  selectedOptionId: string | null
}

export interface GradingFeedback {
  selectedOptionIsCorrect: boolean
}

export interface PublicAlternative {
  id: string
  name: string
}

export interface Alternative {
  id: string
  name: string
  correct: boolean
}

export interface ClientErrorResponse {
  message: string
}
