export function timeSince(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) {
    return Math.floor(interval) + " tahun lalu";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " bulan lalu";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " hari lalu";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " jam lalu";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " menit lalu";
  }
  return "beberapa saat lalu";
}
