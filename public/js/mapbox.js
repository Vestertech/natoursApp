/* eslint-disable */
const locations = JSON.parse(document.getElementById('map').dataset.locations);
console.log(locations);


mapboxgl.accessToken =
  'pk.eyJ1Ijoic3lsdmVzdGVyZXppYWdvciIsImEiOiJjbGVkcXZ6ZXUwOWk5NDRyNTRpM3B4M2Y5In0.udByJ3o870lYrI-7odMUiQ';
  
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11'
  });

