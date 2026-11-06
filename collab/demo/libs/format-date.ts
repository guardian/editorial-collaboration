import { getMonthName } from '../model/constants';

const formatDate = (timestamp: string) => {
  const date = new Date(timestamp);
  if (date.toString() === 'Invalid Date') {
    return;
  }
  const hours = date.getHours() < 13 ? date.getHours() : date.getHours() - 12;
  const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
  const meridiem = date.getHours() < 12 ? 'AM' : 'PM';
  return `${date.getDate()} ${getMonthName(date.getMonth())} ${date.getFullYear()}, ${hours}:${minutes} ${meridiem}`;
}

export { formatDate };