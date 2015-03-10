/**
* @fileoverview CASE STUDY 
* This script uses YUI2 namespace integrated with Google Map Api v3 and HTML5 Geolocation API.
* The coordinates of the user are tracked and the distance between the user's location and the destination is displayed.
* @Author Ronak Somani
* @version 1.0
**/

YAHOO.namespace("myapp.googlemap");

YAHOO.myapp.googlemap = function(){

    var map,marker,latLng,destLatLng,options,dst;
    var infoContainer = YAHOO.util.Dom.get('infoText');
    var directionsService = new google.maps.DirectionsService();
    var directionsDisplay = new google.maps.DirectionsRenderer();
    var listDest = YAHOO.util.Dom.get('listDestination');

    /**
    * @description 
    * 1. When the result for destination field is more than a single value,the results will be displayed in form of links.
    * 2. On click of the corresponding link,this function will be called.
    * @Private
    **/
    var _handleOptions = function(event){
	    var j;
        var tar = event.target || event.srcElement;
        var ulElementChildNodes=options.childNodes;
		
        for(j=0; j<ulElementChildNodes.length;j++){                     
            if(ulElementChildNodes[j]==tar.parentNode){
                YAHOO.util.Dom.replaceClass(listDest,'show','hide');
                YAHOO.util.Dom.get("inputDestination").value = tar.innerHTML;
                dst = tar.innerHTML;
                _setDirection(dst);
            }
        }
    };


    /**
    * @description 
    * To display the distance (driving route) between the user's location and the destination entered by the user.
    * @Private
    **/
    var _setDirection = function(dst){
        var request = {
                        origin: latLng, 
                        destination: dst,
                        travelMode: google.maps.DirectionsTravelMode.DRIVING
                    };
        directionsService.route(request, function(response, status){
                                                if (status == google.maps.DirectionsStatus.OK){
                                                    YAHOO.util.Dom.replaceClass(infoContainer,'show','hide');
													directionsDisplay.setDirections(response);
                                                }
                                                else{
												    infoContainer.innerHTML = 'Destination you have entered could not be located. Please try again';
													YAHOO.util.Dom.replaceClass(infoContainer,'hide','show');
                                                }
                                        });	
    };


    /**
    * @description 
    * 1. This function collects the information about the destination ,entered by the user.
    * 2. On entering the destination input field and clicking the 'get direction' button, this function will be called.
    * @Private
    **/
    var _getDirection = function(){
        options = YAHOO.util.Dom.get('listOptions');
        options.innerHTML = '';
		var geocoder = new google.maps.Geocoder();
		dst = YAHOO.util.Dom.get("inputDestination").value;
		geocoder.geocode({'address': dst}, function(results, status){
		                                        if (status == google.maps.GeocoderStatus.OK){
												    YAHOO.util.Dom.replaceClass(listDest,'show','hide');
													var len = results.length;
													if(len>1){
													    YAHOO.util.Event.addListener(options,'click',_handleOptions);
														for(i=0;i<len;i++){
														    var node = document.createElement("LI");
															var anchorLink = document.createElement("a");
															anchorLink.href = '#';
															var textnode=document.createTextNode(results[i].formatted_address);
															anchorLink.appendChild(textnode);
															node.appendChild(anchorLink);
															options.appendChild(node);
													    }
														YAHOO.util.Dom.replaceClass(listDest,'hide','show');
													}
													else{
													    _setDirection(dst);
													}
												}
												else{
												    infoContainer.innerHTML = 'Sorry, we could not find the direction for given destination.';
													YAHOO.util.Dom.replaceClass(infoContainer,'hide','show');
												}
						});				
    };


    /**
    * @description 
    * 1. This function recieves the coordinates of the user from the _getLocation function and sets it as center of the map.
    * 2. Through reverse geocoding, the information about the user's location is fetched and displayed in the field against 'your location'.
    * @Private
    **/
    var _showPosition = function(position){
        latLng =  new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        var revGeocoder = new google.maps.Geocoder();
        revGeocoder.geocode({'latLng': latLng}, function(results, status){
		                                                if (status == google.maps.GeocoderStatus.OK){
														    var srcLocation = YAHOO.util.Dom.get('srcLocation');
															srcLocation.innerHTML = results[0].formatted_address;
														}
														else{
														    infoContainer.innerHTML = 'Sorry, we could not locate your position.';
															YAHOO.util.Dom.replaceClass(listDest,'hide','show');
														}
						});
	
        var myOptions = {
                        zoom: 5,
						center: latLng,
						mapTypeId: google.maps.MapTypeId.ROADMAP
						};

        map = new google.maps.Map(YAHOO.util.Dom.get('mapContainer'), myOptions);
        directionsDisplay.setMap(map);
    };


    /**
    * @description 
    * This function handles the failure scenarios of the geolocation ajax call to the geolocation api.
    * @Private
    **/
    var _showError = function(error){
        if(error && error.message){
            infoContainer.innerHTML = error.message;
			YAHOO.util.Dom.replaceClass(infoContainer,'hide','show');
        }
    };

    /**
    * @description 
    * 1. This function uses html5 geolocation  to get the coordinates of the user's location.
    * 2. Through ajax call to geolocation api, the coordinates of the user are tracked.
    * 3. Incase the browser doesnot support html5 geolocation, message is shown to the user.
    * @Private
    **/
    var _getLocation = function(){
        if (navigator.geolocation){		
            YAHOO.util.Dom.replaceClass(infoContainer,'show','hide');
			navigator.geolocation.getCurrentPosition(_showPosition, _showError);
	    }
        else{
		    infoContainer.innerHTML = 'Geolocation is not supported by this browser.';
			YAHOO.util.Dom.replaceClass(infoContainer,'hide','show');
        }
    };

    YAHOO.util.Event.addListener('btn','click',_getDirection);
    _getLocation();
}();			