import { kilometerPerHour, pushNotification, loadingState } from "./utils.js";


//API keys would be move to environment variables.
const openWeather = {
  key: 'dc8af93b0a038e0dc7903c85e737cc26',
  url: `https://api.openweathermap.org/data/2.5/weather?`
};
const openCage = {
  key: '2edf7e125fb44d6fbad91848d9b9dbf7',
  url: 'https://api.opencagedata.com/geocode/v1/json?'
};

// Main entry point
document.addEventListener('DOMContentLoaded', async () => {
  initAutoSearch();
  initNotificationObserver();
  await renderByUserLocation();
});

// Initialize search bar with debounce
function initAutoSearch() {
  const searchBarElement = document.querySelector('.search-bar-js');
  searchBarElement.value = '';
  searchBarElement.addEventListener('input', debounce(getData, 1000));
}

// Debounce for input events
function debounce(fn, delay) {
  let setIndex = 0;
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
          console.error('Error in debounce function:', error);
        } finally {
          hideLoadingSpinner();
        }
      }, delay);
    } else {
      // If input is cleared, show weather for user location
      renderByUserLocation();
    }
  };
}

async function getData(coordinate) {
  if (!coordinate || !coordinate.latitude || !coordinate.longitude) {
    pushNotification(`Invalid coordinate provided. Try again.`);
    return;
  }
  console.log('Sent API Request to Open Weather');
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
    console.error('Error fetching data:', error);
    pushNotification('Unable to fetch weather data. Try again later.');
  }
}

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

  // Show weather description 
  pushNotification(description);

  // HERO SECTION 
  const heroSectionElement = document.querySelector('.hero__section');
  heroSectionElement.innerHTML = `
    <img class="hero__icon hero-icon-js" src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}" width="200" height="200" aria-label="Weather icon: ${description}">
    <h1 class="temperature temperature-js" role="status"><span class="temp-value-js">${temp}</span>&deg;c</h1>
    <h2 class="location location-js" role="status">${name}, ${country}</h2>
  `;

  // WEATHER DATA 
  const weatherDataElement = document.querySelector('.weather__data');
  weatherDataElement.innerHTML = `
    <div class="data__col humidity">
      <img class="data__icon humidity-icon-js" src="./assets/Icons/Humidity.svg" alt="Humidity" width="60" height="60">
      <div class="data">
        <p class="data__value" role="status"><span class="humidity-value-js">${humidity}</span>%</p>
        <h3 class="data__title humidity-title-js">Humidity</h3>
      </div>
    </div>
    <div class="data__col data2">
      <img class="data__icon wind-icon-js" src="./assets/Icons/Wind thin.svg" alt="Wind speed" width="60" height="60">
      <div class="data">
        <p class="data__value" role="status"><span class="wind-value-js">${kilometerPerHour(wind_speed)}</span>km/h</p>
        <h3 class="data__title wind-title-js">Wind Speed</h3>
      </div>
    </div>
  `;

  // Swipe UP 
  const swipeElement = document.querySelector('.swipe-up');
  swipeElement.textContent = `Swipe UP`;
}

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
  console.log('Sent API Request to convert text to coordinate');
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
      pushNotification("No results found.");
      return null;
    }
  } catch (error) {
    console.error('Error converting text: ', error);
    pushNotification("Cannot find input location. Try again.");
    return null;
  }
}

async function renderByUserLocation() {
  pushNotification("Fetching user's location...");
  try {
    showLoadingSpinner();
    const position = await getUserLocation();
    const { latitude, longitude } = position.coords;
    await getData({ latitude, longitude });
  } catch (error) {
    console.error('Error fetching user location:', error);
    pushNotification(`Unable to fetch user location.`);
  } finally {
    hideLoadingSpinner();
  }
}

// loading spinner
function showLoadingSpinner() {
  const loadingDiv = document.getElementById('loading-js');
  if (loadingDiv) {
    loadingDiv.className = 'show';
    loadingDiv.innerHTML = 'W';
  }
}

function hideLoadingSpinner() {
  const loadingDiv = document.getElementById('loading-js');
  if (loadingDiv) {
    loadingDiv.className = 'hide';
    loadingDiv.innerHTML = '';
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
  observer.observe(targetNode, {
    characterData: true,
    childList: true,
    subtree: true,
  });
}

// Animate notification pop-down
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