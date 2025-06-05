let map = L.map('map').setView([50.9375, 6.9603], 13); // Cologne center

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

let drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

let drawControl = new L.Control.Draw({
    edit: {
        featureGroup: drawnItems
    },
    draw: {
        polygon: false,
        rectangle: false,
        circle: false,
        marker: false,
        circlemarker: false
    }
});
map.addControl(drawControl);

let currentLayer = null;

map.on(L.Draw.Event.CREATED, function (e) {
    let layer = e.layer;
    drawnItems.addLayer(layer);
    currentLayer = layer;
});

map.on('click', function() {
    currentLayer = null;
});

map.on('draw:edited', function(e) {
    currentLayer = null;
});

fetch('/api/segments')
  .then(res => res.json())
  .then(data => {
      data.forEach(seg => {
          let layer = L.geoJSON(seg.geojson).getLayers()[0];
          layer.properties = seg;
          colorLayer(layer, seg.last_visited);
          layer.on('click', () => {
              currentLayer = layer;
              document.getElementById('teamInput').value = seg.team || '';
              document.getElementById('dateInput').value = seg.last_visited || '';
          });
          drawnItems.addLayer(layer);
      });
  });

function colorLayer(layer, last) {
    if (!last) {
        layer.setStyle({color:'orange'});
        return;
    }
    let days = (Date.now() - Date.parse(last)) / (1000*3600*24);
    if (days > 30) layer.setStyle({color:'red'});
    else layer.setStyle({color:'green'});
}

document.getElementById('saveBtn').onclick = () => {
    if (!currentLayer) return;
    let geojson = currentLayer.toGeoJSON();
    let team = document.getElementById('teamInput').value;
    let date = document.getElementById('dateInput').value;
    fetch('/api/segments', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
            id: currentLayer.properties ? currentLayer.properties.id : null,
            geojson: geojson,
            team: team,
            last_visited: date
        })
    }).then(res => res.json())
      .then(resp => {
          currentLayer.properties = {id: resp.id, team: team, last_visited: date};
          colorLayer(currentLayer, date);
      });
};
