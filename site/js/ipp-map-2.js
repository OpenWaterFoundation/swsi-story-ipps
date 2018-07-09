//IPPS map two. Placed on the page titled "IPPs by Basin and Yield"
//id='mapbox3'
(function(){
	// Leaflet MapBox of IPPs by Basin and Yield
	var map = L.map('mapbox3').setView([40.112, -104.828], 9);

	L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/tiles/256/{z}/{x}/{y}?access_token=' +
		'pk.eyJ1Ijoia3Jpc3RpbnN3YWltIiwiYSI6ImNpc3Rjcnl3bDAzYWMycHBlM2phbDJuMHoifQ.vrDCYwkTZsrA_0FffnzvBw', 
	{
		maxZoom: 18,
		attribution: 'Created by the <a href="http://openwaterfoundation.org">Open Water Foundation. </a>' + 
		'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
			'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="http://mapbox.com">Mapbox</a>',
		id: 'mapbox.outdoors'
	}).addTo(map);		

  	// Add in IBCC basin boundaries
	var basin = L.geoJson(basins, {
	  color: 'black',
	  weight: 1,
	  fillOpacity: 0
	}).addTo(map);

	// Control that shows IPP info on hover -- creates an info box
	var info = L.control();
	info.onAdd = function (map) {
		this._div = L.DomUtil.create('div', 'info'); // Creates a div with a class named "info"
		this.update();
		return this._div;
	};
	// Method used to update the control based on feature properties passed
	info.update = function (props) {
		var yield = '';
	    if(props){
           yield = (props.Yield) ? props.Yield.toLocaleString() : ""; 
         }
		this._div.innerHTML = '<h5>IPP</h5>' +  (props ?
			'' + '<b>Name: </b>' + props.IPP_Name + '<br/>' + '<b>Description: </b>' + props.IPP_Description + 
			'<br />' + '<b>IBCC Basin: </b>' + props.Basin + '<br />' + '<b>Yield (acre-feet): </b>' + yield : 
			'Hover on a point');
	};
	info.addTo(map);
	
	var geoJson = L.geoJson(IPPs, {		
		pointToLayer: function(feature, latlng) {	
			return L.circleMarker(latlng, { 
				 fillColor: style(feature),
				 color: style(feature),
				 weight: 1, 
				 radius: sizebyYield(feature),
				 fillOpacity: 0.8 
			});
		},
		onEachFeature: onEachFeature
	}).addTo(map);
	
	map.attributionControl.addAttribution('Data &copy; SWSI2010');

	//HELPER FUNCTIONS:

	function getColor(point){
		if (point === "South Platte") colorToUse = "blue";
	    else colorToUse = "orange";

	    return colorToUse;
	}

	function getSize(point){
		if (point > 10000)     sizeToUse = 16;
		else if (point > 5000) sizeToUse = 14;
		else if (point > 3500) sizeToUse = 12;
		else if (point > 2000) sizeToUse = 10;
		else if (point > 1000)  sizeToUse = 8;
		else if (point > 500)  sizeToUse = 6;
		else sizeToUse = 4;
		
		return sizeToUse;
	}

	// Highlight a node when it is hovered over on the map
	function highlightFeature(e) {
		var layer = e.target;
		layer.setStyle({
			weight: 4,
			color: '#252525',
			dashArray: '',
			fillOpacity: 0.7
		});
		if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
			layer.bringToFront();
		}
		info.update(layer.feature.properties);
	}

	function onEachFeature(feature, layer) {
		layer.on({
			mouseover: highlightFeature,
			mouseout: resetHighlight
		});
	}
	
	// Reset the color after hovering over
	function resetHighlight(e) {
		geoJson.resetStyle(e.target);
		info.update();
	} 	

	// Create function of color based on basin
	function style(feature) {
	   var point = feature.properties.Basin;
	   return getColor(point);
	}

	// Create function of size based on yield
	function sizebyYield(feature) {
	    var point = feature.properties.Yield;
	    return getSize(point);
	}

})();