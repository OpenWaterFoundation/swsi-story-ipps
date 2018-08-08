//IPPS map three. Placed on the page titled "IPPs by Basin and Cost".
//id = 'mapbox4'
var ipp_map_03 = (function(){
	// Leaflet MapBox of IPPs by Basin and Cost
	var map = L.map('mapbox4', {scrollWheelZoom: false}).setView([40.112, -104.828], 9);

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
                        " style='width:20px; cursor:pointer;' onclick='ipp_map_03.scrollButtonClickFunction()'></image>";
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

	// Add function that converts "Estimated_Cost" to dollars, with commas
	Number.prototype.formatMoney = function(c, d, t){
        var n = this, 
        c = isNaN(c = Math.abs(c)) ? 2 : c, 
        d = d == undefined ? "." : d, 
        t = t == undefined ? "," : t, 
        s = n < 0 ? "-" : "", 
        i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))), 
        j = (j = i.length) > 3 ? j % 3 : 0;
       return s + '$' + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + 
       			(c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
    };
				
  	// Control that shows IPP info on hover -- creates an info box
	var info = L.control();
	info.onAdd = function (map) {
		this._div = L.DomUtil.create('div', 'info'); // Creates a div with a class named "info"
		this.update();
		return this._div;
	};
  	// Method used to update the control based on feature properties passed
	info.update = function (props) {
	       if(props){
           var estimatedCost = (props.Estimated_Cost) ? props.Estimated_Cost.formatMoney(0) : ""; 
           }
		this._div.innerHTML = '<h5>IPP</h5>' +  (props ?
			'' + '<b>Name: </b>' + props.IPP_Name + '<br/>' + '<b>Description: </b>' + props.IPP_Description + 
			'<br />' + '<b>IBCC Basin: </b>' + props.Basin + '<br />' + '<b>Estimated Cost: </b>' + estimatedCost
			: 'Hover on a point');
	    };
	info.addTo(map);
	
	var geoJson = L.geoJson(IPPs, {		
		pointToLayer: function(feature, latlng) {	
			return L.circleMarker(latlng, { 
				 fillColor: style(feature),
				 color: style(feature),
				 weight: 1, 
				 radius: sizebyCost(feature),
				 fillOpacity: 0.8 
			});
		},
		onEachFeature: onEachFeature
	}).addTo(map);
		
	map.attributionControl.addAttribution('Data &copy; SWSI2010');

	//HELPER FUNCTIONS:

	function getColor(point2){
		if (point2 === "South Platte") colorToUse = "blue";
	    else colorToUse = "orange";
	    return colorToUse;
	}

	function getSize(point2){
		if (point2 > 200000000)     sizeToCost = 16;
		else if (point2 > 100000000) sizeToCost = 14;
		else if (point2 > 25000000) sizeToCost = 10;
		else if (point2 > 10000000) sizeToCost = 8;
		else if (point2 > 1000000)  sizeToCost = 6;
		else sizeToCost = 4;
		
		return sizeToCost;
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
	   var point2 = feature.properties.Basin;
	   return getColor(point2);
	}

	// Create function of size based on cost
	function sizebyCost(feature) {
	  var point2 = feature.properties.Estimated_Cost;
	  return getSize(point2);
	}

    // Return function that need to be accessed by the DOM 
    return{
        scrollButtonClickFunction: scrollButtonClick,
        maplayer: map
    }

})();