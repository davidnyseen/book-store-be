import { codeToString } from "./status"

export function wrapResponse(data, status) {
  const response = {
    status: "success",
    message: codeToString(status),
    data: data
  }
  return response
}
