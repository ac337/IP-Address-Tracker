const form = document.querySelector('form')
const inpt = document.querySelector('form input')
const IP_ADDRESS = document.querySelector('.ip_address')
const LOCATION = document.querySelector('.location')
const TIMEZONE = document.querySelector('.timezone')
const ISP = document.querySelector('.isp')
let lat
let long
let map

// IP Geolocation API
const apiUrl =
  'https://geo.ipify.org/api/v1?apiKey=at_ajEeLRJSALHYCFFsXTln5bE7iQ86X'

fetch('https://api.ipify.org?format=json')
  .then(res => res.json())
  .then(data => fetchGeolocation(data.ip))

form.addEventListener('submit', e => {
  e.preventDefault()
  const val = inpt.value.trim()
  fetchGeolocation(val)
})

const fetchGeolocation = async ip => {
  try {
    const res = await fetch(`${apiUrl}&domain=${ip}`)
    const data = await res.json()

    lat = data.location.lat
    long = data.location.lng

    const locationInfo = `${data.location.city}, ${data.location.country} ${data.location.postalCode}`

    IP_ADDRESS.textContent = data.ip
    ISP.textContent = data.isp
    LOCATION.textContent = locationInfo
    TIMEZONE.textContent = data.location.timezone

    setMap(lat, long, locationInfo)
    inpt.value = ''
  } catch (e) {
    alert('Invalid IP Address')
  }
}

const setMap = (lat, long, locationInfo) => {
  if (map) {
    map.remove()
    map = L.map('map', {
      center: [lat, long],
      zoom: 13,
      preferCanvas: true,
      zoomControl: false
    })
  } else {
    map = L.map('map', {
      center: [lat, long],
      zoom: 13,
      preferCanvas: true,
      zoomControl: false
    })
  }

  const markerIcon = L.icon({
    iconUrl: '/images/icon-location.svg'
  })

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}', {
    foo: 'bar',
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
  }).addTo(map)

  const marker = L.marker([lat, long], {
    icon: markerIcon,
    title: 'You are here'
  }).addTo(map)
  marker.bindPopup(locationInfo).openPopup()
}
