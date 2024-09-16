import { isValidObjectId } from 'mongoose';

export function validateId(id) {
  return isValidObjectId(id);
}
