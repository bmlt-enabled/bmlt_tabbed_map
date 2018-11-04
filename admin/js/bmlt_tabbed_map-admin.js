const bmlt_tabbed_map_admin = function($) {

  "use strict";

  var DEBUG = true;
  // Dont forget to comment all of this
  var map = null;
  var searchZoom = js_vars.zoom_js;
  var myLatLng = new L.latLng(js_vars.lat_js, js_vars.lng_js);

  var writeSettings = function() {

    DEBUG && console && console.log("Save settings here: ");
    var newZoom = map.getZoom();
    var newLat = map.getCenter().lat;
    var newLng = map.getCenter().lng;
    var nonce = js_vars.nextNonce;

    var zoomFeedback = "Zoom : " + newZoom;
    var latFeedback = "Latitude : " + newLat;
    var lngFeedback = "Longitude : " + newLng;

    $("#zoom").html(zoomFeedback);
    $("#latitude").html(latFeedback);
    $("#longitude").html(lngFeedback);

    DEBUG && console && console.log("New lat  = : ", newLat);
    DEBUG && console && console.log("New lng  = : ", newLng);
    DEBUG && console && console.log("New Zoom = : ", newZoom);

    var sendDataToWP = {
      action: 'receive_new_settings',
      zoomPosition: newZoom,
      latPosition: newLat,
      lngPosition: newLng,
      nextNonce: nonce
    };


    $.post(ajaxurl, sendDataToWP, function(response) {
        console.log('Got this from the server: ', response);
      })
      .done(function(response) {
        console.log("second success", response);
      })
      .fail(function(response) {
        console.log("error", response);
      })
      .always(function(response) {
        console.log("finished", response);
      });

  }

  return {
    showMap: function() {
      DEBUG && console && console.log("Running showMap()");
      map = L.map('map', {
        minZoom: 7,
        maxZoom: 17
      });

      map.on('load', function(e) { // Fired when the map is initialized (when its center and zoom are set for the first time)

        map.on('moveend', function(e) {
          DEBUG && console && console.log("****map moveend event**** : ", e);
          writeSettings();
        });

        DEBUG && console && console.log("****map load event**** : ", e);
        writeSettings();
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
      }).addTo(map);

      //     L.tileLayer('https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}{r}.png', {
      // 	attribution: '<a href="https://wikimediafoundation.org/wiki/Maps_Terms_of_Use">Wikimedia</a>'
      // }).addTo(map);

      map.setView(myLatLng, searchZoom);
      L.control.locate().addTo(map);
    }
  };

}(jQuery);
