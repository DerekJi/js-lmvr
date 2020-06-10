import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import {Image as ImageLayer, Tile as TileLayer} from 'ol/layer';
import ImageWMS from 'ol/source/ImageWMS';
import OSM from 'ol/source/OSM';

var wmsSource = new ImageWMS({
  url: 'https://lsageoserver.geohub.sa.gov.au/locsa/wms',
  params: {'LAYERS': 'locsa:AquacultureLeasesAndLicences'},
  ratio: 1,
  serverType: 'geoserver'
});

var updateLegend = function(resolution) {
  var graphicUrl = wmsSource.getLegendUrl(resolution);
  var img = document.getElementById('legend');
  img.src = graphicUrl;
};

var layers = [
  new TileLayer({
    source: new OSM()
  }),
  new ImageLayer({
    extent: [12884991, -2870341, 1455066, -3838219],
    source: wmsSource
  })
];

var map = new Map({
  layers: layers,
  target: 'map',
  view: new View({
    center: [14397148, -3469099],
    zoom: 4
  })
});

// Initial legend
var resolution = map.getView().getResolution();
updateLegend(resolution);

// Update the legend when the resolution changes
map.getView().on('change:resolution', function(event) {
  var resolution = event.target.getResolution();
  updateLegend(resolution);
});

/**
 * Fetch legend using fetch() manually
 */
document.getElementById('btnFetch').onclick = function() {
  console.log('fetch');
  var graphicUrl = wmsSource.getLegendUrl(resolution);
  fetch(graphicUrl) 
    .then(function() {
        console.log('success');
    })
    .catch(function() {
        console.log('error');
    });
};