/* eslint-disable */



export const displayMap = (locations) => {

  mapboxgl.accessToken =
    'pk.eyJ1Ijoic3lsdmVzdGVyZXppYWdvciIsImEiOiJjbGVkcXZ6ZXUwOWk5NDRyNTRpM3B4M2Y5In0.udByJ3o870lYrI-7odMUiQ';
  
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/sylvestereziagor/clefhki9v001101m0sezhdfdu',
    scrollZoom: false
    // center map to a location,
    // center: [-118.113491, 34.111745],
    // zoom: 10,
    // interactive:false
  });

  // Adding Markers
  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach(loc => {
    // Create marker
    const el = document.createElement('div');
    el.className = 'marker';
  
    // Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom'
    }).setLngLat(loc.coordinates).addTo(map);

    // Add popup
    new mapboxgl.popup({
      offset: 30
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}<p>`)
      .addTo(map);

    // Extend map bounds to include current locations
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100
    }
  });
};
