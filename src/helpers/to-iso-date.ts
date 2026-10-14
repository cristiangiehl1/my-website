/** Project dates are MM/DD/YYYY; returns YYYY-MM-DD without going through Date(). */
export function toIsoDate(date: string): string {
  const [month, day, year] = date.split('/')
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
}
