const bmltTabbedMapJS = function ($) {

  "use strict";

  var DEBUG = false;
  var map = null;
  var circle = null;
  var markerClusterer = null;
  var myLatLng;
  var searchZoom;
  var jsonQuery;
  var activeTab;

  var dayCounts = [0, 0, 0, 0, 0, 0, 0];

  var dayExpandLi = ["", "", "", "", "", "", "", ""];

  var sundayTabMarkerLayer = [];
  var mondayTabMarkerLayer = [];
  var tuesdayTabMarkerLayer = [];
  var wednesdayTabMarkerLayer = [];
  var thursdayTabMarkerLayer = [];
  var fridayTabMarkerLayer = [];
  var saturdayTabMarkerLayer = [];

  var openTable = "<thead><tr><th>Time</th><th>Meeting</th></tr></thead><tbody>";

  var closeTable = "</tbody></table></div>";

  var setupParams = function (overwritten_lat, overwritten_lng, overwritten_zoom) {
    if ((overwritten_lng == 0) && (overwritten_lat == 0) && (overwritten_zoom == 0)) {
      myLatLng = new L.latLng(js_vars.lat_js, js_vars.lng_js);
      searchZoom = js_vars.zoom_js;
    } else {
      myLatLng = new L.latLng(overwritten_lat, overwritten_lng);
      if ((overwritten_zoom > 17) || (overwritten_zoom < 7)) {
        overwritten_zoom = 12;
      }
      searchZoom = overwritten_zoom;
    }
  }

  var isEmpty = function (object) {
    for (var i in object) {
      return true;
    }
    return false;
  }

  var timeConvert = function (timeString) {
    var H = +timeString.substr(0, 2);
    var h = (H % 12) || 12;
    var ampm = H < 12 ? "am" : "pm";
    timeString = h + timeString.substr(2, 3) + ampm;
    return timeString;
  }

  var getMeetingFinishTime = function (startTime, durationTime) {

    var duration = durationTime.split(":");
    var start = startTime.split(":");

    var startHour = parseInt(start[0]);
    var startMin = parseInt(start[1]);
    var durationHour = parseInt(duration[0]);
    var durationMin = parseInt(duration[1]);
    var finishHour = 0;
    var finishMin = 0;

    finishMin = startMin + durationMin;
    if (finishMin >= 60) {
      finishHour = startHour + durationHour + 1;
      finishMin = finishMin - 60;
    } else {
      finishHour = startHour + durationHour;
    }

    if (finishHour > 24) {
      finishHour = finishHour - 24;
    }

    if (finishHour < 10) {
      finishHour = "0" + finishHour;
    }

    if (finishMin == 0) {
      finishMin = "00";
    }
    return finishHour + ":" + finishMin + ":00";
  }

  var newMap = function () {
    DEBUG && console && console.log("Running newMap()");
    map = L.map('map', {
      minZoom: 7,
      maxZoom: 17
    });
    map.spin(true);

    map.on('load', function (e) { // Fired when the map is initialized (when its center and zoom are set for the first time)

      map.on('moveend', function (e) {
        DEBUG && console && console.log("****map moveend event**** : ", e);
        runSearch();
      });

      DEBUG && console && console.log("****map load event**** : ", e);
      runSearch();
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    //     L.tileLayer('https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}{r}.png', {
    // 	attribution: '<a href="https://wikimediafoundation.org/wiki/Maps_Terms_of_Use">Wikimedia</a>'
    // }).addTo(map);

    map.setView(myLatLng, searchZoom);
    var lc = L.control.locate().addTo(map);
    //    lc.start();
    map.spin(false);

    $('#tabs li a').addClass('inactive');
    $('.bmlt_tabbed_map_table_container').hide();

    var mapLegend = L.control.htmllegend({
      position: 'bottomright',
      legends: [{
        name: 'Legend',
        elements: [{
          label: 'Single NA Meeting',
          html: '<img src=' + js_vars.plugin_folder + '/bmlt-tabbed-map/public/css/images/marker-icon-2x.png>',
          style: {
            'width': '12px',
            'height': '18px'
          }
        }, {
          label: 'Between 2 and 9 meetings',
          html: '',
          style: {
            'background-color': 'rgba(110, 204, 57, 0.8)',
            'width': '15px',
            'height': '15px',
            'border-radius': '50%'
          }
        }, {
          label: 'Between 10 and 99 meetings',
          html: '',
          style: {
            'background-color': 'rgba(240, 194, 12, 0.6)',
            'width': '15px',
            'height': '15px',
            'border-radius': '50%'
          }
        }, {
          label: 'Over 100 meetings',
          html: '',
          style: {
            'background-color': 'rgba(241, 128, 23, 0.6)',
            'width': '15px',
            'height': '15px',
            'border-radius': '50%'
          }
        }

        ]
      }],
      collapseSimple: true,
      detectStretched: true,
      collapsedOnInit: true
    })
    map.addControl(mapLegend);

  }

  var dayOfWeekAsString = function (dayIndex) {
    return ["not a day?", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][dayIndex];
  }

  var getMapCornerDistance = function () {
    var mapCornerDistance = (map.distance(map.getBounds().getNorthEast(), map.getBounds().getSouthWest()) / 1000) / 2;
    DEBUG && console && console.log("mapCornerDistance : ", mapCornerDistance);

    return mapCornerDistance;
  }

  var buildSearchURL = function () {
    var search_url = "https://aggregator.bmltenabled.org/main_server/client_interface/json/";
    search_url += "?switcher=GetSearchResults";
    search_url += "&geo_width_km=" + getMapCornerDistance();
    search_url += "&long_val=" + map.getCenter().lng;
    search_url += "&lat_val=" + map.getCenter().lat;
    search_url += "&sort_key=weekday_tinyint,start_time";
    // search_url += "&data_field_key=";
    // search_url += "weekday_tinyint, start_time, duration_time, ";
    // search_url += "meeting_name,location_text,location_info,location_street,location_city_subsection,";
    // search_url += "location_neighborhood,location_municipality,location_sub_province,location_province,";
    // search_url += "location_postal_code_1, location_nation, ";
    // search_url += "comments, phone_meeting_number, virtual_meeting_link, "
    // search_url += "latitude,longitude,formats";
    search_url += "&callingApp=bmlt_tabbed_map_wp_plugin";

    DEBUG && console && console.log("Search URL = " + search_url);

    return search_url;
  }

  var isMeetingOnMap = function (meeting) {
    var thisMeetingLocation = new L.LatLng(meeting.latitude, meeting.longitude);
    if (map.getBounds().contains(thisMeetingLocation)) {
      return true;
    } else {
      return false;
    }
  }

  var processSingleJSONMeetingResult = function (val) {
    if (isMeetingOnMap(val)) {
      var endTime = getMeetingFinishTime(val.start_time, val.duration_time);

      var listContent = "<tr><td><time>" + timeConvert(val.start_time) + "</time> - <time>" + timeConvert(endTime) + "</time>&nbsp;</td><td><br>";
      if (val.meeting_name != "NA Meeting") {
        listContent += "<b>" + val.meeting_name + "</b><br>";
      }
      if (val.location_text) {
        listContent += val.location_text + ",<br>";
      }
      if (val.location_street) {
        listContent += val.location_street + ", ";
      }
      if (val.location_info) {
        listContent += val.location_info + ", ";
      }
      if (val.location_city_subsection) {
        listContent += val.location_city_subsection + ", ";
      }
      if (val.location_neighborhood) {
        listContent += val.location_neighborhood + ", ";
      }
      if (val.location_municipality) {
        listContent += val.location_municipality + ", ";
      }
      if (val.location_sub_province) {
        listContent += val.location_sub_province + ", ";
      }
      if (val.location_province) {
        listContent += val.location_province;
      }
      if (val.formats) {
        listContent += "<br><i>Formats: </i>" + val.formats + "<br>";
      }
      if ((val.virtual_meeting_link) || (val.phone_meeting_number)) {
        if (val.virtual_meeting_additional_info) {
          listContent += '<br>' + val.virtual_meeting_additional_info;
        }
        if (val.virtual_meeting_link) {
          listContent += '<br><b><a href="';
          listContent += val.virtual_meeting_link;
          listContent += '"  target="_blank">Click to join <i class="fas fa-users"></i></a></b><br>';
        }
        if (val.phone_meeting_number) {
          listContent += '<br><b><a href="tel:';
          listContent += val.phone_meeting_number;
          listContent += '"  target="_blank">Click to call <i class="fas fa-phone"></i></a></b><br>';
        }
      } else {
        listContent += '<br><b><a href="https://www.google.com/maps/dir/?api=1&destination=';
        listContent += val.latitude + '%2C' + val.longitude;
        listContent += '"  target="_blank">Directions <i class="fas fa-map-signs"></i></a></b>';
      }
      listContent += " </td ></tr>";

      var markerContent = dayOfWeekAsString(val.weekday_tinyint) + " ";
      markerContent += listContent;

      var aMarker = L.marker([val.latitude, val.longitude], {});
      aMarker.bindPopup(markerContent, {
        autoPan: false,
        className: 'custom-popup'
      });

      switch (val.weekday_tinyint) {
        case "1":
          dayCounts[0]++;
          dayExpandLi[0] = dayExpandLi[0] + listContent;
          sundayTabMarkerLayer.push(aMarker);
          break;
        case "2":
          dayCounts[1]++;
          dayExpandLi[1] = dayExpandLi[1] + listContent;
          mondayTabMarkerLayer.push(aMarker);
          break;
        case "3":
          dayCounts[2]++;
          dayExpandLi[2] = dayExpandLi[2] + listContent;
          tuesdayTabMarkerLayer.push(aMarker);
          break;
        case "4":
          dayCounts[3]++;
          dayExpandLi[3] = dayExpandLi[3] + listContent;
          wednesdayTabMarkerLayer.push(aMarker);
          break;
        case "5":
          dayCounts[4]++;
          dayExpandLi[4] = dayExpandLi[4] + listContent;
          thursdayTabMarkerLayer.push(aMarker);
          break;
        case "6":
          dayCounts[5]++;
          dayExpandLi[5] = dayExpandLi[5] + listContent;
          fridayTabMarkerLayer.push(aMarker);
          break;
        case "7":
          dayCounts[6]++;
          dayExpandLi[6] = dayExpandLi[6] + listContent;
          saturdayTabMarkerLayer.push(aMarker);
          break;
      }
    }
  }

  var generateResultTable = function () {
    var result = "<div><div class='bmlt_tabbed_map_table_container' id='sundayTabTableContents'><table id='sundayTabTable' class='display compact'>";
    result += openTable;
    result += dayExpandLi[0];
    result += closeTable;

    result += "<div class='bmlt_tabbed_map_table_container' id='mondayTabTableContents'><table id='mondayTabTable' class='display compact'>";
    result += openTable;
    result += dayExpandLi[1];
    result += closeTable;

    result += "<div class='bmlt_tabbed_map_table_container' id='tuesdayTabTableContents'><table id='tuesdayTabTable' class='display compact'>";
    result += openTable;
    result += dayExpandLi[2];
    result += closeTable;

    result += "<div class='bmlt_tabbed_map_table_container' id='wednesdayTabTableContents'><table id='wednesdayTabTable' class='display compact'>";
    result += openTable;
    result += dayExpandLi[3];
    result += closeTable;

    result += "<div class='bmlt_tabbed_map_table_container' id='thursdayTabTableContents'><table id='thursdayTabTable' class='display compact'>";
    result += openTable;
    result += dayExpandLi[4];
    result += closeTable;

    result += "<div class='bmlt_tabbed_map_table_container' id='fridayTabTableContents'><table id='fridayTabTable' class='display compact' >";
    result += openTable;
    result += dayExpandLi[5];
    result += closeTable;

    result += "<div class='bmlt_tabbed_map_table_container' id='saturdayTabTableContents'><table id='saturdayTabTable' class='display compact'>";
    result += openTable;
    result += dayExpandLi[6];
    result += closeTable;

    result += "</div>";

    return result;
  }

  var resetSearch = function () {
    if (jsonQuery) {
      DEBUG && console && console.log("Delete old query...");
      map.spin(false);
      jsonQuery.abort();
    }

    if (markerClusterer) {
      map.removeLayer(markerClusterer);
    }

    if (map) {
      map.spin(true);
    }

    mondayTabMarkerLayer.length = tuesdayTabMarkerLayer.length = wednesdayTabMarkerLayer.length = thursdayTabMarkerLayer.length = fridayTabMarkerLayer.length = saturdayTabMarkerLayer.length = sundayTabMarkerLayer.length = 0;
    dayCounts.fill(0);
    dayExpandLi.fill("");
  }

  var runSearch = function () {
    DEBUG && console && console.log("**** runSearch()****");

    resetSearch();

    var search_url = buildSearchURL();

    jsonQuery = $.getJSON(search_url, function (data) {
      DEBUG && console && console.log("**** runSearch() -> getJSON");

      $("#list-results").empty();
      markerClusterer = new L.markerClusterGroup({
        showCoverageOnHover: false,
        removeOutsideVisibleBounds: false
      });

      if (!jQuery.isEmptyObject(data)) {
        $.each(data, function (key, val) {
          processSingleJSONMeetingResult(val);
        });
      }

      var result = generateResultTable();

      document.getElementById("list_result").innerHTML = result;

      $('#sundayTab').badge(dayCounts[0], 'top', true);
      $('#mondayTab').badge(dayCounts[1], 'top', true);
      $('#tuesdayTab').badge(dayCounts[2], 'top', true);
      $('#wednesdayTab').badge(dayCounts[3], 'top', true);
      $('#thursdayTab').badge(dayCounts[4], 'top', true);
      $('#fridayTab').badge(dayCounts[5], 'top', true);
      $('#saturdayTab').badge(dayCounts[6], 'top', true);

      markerClusterer.clearLayers();

      if (!activeTab) {
        DEBUG && console && console.log("!!! activeTab : ", activeTab);
        var today = new Date().getDay();
        DEBUG && console && console.log("Today is ", today);
        $('#tabs li a').eq(today).click();
      } else {
        DEBUG && console && console.log("Search was run, with no click event yet: ", activeTab);
        $("#tabs li a:not('.inactive')").click();
      }

      map.addLayer(markerClusterer);
      map.spin(false);

    });
  }

  var registerTabClickEvent = function () {
    $('#tabs li a').click(function () {
      activeTab = $(this).attr('id');
      DEBUG && console && console.log("Tab has been clicked: ", activeTab);

      if ($(this).hasClass('inactive')) {
        DEBUG && console && console.log("Tab was inactive: ", activeTab);
        $('#tabs li a').addClass('inactive');
        $(this).removeClass('inactive');
      }
      $('.bmlt_tabbed_map_table_container').hide();
      DEBUG && console && console.log("Fading in the tab: ", activeTab + 'TableContents');

      $('#' + activeTab + 'TableContents').fadeIn(100);

      markerClusterer.clearLayers();
      switch (activeTab) {
        case "sundayTab":
          markerClusterer.addLayers(sundayTabMarkerLayer);
          if (!$.fn.DataTable.isDataTable('#sundayTabTable')) {
            $('#sundayTabTable').DataTable({
              "ordering": false,
              "language": {
                "emptyTable": "No meetings in this map location on Sunday.  <a href=https://www.doihavethebmlt.org/?latitude=" + map.getCenter().lat + "&longitude=" + map.getCenter().lng + "><u>Is this area covered by the BMLT?</u></a>"
              },
              "columnDefs": [{
                "width": "20%",
                "targets": 0
              }]
            });
          }
          break;
        case "mondayTab":
          markerClusterer.addLayers(mondayTabMarkerLayer);
          if (!$.fn.DataTable.isDataTable('#mondayTabTable')) {
            $('#mondayTabTable').DataTable({
              "ordering": false,
              "language": {
                "emptyTable": "No meetings in this map location on Monday.  <a href=https://www.doihavethebmlt.org/?latitude=" + map.getCenter().lat + "&longitude=" + map.getCenter().lng + "><u>Is this area covered by the BMLT?</u></a>"
              },
              "columnDefs": [{
                "width": "20%",
                "targets": 0
              }]
            });
          }
          break;
        case "tuesdayTab":
          markerClusterer.addLayers(tuesdayTabMarkerLayer);
          if (!$.fn.DataTable.isDataTable('#tuesdayTabTable')) {
            $('#tuesdayTabTable').DataTable({
              "ordering": false,
              "language": {
                "emptyTable": "No meetings in this map location on Tuesday.  <a href=https://www.doihavethebmlt.org/?latitude=" + map.getCenter().lat + "&longitude=" + map.getCenter().lng + "><u>Is this area covered by the BMLT?</u></a>"
              },
              "columnDefs": [{
                "width": "20%",
                "targets": 0
              }]
            });
          }
          break;
        case "wednesdayTab":
          markerClusterer.addLayers(wednesdayTabMarkerLayer);
          if (!$.fn.DataTable.isDataTable('#wednesdayTabTable')) {
            $('#wednesdayTabTable').DataTable({
              "ordering": false,
              "language": {
                "emptyTable": "No meetings in this map location on Wednesday.  <a href=https://www.doihavethebmlt.org/?latitude=" + map.getCenter().lat + "&longitude=" + map.getCenter().lng + "><u>Is this area covered by the BMLT?</u></a>"
              },
              "columnDefs": [{
                "width": "20%",
                "targets": 0
              }]
            });
          }
          break;
        case "thursdayTab":
          markerClusterer.addLayers(thursdayTabMarkerLayer);
          if (!$.fn.DataTable.isDataTable('#thursdayTabTable')) {
            $('#thursdayTabTable').DataTable({
              "ordering": false,
              "language": {
                "emptyTable": "No meetings in this map location on Thursday.  <a href=https://www.doihavethebmlt.org/?latitude=" + map.getCenter().lat + "&longitude=" + map.getCenter().lng + "><u>Is this area covered by the BMLT?</u></a>"
              },
              "columnDefs": [{
                "width": "20%",
                "targets": 0
              }]
            });
          }
          break;
        case "fridayTab":
          markerClusterer.addLayers(fridayTabMarkerLayer);
          if (!$.fn.DataTable.isDataTable('#fridayTabTable')) {
            $('#fridayTabTable').DataTable({
              "ordering": false,
              "language": {
                "emptyTable": "No meetings in this map location on Friday.  <a href=https://www.doihavethebmlt.org/?latitude=" + map.getCenter().lat + "&longitude=" + map.getCenter().lng + "><u>Is this area covered by the BMLT?</u></a>"
              },
              "columnDefs": [{
                "width": "20%",
                "targets": 0
              }]
            });
          }
          break;
        case "saturdayTab":
          markerClusterer.addLayers(saturdayTabMarkerLayer);
          if (!$.fn.DataTable.isDataTable('#saturdayTabTable')) {
            $('#saturdayTabTable').DataTable({
              "ordering": false,
              "language": {
                "emptyTable": "No meetings in this map location on Saturday.  <a href=https://www.doihavethebmlt.org/?latitude=" + map.getCenter().lat + "&longitude=" + map.getCenter().lng + "><u>Is this area covered by the BMLT?</u></a>"
              },
              "columnDefs": [{
                "width": "20%",
                "targets": 0
              }]
            });
          }
          break;
      }
    });
  }

  return {
    doIt: function (overwritten_lng, overwritten_lat, overwritten_zoom) {
      setupParams(overwritten_lng, overwritten_lat, overwritten_zoom);
      registerTabClickEvent();
      newMap(overwritten_lng, overwritten_lat, overwritten_zoom);
    }
  };

}(jQuery);
