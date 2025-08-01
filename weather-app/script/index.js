import {kilometerPerHour, pushNotification, loadingState} from "./utils.js"


const openWeather = {

  key : 'dc8af93b0a038e0dc7903c85e737cc26',
  url : `https://api.openweathermap.org/data/2.5/weather?`
}
const openCage = {
  key : '2edf7e125fb44d6fbad91848d9b9dbf7',
  url : 'https://api.opencagedata.com/geocode/v1/json?'
}

document.addEventListener('DOMContentLoaded', async () => {
  initAutoSearch()
  initNotificationObserver()
  await renderByUserLocation()
})

function initAutoSearch(){

  const searchBarElement = document.querySelector('.search-bar-js')
  searchBarElement.value = ''
  searchBarElement.addEventListener('input', debounce(getData, 1000))
}

function debounce(fn, delay){

  let setIndex = 0
  return (e) => {
    console.log(e.target.value) 
    if(setIndex) clearTimeout(setIndex)
    if(e.target.value.length !== 0){
        setIndex = setTimeout( async () => {
          try {
            loadingState('show')
            const coordinate = await textToCoordinate(e.target.value)
            await fn(coordinate)
            loadingState('hide')
            return
          } catch(error){
            console.error('Error in debounce function:', error)
            loadingState('hide')
          }
        
      }, delay)
    } else {
      async () => {
        await renderByUserLocation()
      }
    } 
  }  
}

async function getData(coordinate){
  
  const {latitude, longitude} = coordinate

  if(!coordinate || !coordinate.latitude || !coordinate.longitude){
      pushNotification(`Invalid coordinate provided. Try again.`)
      return
    } else {
      console.log('Sent API Request to Open Weather')

      try {
        const response = await fetch(`${openWeather.url}lat=${latitude}&lon=${longitude}&appid=${openWeather.key}&units=metric`)
        const jsonResponse = await response.json()
        console.log(jsonResponse)
        renderData(jsonResponse)
      }
      catch (error) {
        console.error('Error fetching data:', error)
        pushNotification('Unable to fetch weather data. Try again later.')
      }
    }
}

function renderData(data){
  /* Save needed weather data */
  const {weather, main, wind, sys, name} = data
  const {icon, description} = weather[0]
  const {temp, humidity} = main
  const {speed: wind_speed} = wind
  const {country, sunrise, sunset} = sys

  /* Weather description */
  pushNotification(description)

  /* HERO SECTION */
  const heroSectionElement = document.querySelector('.hero__section')
  heroSectionElement.innerHTML = `
    <img class="hero__icon hero-icon-js" src= "https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}" width="200" height="200">
    <h1 class="temperature temperature-js"><span class="temp-value-js">${temp}</span>&deg;c</h1>
    <h2 class="location location-js">${name}, ${country}</h2>
  `

  /* WEATHER DATA */
  const weatherDataElement = document.querySelector('.weather__data')
  weatherDataElement.innerHTML = `
    <div class="data__col humidity">
      <img class="data__icon humidity-icon-js" src="./assets/Icons/Humidity.svg" alt="Water" width="60" height="60">
      <div class="data">
        <p class="data__value"><span class="humidity-value-js">${humidity}</span>%</p>
        <h3 class="data__title humidity-title-js">Humidity</h3>
      </div>
    </div>
    <div class="data__col data2">
      <img class="data__icon wind-icon-js" src="./assets/Icons/Wind thin.svg" alt="Wind" width="60" height="60">
      <div class="data">
        <p class="data__value"><span class="wind-value-js">${kilometerPerHour(wind_speed)}</span>km/h</p>
        <h3 class="data__title wind-title-js">Wind Speed</h3>
      </div>
    </div>
  `

  /* Swipe UP */
  const swipeElement = document.querySelector('.swipe-up')
  swipeElement.textContent = `Swipe UP`

/* 
  const heroIconElement = document.querySelector('.hero-icon-js')
  heroIconElement.src = `https://openweathermap.org/img/wn/${icon}@2x.png`

  const temperatureElement = document.querySelector('.temp-value-js')
  temperatureElement.textContent = temp

  const locationElement = document.querySelector('.location-js')
  locationElement.textContent = `${name}, ${country}`


  const humidityIconElement = document.querySelector('.humidity-icon-js')
  humidityIconElement.src = "./assets/Icons/Humidity.svg"


  const humidityValueElement = document.querySelector('.humidity-value-js')
  humidityValueElement.textContent = humidity


  const humidityTitleElement = document.querySelector('.humidity-title-js')
  humidityTitleElement.textContent = 'Humidity'
  

  const windIconElement = document.querySelector('.wind-icon-js')
  windIconElement.src = "./assets/Icons/Wind thin.svg"


  const windValueElement = document.querySelector('.wind-value-js')
  windValueElement.textContent = kilometerPerHour(wind_speed)


  const windTitleElement = document.querySelector('.wind-title-js')
  windTitleElement.textContent = 'Wind Speed'
*/

}

function getUserLocation(){
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

async function textToCoordinate(address){

  console.log('Sent API Request to convert text to coordinate')

  try {
    const response = await fetch(`${openCage.url}q=${encodeURIComponent(address)}&key=${openCage.key}&limit=1&countrycode=ng`)
    const data = await response.json()

    if (data.status.code == 200) {
      const { lat: latitude, lng: longitude } = data.results[0].geometry;
      console.log('Country', data.results[0].components.country);
      console.log(data.results[0].components.city, latitude, longitude);

      return {
        latitude,
        longitude
      }
    } else {
      console.log("Error: ", data.status.message, "Code: ", data.status.code);
      pushNotification("No results found.")
    }
  } catch(error) {
    console.error('Error converting text: ', error)
    pushNotification("Cannot find input location. Try again.")
  }
}

async function renderByUserLocation(){

  pushNotification("Fetching user's location...")
  try {
    loadingState('show')
    const position = await getUserLocation()
    const { latitude, longitude } = position.coords

    console.log('Default location: ',latitude, longitude)
    console.log('Default location sent')
    await getData({ latitude, longitude })
    loadingState('hide')
  } catch (error) {
    console.error('Error fetching user location:', error)
    pushNotification(`Unable to fetch User location.`)
    loadingState('hide')
  }
  
}

function initNotificationObserver() {

  const targetNode = document.querySelector('.notification-js');

  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (
        mutation.type === 'characterData' ||
        (mutation.type === 'childList' && mutation.target === targetNode)
      ) {
        notification();
      }
    }
  });

  // Start observing the element for changes
  observer.observe(targetNode, {
    characterData: true,
    childList: true,
    subtree: true,
  });
}

const notification = (() => {

  let timeOut = 0;

  return () => {
    const notificationElement = document.querySelector('.notification-js');

    clearTimeout(timeOut);

    notificationElement.classList.add('notification-down');

    timeOut = setTimeout(() => {
      notificationElement.classList.remove('notification-down');
    }, 5000);
  };
})();