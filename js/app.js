'use strict'

//Model
var map;

var markers = [];

var clientID = 'JHJQ23XA1HX0ODEAUZRDXC3YLHSWMH45FTBA45H01031RMQ3';
//'OxfUCyWyBmScEzS5RWExCg';
var clientSecret = 'WCWRQTUIOED5Y23S3TCMDUVHSZIUWQMNPALN5FE4CX34G4U2';
//'r8tb-Bo8uQSOf9qLMYcAHjlPEK07XkbfWfu03PjSSqo9pKp0HRTBlFFQPJ3wXv1f8KkQlML65oXZmceNlSuuoriZyhZTC7XK4vXI6h1THCAzc6sxJGr3-qXo19DUWnYx';

function initMap(){
	var styles = [
		{elementType: 'geometry', stylers: [{colors: '#242f3e'}]},
		{elementType: 'labels.text.stroke', stylers: [{colors: '#242f3e'}]},
		{elementType: 'labels.text.fill', stylers: [{colors: '#746855'}]},
		{
			featureType: 'administrative.locality',
			elementType: 'labels.text.fill',
			stylers: [{color: '#d59563'}]
		},
		{
			featureType: 'landscape.natural',
			elementType: 'labels.text.fill',
			stylers: [{color: '#255f3e'}]
		},
		{
			featureType: 'poi.attraction',
			elementType: 'labels.text.fill',
			stylers: [{color: '#d59563'}]
		}
	]
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat:40.767499, lng:-73.833079},
		zoom: 13,
		styles: styles,
		mapTypeControl: false,
		zoomControl: true,
		zoomControlOptions: {
			position: google.maps.ControlPosition.LEFT_CENTER
		},
		streetViewControl: true,
		//this can be dragged across the map to get street view
		streetViewControlOptions: {
			position: google.maps.ControlPosition.LEFT_TOP
		}
	});
	var bounds = new google.maps.LatLngBounds();

	//create a labels variable
	var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	var labelIndex = 0;

	//create info window variable
	var largeInfowindow = new google.maps.InfoWindow();

	//Styling the markers
	var defaultIcon = makeMarkerIcon('0091ff');
	var highlightedIcon = makeMarkerIcon('FFFF24');
	for(var i = 0; i < locations.length; i++){
		var position = locations[i].location;
		var title = locations[i].title;
		var marker = new google.maps.Marker({
			position: position,
			title: title,
			animation: google.maps.Animation.DROP,
			label: labels[labelIndex++ % labels.length],
			icon: defaultIcon,
			id: i
		});

		markers.push(marker);
		marker.addListener('click', function(){
			populateInfoWindow(this, largeInfowindow);
		});

		marker.addListener('mouseover', function(){
			this.setIcon(highlightedIcon);
		});
		marker.addListener('mouseout', function(){
			this.setIcon(defaultIcon);
		});

		locations[i].marker = marker;

		marker.setMap(map);
		bounds.extend(marker.position);


	}
	map.fitBounds(bounds);

	ko.applyBindings(new ViewModel());
}

//Array of locations
var locations = [
	{title: "Spicy & Tasty", location: {lat: 40.7593180,lng: -73.8320170}},
	{title: "Little Sheep Mongolian", location: {lat: 40.7622730,lng: -73.8290410}},
	{title: "Joe's Shanghai", location: {lat: 40.7619080,lng: -73.8303750}},
	{title: "Lucia's Pizza", location: {lat: 40.7602830,lng: -73.8281540}},
	{title: "Hahm Ji Bach", location: {lat: 40.7631030,lng: -73.8149240}},
	{title: "Kimganae Korean Restaurant", location: {lat: 40.7607320,lng: -73.8268920}},
	{title: "PappaRich", location: {lat: 40.7595570,lng: -73.8323920}}
];

function populateInfoWindow(marker, infowindow){
	if(infowindow.marker != marker){
		infowindow.marker = marker;
		
		//FourSquare Api
		//the ll in the link refers to the latitude and longitude
		var fsquare = 'https://api.foursquare.com/v2/venues/search?ll=' + marker.position.lat() + ',' + marker.position.lng() +'&client_id=' + clientID + '&client_secret=' + clientSecret + '&v=20180422';
		
		$.getJSON(fsquare, function(data){
			var fsqResponse = data.response.venues[0];
			var fsquare = 'https://foursquare.com/v/' + fsqResponse.id;
		
		//infowindow contains content derived from FourSquare API
		infowindow.setContent('<div>' +marker.title+ '<div><strong>FourSquare Link: </strong>' + '<a href="' + fsquare + '">' + fsqResponse.name + '</a></div>' +
			'<div><strong>Address: </strong>' + fsqResponse.location.formattedAddress + '</div></div>');
		infowindow.open(map, marker);
	})
		infowindow.addListener('closeclick', function(){
			infowindow.marker = null;
		});
		
		
	}
}



function makeMarkerIcon(markerColor){
		var markerImage = new google.maps.MarkerImage(
			'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
		'|40|_|%E2%80%A2',
		new google.maps.Size(21, 34),
		new google.maps.Point(0,0),
		new google.maps.Point(10,34),
		new google.maps.Size(21,34)
		);
		return markerImage;
	}
var Places = function(data){
	this.title = ko.observable(data.title);
	this.lat = ko.observable(data.location.lat);
	this.lng = ko.observable(data.location.lng);
	this.marker = ko.observable(data.marker);
};


//ViewModel: what the user interacts with
var ViewModel = function(){
	var self = this;

	this.eateries = ko.observableArray([]);

	locations.forEach(function(eateryItem){
		self.eateries.push(new Places(eateryItem));
	});
	//this trigger with select the clicked location on the map
	this.clickLocation = function(clickedData){
		var clickedMarker = clickedData.marker();
		google.maps.event.trigger(clickedMarker, 'click');
	};

	this.textVals = ko.observable("");
	//this filters the list according to the user input
	this.filterList = ko.computed(function(){
		if(self.textVals !== ""){
			var newString = self.textVals();
			self.eateries.removeAll();
			locations.forEach(function(eateryItem){
				eateryItem.marker.setMap(null);
				if(eateryItem.title.includes(newString)){
					self.eateries.push(new Places(eateryItem));
					eateryItem.marker.setMap(map);
				}
			})
		}
	}, this);
};

