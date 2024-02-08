/* eslint-disable i18next/no-literal-string */
import { NextApiRequest, NextApiResponse } from "next"

import { SpecRequest } from "../../shared-module/bindings"
import { isSpecRequest } from "../../shared-module/bindings.guard"
import {
  ClientErrorResponse,
  ModelSolutionSpec,
  PublicAlternative,
} from "../../util/stateInterfaces"

import { cors, runMiddleware } from "../../util/cors"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await runMiddleware(req, res, cors)

  if (req.method !== "POST") {
    return res.status(404).json({ message: "Not found" })
  }

  try {
    if (!isSpecRequest(req.body)) {
      throw new Error("Request was not valid.")
    }
    return handlePost(req, res)
  } catch (e) {
    console.error("Model solution request failed:", e)
    if (e instanceof Error) {
      return res.status(500).json({
        error_name: e.name,
        error_message: e.message,
        error_stack: e.stack,
      })
    }
  }
}

const handlePost = (
  req: NextApiRequest,
  res: NextApiResponse<ModelSolutionSpec | ClientErrorResponse>,
) => {
  const specRequest = req.body as SpecRequest
  const uncheckedAlternatives: unknown = specRequest.private_spec
  if (!Array.isArray(uncheckedAlternatives)) {
    return res.status(400).json({
      message: "Malformed data:" + JSON.stringify(uncheckedAlternatives),
    })
  }

  const correctAlternatives: ModelSolutionSpec = {
    correctOptionIds: uncheckedAlternatives
      .filter((alt) => Boolean(alt.correct))
      .map<string>((x: PublicAlternative) => x.id),
  }

  return res.status(200).json(correctAlternatives)
}
