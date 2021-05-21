export function pruneDates(obj: any) {
  const cleaned: any = {};
  Object.entries(obj).forEach((property) => {
    if (property[1] instanceof Date) {
      cleaned[property[0]] = "[date]";
    } else {
      cleaned[property[0]] = property[1];
    }
  });

  return cleaned;
}
