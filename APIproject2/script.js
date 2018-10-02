let infowindow
      let map;
      let service
      let mapElement
      let autocompleteElement
      const markers = {};
      
      $(function () {
        mapElement = document.getElementById('map');
        autocompleteElement = document.getElementById('address');
        $('#submit').on('click', renderMap)
      })
      
      function initialize() {
        const autocomplete = new google.maps.places.Autocomplete(autocompleteElement, {
            types: ['(regions)'],
        });
      
        const myLocation = new google.maps.LatLng(32.8197125,-117.2010019);
      
        map = new google.maps.Map(mapElement, {
            center: myLocation,
            zoom: 12
        });
        infowindow = new google.maps.InfoWindow();
      }
     
      function renderMap() {
        $('.message').addClass("hidden");
        const address = $(autocompleteElement).val();
        let selLocLat;
        let selLocLng;
    
        let geocoder = new google.maps.Geocoder()
        geocoder.geocode({'address': address}, function(results, status) {
          if (status !== 'OK') {
             return alert('Geocode was not successful for the following reason: ' + status);
          }
            
          selLocLat = results[0].geometry.location.lat();
          selLocLng = results[0].geometry.location.lng();
          
    
          const myLocation = new google.maps.LatLng(selLocLat, selLocLng);
    
          map = new google.maps.Map(mapElement, {
            center: myLocation,
            zoom: 11
          });
    
          const request = {
            location: myLocation,
            keyword: 'coffee',
            openNow: true,
            fields: ['formatted_address', 'name', 'rating', 'opening_hours', 'geometry'],
            radius: '5000'
          };
    
          service = new google.maps.places.PlacesService(map);
          service.nearbySearch(request, callback);
        
        });
      }
     
      function callback(results, status) {
          for (let i = 0; i < results.length; i++) {
            let result = results[i]
            let request = {
              placeId: result.place_id,
              fields: ['place_id', 'opening_hours']
            };
            service.getDetails(request, function (result, details) {
              result.opening_hours = {}
              if (details && details.opening_hours) {
                result.opening_hours = details.opening_hours
              }
              createMarker(result, result.icon);
              $('.list').append(`<li>${listingHtml(result)}</li>`)
              
            }.bind(null, result));
          }
          $('.list h1').on('click', function (e) {
            const id = e.currentTarget.getAttribute('data-id')
            showMarker(id)
          })
      }
      
      function listingHtml(result) {
        let hours = ''
        let today = new Date().getDay()
        let opening_hours = result.opening_hours
        if (opening_hours && opening_hours.weekday_text && opening_hours.weekday_text[today - 1]) {
          hours = '<br /><span>' + result.opening_hours.weekday_text[today - 1] +'</span>'
        }
        return `
          <h1 data-id="${result.place_id}">${result.name}</h1>
          <p>${result.vicinity}${hours}</p>
        `
      }

      function createMarker(place, icon) {
          const placeLoc = place.geometry.location;
      
          const marker = new google.maps.Marker({
              map: map,
              position: place.geometry.location,
              icon: {
                  url: icon,
                  scaledSize: new google.maps.Size(20, 20) // pixels
              },
              animation: google.maps.Animation.DROP
          });
         
          google.maps.event.addListener(marker, 'click', function() {
            infowindow.setContent(listingHtml(place))
            infowindow.open(map, this);
          });
        
          markers[place.place_id] = marker;
      }
       
      function showMarker (index){
        google.maps.event.trigger(markers[index], 'click');
      }