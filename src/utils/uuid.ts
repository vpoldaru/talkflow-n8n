import * as uuid from 'uuid';
const uuidv4 = uuid.v4;

export const generateUUID = (): string => {
  return uuidv4();
};