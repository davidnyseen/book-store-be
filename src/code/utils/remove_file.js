import { unlink } from "node:fs/promises"

export async function removeFile(path) {
  try {
    await unlink(path)
  } catch (err) {
    return
  }
}
