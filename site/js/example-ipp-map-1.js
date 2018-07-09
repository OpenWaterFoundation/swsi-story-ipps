//Example IPP map one. Placed on the page titled "Example IPP: NISP".
//id='mapbox5'
(function(){
	// Leaflet MapBox of NISP
	var map = L.map('mapbox5').setView([40.312, -104.528], 9);

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

})();