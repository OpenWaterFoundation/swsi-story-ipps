//Example IPP map two. Placed on the page titled "Example IPP: ACWWA Flow Project".
//id='mapbox6'
(function(){
	// Leaflet MapBox of ACWWA Flow Project
	var map = L.map('mapbox6').setView([39.765, -104.798], 10);

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
})();