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
  var SatExpandLi = "";

  var dayOfWeekAsString = function(dayIndex) {
    return ["not a day?", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][dayIndex];
  }

  var closeInfoWindows = function() {
    var i = infowindows.length;
    while (i--) {
      infowindows[i].close();
    }
  }

  var populateTextTabs = function() {
    const days = [{
        result: "SunResult",
        text: SunExpandLi
      },
      {
        result: "MonResult",
        text: MonExpandLi
      },
      {
        result: "TueResult",
        text: TueExpandLi
      },
      {
        result: "WedResult",
        text: WedExpandLi
      },
      {
        result: "ThuResult",
        text: ThuExpandLi
      },
      {
        result: "FriResult",
        text: FriExpandLi
      },
      {
        result: "SatResult",
        text: SatExpandLi
      }
    ]

    for (const s of days) {
      document.getElementById(s.result).innerHTML = s.text;
    }
  }

  var showDayOnMap = function(day) {
    closeInfoWindows();
    hideAllMarkersOnMap();
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

  var hideAllMarkersOnMap = function() {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setVisible(false);
    }
  }

  var initialize = function() {
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

      var search_url = "https://www.nasouth.ie/bmlt/main_server/client_interface/json/";
      search_url += "?switcher=GetSearchResults";
      search_url += "&data_field_key=meeting_name,weekday_tinyint,start_time,location_text,location_street,location_info,location_sub_province,distance_in_km,latitude,longitude,formats";
      search_url += "&get_used_formats";

      $.getJSON(search_url, function(data) {
        var tableHeader = "<div class='search_results'><table style='width: 100%;'><thead><tr><th style='width: 10%;'>Time</th><th style='width: 75%;'>Address</th><th style='width: 10%;'>Format</th><th style='width: 5%;'>Map</th></tr></thead><tbody>";
        SunExpandLi = MonExpandLi = TueExpandLi = WedExpandLi = ThuExpandLi = FriExpandLi = SatExpandLi = tableHeader;

        if (!jQuery.isEmptyObject(data.meetings)) {
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
            textContent += '"><img src="' + js_vars.image_path + 'map.png"></a></li></td>';
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
                SatExpandLi = SatExpandLi + textContent;
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

            var markerIcon = js_vars.image_path + 'marker-na.png';
            meetingMarker = new google.maps.Marker({
              position: meetingLatlng,
              title: val.meeting_name,
              map: map,
              icon: markerIcon
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

        var tableFooter = "</tbody></table></div>";
        SunExpandLi += tableFooter;
        MonExpandLi += tableFooter;
        TueExpandLi += tableFooter;
        WedExpandLi += tableFooter;
        ThuExpandLi += tableFooter;
        FriExpandLi += tableFooter;
        SatExpandLi += tableFooter;

        hideAllMarkersOnMap();
        showDayOnMap("Sun");
        populateTextTabs();

        $("div#meeting-loader").hide();
      });
    });

  }

  $(window).load(function() {
    $("div#meeting-loader").show();
    initialize();

    $("#tabs").tabs({
      beforeActivate: function(event, ui) {
        switch (ui.newPanel.attr('id')) {
          case "SunResult":
            showDayOnMap("Sun");
            break;
          case "MonResult":
            showDayOnMap("Mon");
            break;
          case "TueResult":
            showDayOnMap("Tue");
            break;
          case "WedResult":
            showDayOnMap("Wed");
            break;
          case "ThuResult":
            showDayOnMap("Thu");
            break;
          case "FriResult":
            showDayOnMap("Fri");
            break;
          case "SatResult":
            showDayOnMap("Sat");
            break;
        }
      }
    });

    //hover states on the static widgets
    $('#dialog_link, ul#icons li').hover(
      function() {
        $(this).addClass('ui-state-hover');
      },
      function() {
        $(this).removeClass('ui-state-hover');
      }
    );
  });


}(jQuery);
