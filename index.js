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

var options = {
  method: 'GET', // *GET, POST, PUT, DELETE, etc.
  mode: 'no-cors',
  headers: {
    'Content-Type': 'text/plain',
    'Accept': '*/*'
  }
};

var xmlapi = 'https://lsageoserver.geohub.sa.gov.au/locsa/wms?service=wms&version=1.3.0&format=text/xml&request=GetCapabilities';

/**
 * Reset log panel
 */
document.getElementById('btnReset').onclick = function() {
  document.getElementById('log').innerText = '';
}

document.getElementById('btnFetchXmlNoCors').onclick = function() {
  fetchXml(xmlapi, true);
}

document.getElementById('btnFetchXml').onclick = function() {
  fetchXml(xmlapi, false);
}

/**
 * Fetch legend using fetch() manually
 */
document.getElementById('btnFetchLegend').onclick = function() {
  log('\r\nFetching legend ...');
  var graphicUrl = wmsSource.getLegendUrl(resolution);
  fetch(graphicUrl, options) 
    .then(function(response) {
      log('response success');
      return response.blob();
    })
    .then(function(blob) {
      log('parsing blob() done');
      log(JSON.stringify(blob));
    })
    .catch(function(err) {
      log('error!' + JSON.stringify(err));
    });
};

/**
 * Fetch XML from an endpoint
 */
function fetchXml(url, noCors) {
  options.mode = noCors ? 'no-cors' : 'cors';
  log('\r\nFetching XML ' + options.mode + ' ...');
  fetch(url, options)
      .then(function (response) {
        log('response success');
        return response.text();
      })
      .then(function (text) {
        log('parsing text() done');
        log(text);
      })
      .catch(function (err) {
        log("ERROR: Something went wrong! " + JSON.stringify(err));
      })
  ;
}

function log(text) {
    var content = document.getElementById('log').innerText;
    content += content ? '\r\n' : '';
    content += text || '(empty)';
    document.getElementById('log').innerText = content;
}