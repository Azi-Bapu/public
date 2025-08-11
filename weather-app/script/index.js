import { kilometerPerHour, pushNotification } from "./utils.js";


//API keys would be move to environment variables.
const openWeather = {
  key: 'dc8af93b0a038e0dc7903c85e737cc26',
  url: `https://api.openweathermap.org/data/2.5/weather?`
};
const openCage = {
  key: '2edf7e125fb44d6fbad91848d9b9dbf7',
  url: 'https://api.opencagedata.com/geocode/v1/json?'
};


// DOM elements
const searchBarElement = document.querySelector('.search-bar-js');
const heroSectionElement = document.querySelector('.hero-section-js');
const weatherDataElement = document.querySelector('.weather-data-js');
const swipeElement = document.querySelector('.swipe-up');
const loadingDiv = document.getElementById('loading-js');
const notificationElement = document.querySelector('.notification-js');

// Initial load
searchBarElement.value = '';
searchBarElement.addEventListener('input', debounce(getData, 1000));
initNotificationObserver();
/* initDataObserver(); */
(async () => {
  // Render weather data of user's location on initial load
  await renderByUserLocation(); 
})();


// Debounce for input events
function debounce(fn, delay) {
  let setIndex = null;
  
  return (e) => {
    if (setIndex) clearTimeout(setIndex);
    if (e.target.value.length !== 0) {
      setIndex = setTimeout(async () => {
        try {
          showLoadingSpinner();
          const coordinate = await textToCoordinate(e.target.value);
          if (coordinate) {
            await fn(coordinate);
          }
        } catch (error) {
          pushNotification('Error searching location.');
        } finally {
          hideLoadingSpinner();
          clearInterval(setIndex); // Clear timeout to prevent memory leaks
          setIndex = null;
        }
      }, delay);
    } else {
      // If input is cleared, show weather for user location
      renderByUserLocation();
    }
  };
}


// Initialize notification and lazy loading observers
function initNotificationObserver() {
  const observer = new MutationObserver((mutationList) => {
    if(mutationList.length){
      /* console.log(mutationList) */
      notification()
    }
  })
  observer.observe(notificationElement, {
    characterData: true,
    childList: true,
  });
}
/* function initDataObserver() {
  const observer = new MutationObserver((mutationList) => {
    if(mutationList.length){
      lazyloading()
    }
  })
  observer.observe(weatherDataElement, {
    childList: true,
  });
} 
const lazyloading = (() => {
  let timeOut = 0;
  return () => {
    clearTimeout(timeOut);
    weatherDataElement.style.opacity = '1'
    heroSectionElement.style.opacity = '1'
    timeOut = setTimeout(() => {
      weatherDataElement.style.opacity = '1'
      heroSectionElement.style.opacity = '1'
      timeOut = null;
    }, 500);
  };
})();  */


// Page Rendering
function renderData(data) {
  // Cross-check required data
  if (!data || !data.weather || !data.main || !data.wind || !data.sys) {
    pushNotification('Weather data is incomplete.');
    return;
  }
  const { weather, main, wind, sys, name } = data;
  const { icon, description } = weather[0];
  const { temp, humidity } = main;
  const { speed: wind_speed } = wind;
  const { country } = sys;

  pushNotification(description);

  // HERO SECTION with fade-in
  if (heroSectionElement) {
    heroSectionElement.innerHTML = `
      <img class="hero__icon hero-icon-js" src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}" width="200" height="200" aria-label="Weather icon: ${description}" loading="lazy">
      <h1 class="temperature temperature-js" role="status"><span class="temp-value-js">${temp}</span>&deg;c</h1>
      <h2 class="location location-js" role="status">${name}, ${country}</h2>
    `;
  }

  // WEATHER DATA with fade-in
  if (weatherDataElement) {
    weatherDataElement.innerHTML = `
      <div class="data__col humidity" aria-label="Humidity data">
        <img class="data__icon humidity-icon-js" src="./assets/Icons/Humidity.svg" alt="Humidity" width="60" height="60" loading="lazy">
        <div class="data" role="status">
          <p class="data__value"><span class="humidity-value-js">${humidity}</span>%</p>
          <h3 class="data__title humidity-title-js">Humidity</h3>
        </div>
      </div>
      <div class="data__col data2" aria-label="Wind speed data">
        <img class="data__icon wind-icon-js" src="./assets/Icons/Wind thin.svg" alt="Wind speed" width="60" height="60" loading="lazy">
        <div class="data" role="status">
          <p class="data__value"><span class="wind-value-js">${kilometerPerHour(wind_speed)}</span>km/h</p>
          <h3 class="data__title wind-title-js">Wind Speed</h3>
        </div>
      </div>
    `;
  }

  // Swipe UP 
  if (swipeElement) {
    swipeElement.style.opacity = `1`;
  }

}
async function renderByUserLocation() {
  pushNotification("Fetching user's location...");
  try {
    searchBarElement.disabled = true; 
    showLoadingSpinner();
    const position = await getUserLocation();
    const { latitude, longitude } = position.coords;
    await getData({ latitude, longitude });
  } catch (error) {
    pushNotification('Unable to fetch user location.');
  } finally {
    hideLoadingSpinner();
    searchBarElement.disabled = false;
  }
}
async function getData(coordinate) {
  if (!coordinate || !coordinate.latitude || !coordinate.longitude) {
    pushNotification('Invalid coordinate provided. Try again.');
    return;
  }
  try {
    const response = await fetch(`${openWeather.url}lat=${coordinate.latitude}&lon=${coordinate.longitude}&appid=${openWeather.key}&units=metric`);
    if (!response.ok) {
      throw new Error('Weather API response not ok');
    }
    const jsonResponse = await response.json();
    if (!jsonResponse || !jsonResponse.weather || !jsonResponse.main || !jsonResponse.wind || !jsonResponse.sys) {
      pushNotification('Incomplete weather data received.');
      return;
    }

    renderData(jsonResponse);
  } catch (error) {
    pushNotification('Unable to fetch weather data. Try again later.');
  }
}


// Utility
function getUserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'));
    } else {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    }
  });
}
async function textToCoordinate(address) {
  if (!address) return null;
  try {
    const response = await fetch(`${openCage.url}q=${encodeURIComponent(address)}&key=${openCage.key}&limit=1&countrycode=ng`);
    if (!response.ok) {
      throw new Error('Geocoding API response not ok');
    }
    const data = await response.json();
    if (data.status.code === 200 && data.results && data.results.length > 0) {
      const { lat: latitude, lng: longitude } = data.results[0].geometry;
      return { latitude, longitude };
    } else {
      pushNotification('No results found.');
      return null;
    }
  } catch (error) {
    pushNotification('Cannot find input location. Try again.');
    return null;
  }
}


// Loader and Notification Animation 
function showLoadingSpinner() {
  loadingDiv.style.opacity =  '1';
}
function hideLoadingSpinner() {
  loadingDiv.style.opacity = '0';
}
const notification = (() => {
  let timeOut = 0;
  return () => {
    clearTimeout(timeOut);
    notificationElement.style = 'transform: translateY(1.7rem); opacity: 1;';
    timeOut = setTimeout(() => {
      notificationElement.style = 'transform: translateY(-2rem); opacity: 0;';
      timeOut = null;
    }, 3000);
  };
})();






