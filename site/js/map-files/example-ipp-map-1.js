//Example IPP map one. Placed on the page titled "Example IPP: NISP".
//id='mapbox5'
var example_ipp_map_01 = (function(){
	// Leaflet MapBox of NISP
	var map = L.map('mapbox5', {scrollWheelZoom:false}).setView([40.312, -104.528], 9);

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

	// Add a scroll button to the map
	var scrollbutton = L.control({position: 'topleft'});
	scrollbutton.onAdd = function (map) {
		var div = L.DomUtil.create('div', 'scrollbutton');
		div.innerHTML = "<image id='scrollbutton' src='images/mouse.svg' class='scrollbutton-tooltip'" +
						" style='width:20px; cursor:pointer;' onclick='example_ipp_map_01.scrollButtonClickFunction()'></image>";
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
		"Streets": streets
	}
		
	L.control.layers(null, baseMaps, {position: 'topleft'}).addTo(map);

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

  	// Add Northern Water boundary to map
   	ncwcd = L.geoJson(ncwcd, {
      	color: 'black',
      	weight: 2,
      	fillOpacity: 0
   	}).addTo(map)
		
   	// Control that shows NISP info on hover -- creates an info box
  	var info = L.control();
  	info.onAdd = function (map) {
  		this._div = L.DomUtil.create('div', 'info'); // Creates a div with a class named "info"
  		this.update();
  		return this._div;
  	};
    // Method used to update the control based on feature properties passed
	info.update = function (props) {
	    if(props && props.WaterProviderName){
	      this._div.innerHTML = '<h5>NISP Project Feature</h5>' +  (props ?
	        '' + '<b>Water Provider: </b>' + props.WaterProviderName + '<br/>' + '<b>Participant Yield (acre-feet): </b>' + 
	        props.Permitted_Yield.toLocaleString() : 'Hover on a point or line');
	    }
	    else if(props && props.Capacity){
	      this._div.innerHTML = '<h5>NISP Project Feature</h5>' +  (props ?
	        '' + '<b>Name: </b>' + props.Reservoir + '<br/>' + '<b>Capacity (acre-feet): </b>' + props.Capacity.toLocaleString() 
	        : 'Hover on a point or line');
	    }
		else{
	      this._div.innerHTML = '<h5>NISP Project Feature</h5>' +  (props ? '' + '<b>Name: </b>' + props.NAME 
	     	: 'Hover on a point or line');
	    }
			
	};
	info.addTo(map);
		
	// Add in NISP participants layer
    var nisppartiesLayer = L.geoJson(nispparties, {		
    	pointToLayer: function(feature, latlng) {	
    		return L.circleMarker(latlng, { 
    				 fillColor: 'red',
    				 color: 'red',
    				 weight: 1, 
    				 radius: 5,
    				 fillOpacity: 0.8 
    			});
    		},
    		onEachFeature: onEachFeature
    }).addTo(map);
		
	// Add in NISP reservoirs layer		
    var nispreservoirsLayer = L.geoJson(nispreservoirs, {		
    	pointToLayer: function(feature, latlng) {	
    		return L.circleMarker(latlng, { 
    				 fillColor: 'blue',
    				 color: 'blue',
    				 weight: 1, 
    				 radius: 15,
    				 fillOpacity: 0.8 
    			});
    		},
    		onEachFeature: onEachFeature
    }).addTo(map);		

	// Create line style for NISP canals
	var canalStyle = {
		color: 'purple',
		weight: 3,
		opacity: 1
	};
	 
	// Add in NISP canals layer		
	var nispcanalsLayer = L.geoJSON(nispcanals, {
		style: canalStyle,
      	onEachFeature: onEachFeature
	}).addTo(map);
		
    map.attributionControl.addAttribution('Data &copy; Northern Colorado Water Conservancy District');	

    //HELPER FUNCTIONS:

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
    	nisppartiesLayer.resetStyle(e.target);
    	info.update();
    } 	

   	// Return function that need to be accessed by the DOM 
	return{
		scrollButtonClickFunction: scrollButtonClick,
		maplayer: map
	}

})();