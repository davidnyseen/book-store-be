export const Gender = {
  BOTH: 0,
  MALE: 1,
  FEMALE: 2,
};

export function stringToGender(g) {
  if (!g) return undefined;

  const gender = g.toLowerCase();
  switch (gender) {
    case "0":
    case "both":
      return Gender.BOTH;
    case "1":
    case "male":
      return Gender.MALE;
    case "2":
    case "female":
      return Gender.FEMALE;
    default:
      return undefined;
  }
}
