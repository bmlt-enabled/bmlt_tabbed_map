var bmlt_tabbed_map_js = function($) {
  'use strict';

  var map;
  var meetingLatlng;
  var meetingMarker;
  var infowindow;
  var markers = [];
  var infowindows = [];
  var spinner;

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

  var hideAllMarkersOnMap = function() {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setVisible(false);
    }
  }

  var buildJSONUrl = function() {
    var search_url = js_vars.bmlt_server;
    search_url += "client_interface/json/";
    search_url += "?switcher=GetSearchResults";
    //    search_url += "&weekdays=1";
    search_url += "&data_field_key=weekday_tinyint,start_time,duration_time,formats,longitude,latitude,meeting_name,location_text,location_info,location_street,location_city_subsection,location_neighborhood,location_municipality,location_sub_province,location_province,location_postal_code_1,location_nation,comments,train_lines,bus_lines"
    search_url += "&get_used_formats";
    return search_url;
  }

  var buildTableRow = function(val) {

    var textContent = "<tr>";
    textContent += "<td><time datetime='" + val.start_time.substring(0, 5) + "'>" + val.start_time.substring(0, 5) + "</time></td>";
    textContent += "<td>";
    if (val.meeting_name != "NA Meeting") {
      textContent += "<b>" + val.meeting_name + "</b><br> ";
    }
    textContent += "<b><i>Address: </i></b>" + val.location_text + "&nbsp;" + val.location_street + "<br>";
    if (val.location_info != "") {
      textContent += "<i>" + val.location_info + "</i><br>";
    }
    if (val.formats != "") {
      textContent += "<b><i>Formats: </i></b>" + val.formats + "<br>";
    }
    textContent += '<b><i>Directions: </i></b><a class="direct" href="https://maps.google.com/maps?daddr=';
    textContent += val.latitude + ',' + val.longitude;
    textContent += '">&nbsp;&nbsp&#10166;</a></li></td>';
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
  }

  var buildMarkerContent = function(val) {

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
    var meetingMarker = new google.maps.Marker({
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

    return meetingMarker;
  }

  var buildDayTablesHeader = function() {

    var tableHeader = "<table id='sat_table_id' class='display'><thead><tr><th>Time</th><th>Meeting</th></tr></thead><tbody>";
    SunExpandLi = MonExpandLi = TueExpandLi = WedExpandLi = ThuExpandLi = FriExpandLi = SatExpandLi = tableHeader;
  }

  var buildDayTablesFooter = function() {

    var tableFooter = "</tbody></table>";
    SunExpandLi += tableFooter;
    MonExpandLi += tableFooter;
    TueExpandLi += tableFooter;
    WedExpandLi += tableFooter;
    ThuExpandLi += tableFooter;
    FriExpandLi += tableFooter;
    SatExpandLi += tableFooter;

  }

  var activateTabs = function() {
    $("#tabs").tabs({
      activate: function(event, ui) {
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

    $('table.display').DataTable({
      "columns": [
        null,
        {
          "orderable": false
        }
      ]
    });

    var today = new Date().getDay();
    $('#tabs').tabs("option", "active", today || 7);
    showDayOnMap(dayOfWeekAsString(today + 1));

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

    google.maps.event.addListenerOnce(map, 'tilesloaded', function() {
      var oms = new OverlappingMarkerSpiderfier(map, {
        circleSpiralSwitchover: 15,
        markersWontMove: true,
        markersWontHide: true
      });

      var search_url = buildJSONUrl();

      $.getJSON(search_url, function(data) {

        buildDayTablesHeader();

        if (!jQuery.isEmptyObject(data.meetings)) {
          $.each(data.meetings, function(key, val) {
            buildTableRow(val);
            meetingMarker = buildMarkerContent(val);
            markers.push(meetingMarker);
            oms.addMarker(meetingMarker);
          });
        }

        buildDayTablesFooter();
        populateTextTabs();
        activateTabs();
        spinner.stop();
        document.getElementById('meeting-loader').style.display = "none";
      });
    });

  }

  $(window).load(function() {
    var target = document.getElementById('tabs');
    spinner = new Spinner().spin(target);
    initialize();
  });


}(jQuery);
