/* Convert from meter/second to kilometer/hour */
export function kilometerPerHour (value){
  return (value * 3.6).toFixed(1)
}

export function pushNotification(text){
  return document.querySelector('.notification-js').textContent = `${text}`.toUpperCase()
}

export function loadingState(state){
  return document.querySelector('#loading-js').className = `${state}`
}