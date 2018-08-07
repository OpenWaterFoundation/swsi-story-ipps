//Instream Flow map that is placed on the page "South Platte & Metro BIP and Environmental & Recreational IPPs"
//id='mapbox1'
var isf_map = (function(){
	// Leaflet Mapbox of decreed instream flow reaches
	var map = L.map('mapbox1').setView([39.612, -105.028], 8);

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

	var baseMaps = {
		"Outdoors": outdoors,
		"Satellite": satellite,
		"Streets": streets
	}
		
	L.control.layers(baseMaps).addTo(map);

	/* Bottom Right corner. This shows the current lat and long
	of the mouse cursor.
	'º' used for the degree character when the latitude and longitude of the
	cursor is dispalyed. */
	L.control.mousePosition({position: 'bottomright',lngFormatter: function(num) {
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
	L.control.scale({position: 'bottomright',imperial: true}).addTo(map);

	// Add in IBCC basin boundaries
	var basin = L.geoJson(basins, {
	  color: 'black',
	  weight: 1,
	  fillOpacity: 0
	}).addTo(map)

	// Control that shows IPP info on hover -- creates an info box
	var info = L.control();
	info.onAdd = function (map) {
		this._div = L.DomUtil.create('div', 'info'); // Creates a div with a class named "info"
		this.update();
		return this._div;
	};

	// Method used to update the control based on feature properties passed
	info.update = function (props) {
		this._div.innerHTML = '<h5>Instream Flow Right</h5>' +  (props ? '' + '<b>Stream: </b>' + props.Name + '<br/>' + 
			'<b>Miles of Stream: </b>' + props.MILES.toFixed(2) + '<br />' + '<b>ID: </b>' + props.ID : 'Hover on a stream segment');
	};
	info.addTo(map);

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
	
	// Reset the color after hovering over
	function resetHighlight(e) {
		isfLayer.resetStyle(e.target);
		info.update();
	} 	
	
	function onEachFeature(feature, layer) {
		layer.on({
			mouseover: highlightFeature,
			mouseout: resetHighlight
		});
	}

	// Create style for instream flow reaches
    var isfStyle = {
		color: 'blue',
		weight: 2,
		opacity: 1
	};

	// Add in instream flow layer			
	var isfLayer = L.geoJson(isf, {
      	style: isfStyle,
	  	onEachFeature: onEachFeature	  
	}).addTo(map)


	map.attributionControl.addAttribution("Data &copy; Colorado's Decision Support Systems");

	// Add a scroll button to the map
    var scrollbutton = L.control({position: 'topleft'});
    scrollbutton.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'scrollbutton');
        div.innerHTML = "<image id='scrollbutton' src='images/mouse.svg' class='scrollbutton-tooltip'" +
                        " style='width:20px; cursor:pointer;' onclick='isf_map.scrollButtonClickFunction()'></image>";
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

    // Return function that need to be accessed by the DOM 
    return{
        scrollButtonClickFunction: scrollButtonClick,
        maplayer: map
    }
})();