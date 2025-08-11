const notificationElement = document.querySelector('.notification-js');

/* Convert from meter/second to kilometer/hour */
export function kilometerPerHour (value){
  return (value * 3.6).toFixed(1)
}

export function pushNotification(text){
  return notificationElement.textContent = `${text}`.toUpperCase()
}