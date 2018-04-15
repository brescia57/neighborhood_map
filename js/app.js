//Model
var map;

var markers = [];

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
	map= new google.maps.Map(document.getElementById('map'), {
		center: {lat:40.767499, lng:-73.833079},
		zoom: 13,
		styles: styles,
		mapTypeControl: false
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
	}
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




var Places = function(data){
	this.title = ko.observable(data.title);
	this.lat = ko.observable(data.location.lat);
	this.lng = ko.observable(data.location.lng);
	this.marker = ko.observable(data.marker);
};
//ViewModel: what the user interacts with
var ViewModel = function(){
	var self = this;

	

	

	

	

	this.showFood = document.getElementById('show-food');
	this.hideFood = document.getElementById('hide-food');

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

	self.showFood = function(spotsItem){
		var bounds = new google.maps.LatLngBounds();
		for(var i = 0; i < markers.length; i++){
			markers[i].setMap(map);
			bounds.extend(markers[i].position);
		}
		map.fitBounds(bounds);
	}

}


//*var Spots = function(data){
//	this.name = ko.observable(data.title);
//	this.lat = ko.observable(data.lat);
//	this.lng = ko.observable(data.lng);
//	this.marker = ko.observable('');
//	this.showFood = ko.observable('');
//	this.hideFood = ko.observable(''); 

//}