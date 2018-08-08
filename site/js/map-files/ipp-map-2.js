//IPPS map two. Placed on the page titled "IPPs by Basin and Yield"
//id='mapbox3'
var ipp_map_02 = (function(){
	// Leaflet MapBox of IPPs by Basin and Yield
	var map = L.map('mapbox3', {scrollWheelZoom: false}).setView([40.112, -104.828], 9);

	var outdoors = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/tiles/256/{z}/{x}/{y}?access_token=' +
		'pk.eyJ1Ijoia3Jpc3RpbnN3YWltIiwiYSI6ImNpc3Rjcnl3bDAzYWMycHBlM2phbDJuMHoifQ.vrDCYwkTZsrA_0FffnzvBw', 
	{
		maxZoom: 18,
		attribution: 'Created by the <a href="http://openwaterfoundation.org">Open Water Foundation. </a>' + 
		'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
			'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="http://mapbox.com">Mapbox</a>',
		id: 'mapbox.outdoors'
	});

	outdoors.addTo(map);

	var satellite = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoia3Jpc3RpbnN3YWltIiwiYSI6ImNpc3Rjcnl3bDAzYWMycHBlM2phbDJuMHoifQ.vrDCYwkTZsrA_0FffnzvBw', {
		maxZoom: 18,
		attribution: 'Created by the <a href="http://openwaterfoundation.org">Open Water Foundation. </a>' + 
		'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
			'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="http://mapbox.com">Mapbox</a>',
		id: 'mapbox.satellite'
	});	

	var streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoia3Jpc3RpbnN3YWltIiwiYSI6ImNpc3Rjcnl3bDAzYWMycHBlM2phbDJuMHoifQ.vrDCYwkTZsrA_0FffnzvBw', {
		maxZoom: 18,
		attribution: 'Created by the <a href="http://openwaterfoundation.org">Open Water Foundation. </a>' + 
		'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
			'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="http://mapbox.com">Mapbox</a>',
		id: 'mapbox.streets'
	});

	var streetsatellite = L.tileLayer('https://api.mapbox.com/v4/mapbox.streets-satellite/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoia3Jpc3RpbnN3YWltIiwiYSI6ImNpc3Rjcnl3bDAzYWMycHBlM2phbDJuMHoifQ.vrDCYwkTZsrA_0FffnzvBw', {
		maxZoom: 18,
		attribution: 'Created by the <a href="http://openwaterfoundation.org">Open Water Foundation. </a>' + 
		'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
			'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="http://mapbox.com">Mapbox</a>',
		id: 'mapbox.streets-satellite'
	});

	// Add a scroll button to the map
    var scrollbutton = L.control({position: 'topleft'});
    scrollbutton.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'scrollbutton');
        div.innerHTML = "<image id='scrollbutton' src='images/mouse.svg' class='scrollbutton-tooltip'" +
                        " style='width:20px; cursor:pointer;' onclick='ipp_map_02.scrollButtonClickFunction()'></image>";
        return div;
    };
    scrollbutton.addTo(map);        
    function scrollButtonClick(){
        if (map.scrollWheelZoom.enabled()) {
            map.scrollWheelZoom.disable();
            var title = "Click to toggle mouse scroll wheel behavior.<br> [ x ] Mouse scroll pages forward/back. <br> [ &nbsp; ] Mouse scroll zooms map."
            mousetooltip.setContent(title)
        }
        else {
            map.scrollWheelZoom.enable();
            var title = "Click to toggle mouse scroll wheel behavior.<br> [ &nbsp; ] Mouse scroll pages forward/back. <br> [ x ] Mouse scroll zooms map."
            mousetooltip.setContent(title)
        }
    }

    var baseMaps = {
        "Outdoors": outdoors,
        "Satellite": satellite,
        "Streets": streets,
        "Streets & Satellite": streetsatellite
    }

	L.control.layers(baseMaps, null, {position:'topleft'}).addTo(map);	

	/* Bottom Right corner. This shows the current lat and long
	of the mouse cursor.
	'º' used for the degree character when the latitude and longitude of the
	cursor is dispalyed. */
	L.control.mousePosition({position: 'bottomleft',lngFormatter: function(num) {
			var direction = (num < 0) ? 'W' : 'E';
			var formatted = Math.abs(L.Util.formatNum(num, 6)) + 'º ' + direction;
			return formatted;
	},
	latFormatter: function(num) {
			var direction = (num < 0) ? 'S' : 'N';
			var formatted = Math.abs(L.Util.formatNum(num, 6)) + 'º ' + direction;
			return formatted;
	}}).addTo(map);
	/* Bottom Right corner. This shows the scale in km and miles of
	the map. */
	L.control.scale({position: 'bottomleft',imperial: true}).addTo(map);

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

    // Return function that need to be accessed by the DOM 
    return{
        scrollButtonClickFunction: scrollButtonClick,
        maplayer: map
    }

})();