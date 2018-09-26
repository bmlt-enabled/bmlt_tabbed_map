var bmlt_tabbed_map_js = function($) {
  'use strict';

  var map;
  var meetingLatlng;
  var meetingMarker;
  var infowindow;
  var markers = [];
  var infowindows = [];

  var SunExpandLi = "";
  var MonExpandLi = "";
  var TueExpandLi = "";
  var WedExpandLi = "";
  var ThuExpandLi = "";
  var FriExpandLi = "";
  var satExpandLi = "";

  var dayOfWeekAsString = function(dayIndex) {
    return ["not a day?", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][dayIndex];
  }

  var closeInfoWindows = function() {
    var i = infowindows.length;
    while (i--) {
      infowindows[i].close();
    }
  }

  var toggleDay = function(box, day) {
    console.log("box, day = " + box + day);
    closeInfoWindows();
    var idToAdd = day + "Result";
    if (box.checked) {
      show(day);
      console.log("idToAdd = [" + idToAdd + "]");
      switch (day) {
        case "Sun":
          document.getElementById(idToAdd).innerHTML = SunExpandLi;
          break;
        case "Mon":
          document.getElementById(idToAdd).innerHTML = MonExpandLi;
          break;
        case "Tue":
          document.getElementById(idToAdd).innerHTML = TueExpandLi;
          break;
        case "Wed":
          document.getElementById(idToAdd).innerHTML = WedExpandLi;
          break;
        case "Thu":
          document.getElementById(idToAdd).innerHTML = ThuExpandLi;
          break;
        case "Fri":
          document.getElementById(idToAdd).innerHTML = FriExpandLi;
          break;
        case "Sat":
          document.getElementById(idToAdd).innerHTML = satExpandLi;
          break;
      }
    } else {
      hide(day);
      document.getElementById(idToAdd).innerHTML = "";
    }
  }

  var show = function(day) {
    closeInfoWindows();
    for (var i = 0; i < markers.length; i++) {
      if (markers[i].myday == day) {
        markers[i].setVisible(true);
      }
    }
  }

  var hide = function(day) {
    for (var i = 0; i < markers.length; i++) {
      if (markers[i].myday == day) {
        markers[i].setVisible(false);
      }
    }
  }

  var hideAll = function() {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setVisible(false);
    }
  }

  var showAll = function() {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setVisible(true);
    }
  }

  var initialize = function() {
    console.log("Start of initialize");
    var mapOptions = {
      zoom: 7,
      center: new google.maps.LatLng(53, -6.7),
      panControl: true,
      zoomControl: true,
      scaleControl: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    // This function runs the query to the BMLT and displays the results on the map
    google.maps.event.addListenerOnce(map, 'tilesloaded', function() {
      var oms = new OverlappingMarkerSpiderfier(map, {
        circleSpiralSwitchover: 15,
        markersWontMove: true,
        markersWontHide: true
      });
      // This function converts a number to a day of the week
      function dayOfWeekAsString(dayIndex) {
        return ["not a day?", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][dayIndex];
      }
      var raw_meeting_json = false;
      var DEBUG = true;

      console.log("****Running buildSearchURL()****");
      var search_url = "https://www.nasouth.ie/bmlt/main_server/client_interface/json/";
      search_url += "?switcher=GetSearchResults";
      search_url += "&data_field_key=meeting_name,weekday_tinyint,start_time,location_text,location_street,location_info,location_sub_province,distance_in_km,latitude,longitude,formats";
      search_url += "&get_used_formats";
      console.log("Search URL = " + search_url);
      console.log("****Running runSearch()****");

      $.getJSON(search_url, function(data) {
        SunExpandLi = "<div class='search_results'><table style='width: 100%;'><caption>Sunday</caption><thead><tr><th style='width: 10%;'>Time</th><th style='width: 75%;'>Address</th><th style='width: 10%;'>Format</th><th style='width: 5%;'>Map</th></tr></thead><tbody>";
        MonExpandLi = "<div class='search_results'><table style='width: 100%;'><caption>Monday</caption><thead><tr><th style='width: 10%;'>Time</th><th style='width: 75%;'>Address</th><th style='width: 10%;'>Format</th><th style='width: 5%;'>Map</th></tr></thead><tbody>";
        TueExpandLi = "<div class='search_results'><table style='width: 100%;'><caption>Tuesday</caption><thead><tr><th style='width: 10%;'>Time</th><th style='width: 75%;'>Address</th><th style='width: 10%;'>Format</th><th style='width: 5%;'>Map</th></tr></thead><tbody>";
        WedExpandLi = "<div class='search_results'><table style='width: 100%;'><caption>Wednesday</caption><thead><tr><th style='width: 10%;'>Time</th><th style='width: 75%;'>Address</th><th style='width: 10%;'>Format</th><th style='width: 5%;'>Map</th></tr></thead><tbody>";
        ThuExpandLi = "<div class='search_results'><table style='width: 100%;'><caption>Thursday</caption><thead><tr><th style='width: 10%;'>Time</th><th style='width: 75%;'>Address</th><th style='width: 10%;'>Format</th><th style='width: 5%;'>Map</th></tr></thead><tbody>";
        FriExpandLi = "<div class='search_results'><table style='width: 100%;'><caption>Friday</caption><thead><tr><th style='width: 10%;'>Time</th><th style='width: 75%;'>Address</th><th style='width: 10%;'>Format</th><th style='width: 5%;'>Map</th></tr></thead><tbody>";
        satExpandLi = "<div class='search_results'><table style='width: 100%;'><caption>Saturday</caption><thead><tr><th style='width: 10%;'>Time</th><th style='width: 75%;'>Address</th><th style='width: 10%;'>Format</th><th style='width: 5%;'>Map</th></tr></thead><tbody>";

        if (!jQuery.isEmptyObject(data.meetings)) {
          DEBUG && console && console.log("**meetings with formats returned**");
          $.each(data.meetings, function(key, val) {

            var textContent = "<tr>";
            textContent += "<td><time datetime='" + val.start_time.substring(0, 5) + "'>" + val.start_time.substring(0, 5) + "</time></td>";
            textContent += "<td>";
            if (val.meeting_name != "NA Meeting") {
              textContent += "<b>" + val.meeting_name + "</b>, ";
            }
            textContent += val.location_text + "&nbsp;" + val.location_street + "<br>";
            textContent += "<i>" + val.location_info + "</i></td>";
            textContent += "<td><i>" + val.formats + "</i></td>";
            textContent += '<td><a href="https://maps.google.com/maps?daddr=';
            textContent += val.latitude + ',' + val.longitude;
            textContent += '"><img src="https://www.na-ireland.org/js/map.png"></a></li></td>';
            textContent += "</tr>";
            switch (val.weekday_tinyint) {
              case "1":
                SunExpandLi = SunExpandLi + textContent;
                break;
              case "2":
                MonExpandLi = MonExpandLi + textContent;
                break;
              case "3":
                TueExpandLi = TueExpandLi + textContent;
                break;
              case "4":
                WedExpandLi = WedExpandLi + textContent;
                break;
              case "5":
                ThuExpandLi = ThuExpandLi + textContent;
                break;
              case "6":
                FriExpandLi = FriExpandLi + textContent;
                break;
              case "7":
                satExpandLi = satExpandLi + textContent;
                break;
            }

            var markerContent = "<strong>" + dayOfWeekAsString(val.weekday_tinyint);
            markerContent += " <time datetime='" + val.start_time.substring(0, 5) + "'>";
            markerContent += val.start_time.substring(0, 5) + "</time></strong>&nbsp;&nbsp;";
            if (val.meeting_name != "NA Meeting") {
              markerContent += "<b>" + val.meeting_name + "</b><br> ";
            } else {
              markerContent += "<br> ";
            }
            if (val.location_text != "") {
              markerContent += val.location_text + ", ";
            }
            markerContent += val.location_street + "<br>";
            if (val.location_info != "") {
              markerContent += "<i>" + val.location_info + "</i><br>";
            }
            if (val.formats != "") {
              markerContent += "<i>Format: " + val.formats + "</i><br>";
            }
            markerContent += '<a href="https://maps.google.com/maps?daddr=';
            markerContent += val.latitude + ',' + val.longitude;
            markerContent += '">Directions</a>';

            meetingLatlng = new google.maps.LatLng(val.latitude, val.longitude);

            meetingMarker = new google.maps.Marker({
              position: meetingLatlng,
              title: val.meeting_name,
              map: map,
              icon: 'https://na-ireland.org/js/marker-na.png'
            });
            meetingMarker.myday = dayOfWeekAsString(val.weekday_tinyint);

            google.maps.event.addListener(meetingMarker, 'click', (function(meetingMarker, markerContent, infowindow) {
              return function() {
                closeInfoWindows();
                infowindow = new google.maps.InfoWindow();
                infowindow.setContent(markerContent);
                infowindow.open(map, meetingMarker);
                infowindows.push(infowindow);
              };
            })(meetingMarker, markerContent, infowindow));

            markers.push(meetingMarker);
            oms.addMarker(meetingMarker);
          });
        }

        SunExpandLi += "</tbody></table></div>";
        MonExpandLi += "</tbody></table></div>";
        TueExpandLi += "</tbody></table></div>";
        WedExpandLi += "</tbody></table></div>";
        ThuExpandLi += "</tbody></table></div>";
        FriExpandLi += "</tbody></table></div>";
        satExpandLi += "</tbody></table></div>";
        hideAll();

        $("div#map-controls").show();
        $("div#map-loader").hide();
      });
    });

  }

  $(window).load(function() {

    var target = document.getElementById('test-results');
    $("div#map-controls").hide();
    $("div#map-loader").show();
    console.log("??????");
    initialize();
  });

  // Expose one public method to be called from the html page
  return {
    toggleDay: function(box, day) {
      toggleDay(box, day);
    }
  };

}(jQuery);
