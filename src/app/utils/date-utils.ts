export const getDateWithoutTimezone = (d: Date) =>
  new Date(
    d.getFullYear(),
    d.getMonth(),
    d.getDate(),
    d.getHours(),
    d.getMinutes() - d.getTimezoneOffset()
  ).toISOString();

// export { getDateWithoutTimezone };
