/**
 * Created by cranabahu on 12/31/14.
 */


gmap={
    map:null,
    directionsDisplay: null,
    directionsService: null,

    initialize:function() {
        directionsDisplay = new google.maps.DirectionsRenderer();
        var mapOptions = {
            zoom: 7,
            center: new google.maps.LatLng(7.2782568,80.6584244)
        };
        map = new google.maps.Map(document.getElementById('map-canvas'),
            mapOptions);
        directionsDisplay.setMap(map);
        directionsDisplay.setPanel(document.getElementById('directions-panel'));

        //var control = document.getElementById('control');
        //control.style.display = 'block';
        //map.controls[google.maps.ControlPosition.TOP_CENTER].push(control);
    },

    calcRoute:function(startLat,startLan,endLat,endLan) {
        directionsService = new google.maps.DirectionsService();
        var start = new google.maps.LatLng(startLat,startLan);
        var end = new google.maps.LatLng(endLat,endLan);
        var request = {
            origin: start,
            destination: end,
            travelMode: google.maps.TravelMode.DRIVING
        };
        directionsService.route(request, function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
            }
        });
    }
};