export const SERVER = 'https://editorial-collaboration.local.dev-gutools.co.uk';

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];
export const getMonthName = (index: number) => index < MONTHS.length ? MONTHS[index] : undefined;