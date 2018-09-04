
    function initialize() {
        autocomplete = new google.maps.places.Autocomplete((document.getElementById('address')), {
            types: ['(regions)'],
        });

        var myLocation = new google.maps.LatLng(32.8197125,-117.2010019);

        map = new google.maps.Map(document.getElementById('map'), {
            center: myLocation,
            zoom: 12
        });
    }

    function renderMap()
    {
        var address = $('#address').val();
        var geocoder    = new google.maps.Geocoder();
        var selLocLat   = 0;
        var selLocLng   = 0;

        geocoder.geocode({'address': address}, function(results, status) {
            if (status === 'OK')
            {
                selLocLat   = results[0].geometry.location.lat();
                selLocLng   = results[0].geometry.location.lng();

                var myLocation = new google.maps.LatLng(selLocLat, selLocLng);

                map = new google.maps.Map(document.getElementById('map'), {
                    center: myLocation,
                    zoom: 11
                });

                var request = {
                    location: myLocation,
                    keyword: 'coffee|wifi',
                    openNow: true,
                    fields: ['photos', 'formatted_address', 'name', 'rating', 'opening_hours', 'geometry'],
                    radius: '5000'
                };

                infowindow = new google.maps.InfoWindow();

                var service = new google.maps.places.PlacesService(map);
                service.nearbySearch(request, callback);
            }
            else
            {
                alert('Geocode was not successful for the following reason: ' + status);
            }
        });
    }

    function callback(results, status)
    {
         console.log(results);
        if (status == google.maps.places.PlacesServiceStatus.OK)
        {
            for (var i = 0; i < results.length; i++)
            {
                createMarker(results[i], results[i].icon);
                $('.list').append(`
                    <h3 onclick="showMarker(${i})"

                    >${results[i].name}</h3>
                    <p>${results[i].vicinity}</p>`);
            }
            }

        }
var markers =[];
    function createMarker(place, icon) {
        var placeLoc = place.geometry.location;

        var marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location,
            icon: {
                url: icon,
                scaledSize: new google.maps.Size(20, 20) // pixels
            },
            animation: google.maps.Animation.DROP
        });
       
        google.maps.event.addListener(marker, 'click', function() {
            infowindow.setContent(place.name+ '<br>' +place.vicinity);
            infowindow.open(map, this);
        });
         markers.push(marker);
    }

function showMarker (index){
       console.log(markers);
         google.maps.event.trigger(markers[index], 'click');
            }