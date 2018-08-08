//Example IPP map two. Placed on the page titled "Example IPP: ACWWA Flow Project".
//id='mapbox6'
var example_ipp_map_02 = (function(){
	// Leaflet MapBox of ACWWA Flow Project
	var map = L.map('mapbox6', {scrollWheel: false}).setView([39.765, -104.798], 10);

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
						" style='width:20px; cursor:pointer;' onclick='example_ipp_map_02.scrollButtonClickFunction()'></image>";
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

    // Control that shows ACWWA Flow Project info on hover -- creates an info box
    var info = L.control();
    info.onAdd = function (map) {
      	this._div = L.DomUtil.create('div', 'info'); // Creates a div with a class named "info"
      	this.update();
      	return this._div;
    };
    // Method used to update the control based on feature properties passed
   	info.update = function (props) {
        if(props && props.Name){
          this._div.innerHTML = '<h5>ACWWA Flow Project</h5>' +  (props ?
            '' + '<b>Feature: </b>' + props.Name
            : 'Hover on a point, line or polygon');
        }
        else if(props && props.Reservoir_Name){
          this._div.innerHTML = '<h5>ACWWA Flow Project</h5>' +  (props ?
            '' + '<b>Feature: </b>' + props.Reservoir_Name
            : 'Hover on a point, line or polygon');
		}
		else if(props && props.lgname){
          this._div.innerHTML = '<h5>ACWWA Flow Project</h5>' +  (props ?
            '' + '<b>Feature: </b>' + props.lgname
            : 'Hover on a point, line or polygon');
		}
		else if(props && props.WTP_Name){
          this._div.innerHTML = '<h5>ACWWA Flow Project</h5>' +  (props ?
            '' + '<b>Feature: </b>' + props.WTP_Name
            : 'Hover on a point, line or polygon');	
        }			
        else{
          this._div.innerHTML = '<h5>ACWWA Flow Project</h5>' +  (props ?
            '' + '<b>Feature: </b>' + props.Pipeline_Name
            : 'Hover on a point, line or polygon');
        }
    		
    };
    info.addTo(map);
				
	// Add in ACWWA service area boundary
	var acwwaboundaryLayer = L.geoJson(acwwaboundary, {		
	  	color: 'red',
	  	weight: 2,
	  	opacity: 1,
	  	onEachFeature: onEachFeature
	}).addTo(map);
		
	// Add in ECCV service area boundary
	var eccvboundaryLayer = L.geoJson(eccvboundary, {		
	    color: 'blue',
		weight: 2,
		fillOpacity: 0,
		onEachFeature: onEachFeature
	}).addTo(map);	

	// Add in Northern Pipeline
	var pipelineLayer = L.geoJson(northernpipeline, {		
	    color: 'black',
	    weight: 2,
	    opacity: 1,
	    dashArray: '3',
	    onEachFeature: onEachFeature
	}).addTo(map);

	// Add in ECCV Water Treatment Plant
   	var eccvwtpLayer = L.geoJson(eccvwtp, {		
    	pointToLayer: function(feature, latlng) {	
    		return L.circleMarker(latlng, { 
				fillColor: 'green',
				color: 'green',
				weight: 1, 
				radius: 7,
				fillOpacity: 1 
			});
        },
		onEachFeature: onEachFeature		 
    }).addTo(map);

	// Add in Chambers Reservoir
    var chambersLayer = L.geoJson(chambers, {
     	pointToLayer: function(feature, latlng) {	
    		return L.circleMarker(latlng, { 
				fillColor: 'blue',
				color: 'blue',
				weight: 1, 
			 	radius: 12,
				fillOpacity: 0.8 
    		});
    	},
		onEachFeature: onEachFeature
    }).addTo(map);	
		
    map.attributionControl.addAttribution('Data &copy; Arapahoe County Water and Wastewater Authority');	

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
		acwwaboundaryLayer.resetStyle(e.target);
		info.update();
	} 	
	
	function onEachFeature(feature, layer) {
		layer.on({
			mouseover: highlightFeature,
			mouseout: resetHighlight
		});
	}	

   	// Return function that need to be accessed by the DOM 
	return{
		scrollButtonClickFunction: scrollButtonClick,
		maplayer: map
	}

})();