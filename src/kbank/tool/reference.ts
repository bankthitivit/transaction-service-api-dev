import moment from 'moment'

export function reference1(): string {
  const date = new Date()
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  return '00' + year + month + day + '0000000000'
}