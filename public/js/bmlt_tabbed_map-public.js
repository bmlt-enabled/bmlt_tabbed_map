const bmltTabbedMapJS = function($) {

  "use strict";

  var DEBUG = true;
  // Dont forget to comment all of this
  var map = null;
  var circle = null;
  var markerClusterer = null;
  var myLatLng = new L.latLng(js_vars.lat_js, js_vars.lng_js);
  var searchZoom = js_vars.zoom_js;
  var jsonQuery;
  var activeTab;
  var tabClicked = true;

  var sunCount = 0;
  var monCount = 0;
  var tueCount = 0;
  var wedCount = 0;
  var thuCount = 0;
  var friCount = 0;
  var satCount = 0;

  var sunExpandLi = "";
  var monExpandLi = "";
  var tueExpandLi = "";
  var wedExpandLi = "";
  var thuExpandLi = "";
  var friExpandLi = "";
  var satExpandLi = "";

  var sundayTabMarkerLayer = [];
  var mondayTabMarkerLayer = [];
  var tuesdayTabMarkerLayer = [];
  var wednesdayTabMarkerLayer = [];
  var thursdayTabMarkerLayer = [];
  var fridayTabMarkerLayer = [];
  var saturdayTabMarkerLayer = [];

  var openTable = "  <thead>";
  openTable += "   <tr>";
  openTable += "    <th>Time</th>";
  openTable += "    <th>Meeting</th>";
  openTable += "   </tr>";
  openTable += "  </thead>";
  openTable += "  <tbody>";

  var closeTable = "  </tbody></table></div>";

  var isEmpty = function(object) {
    for (var i in object) {
      return true;
    }
    return false;
  }

  var timeConvert = function(timeString) {
    var H = +timeString.substr(0, 2);
    var h = (H % 12) || 12;
    var ampm = H < 12 ? "am" : "pm";
    timeString = h + timeString.substr(2, 3) + ampm;
    return timeString;
  }

  var newMap = function() {
    DEBUG && console && console.log("Running newMap()");
    map = L.map('map', {
      minZoom: 7,
      maxZoom: 17
    });
    map.spin(true);

    map.on('load', function(e) { // Fired when the map is initialized (when its center and zoom are set for the first time)

      map.on('moveend', function(e) {
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
    L.control.locate().addTo(map);
    map.spin(false);

    $('#tabs li a').addClass('inactive');
    $('.container').hide();
  }

  var dayOfWeekAsString = function(dayIndex) {
    return ["not a day?", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][dayIndex];
  }

  var getMapCornerDistance = function() {
    var mapCornerDistance = (map.distance(map.getBounds().getNorthEast(), map.getBounds().getSouthWest()) / 1000) / 2;
    DEBUG && console && console.log("mapCornerDistance : ", mapCornerDistance);

    return mapCornerDistance;
  }

  var buildSearchURL = function() {
    var search_url = "https://tomato.na-bmlt.org/main_server/client_interface/json/";
    search_url += "?switcher=GetSearchResults";
    search_url += "&geo_width_km=" + getMapCornerDistance();
    search_url += "&long_val=" + map.getCenter().lng;
    search_url += "&lat_val=" + map.getCenter().lat;
    search_url += "&sort_key=weekday_tinyint,start_time";
    search_url += "&data_field_key=weekday_tinyint,start_time,";
    search_url += "meeting_name,location_text,location_info,location_street,location_city_subsection,location_neighborhood,location_municipality,location_sub_province,location_province,";
    search_url += "latitude,longitude,formats";
    search_url += "&callingApp=tomato_map_search";

    DEBUG && console && console.log("Search URL = " + search_url);

    return search_url;
  }

  var isMeetingOnMap = function(meeting) {
    var thisMeetingLocation = new L.LatLng(meeting.latitude, meeting.longitude);
    if (map.getBounds().contains(thisMeetingLocation)) {
      return true;
    } else {
      return false;
    }
  }

  var processSingleJSONMeetingResult = function(val) {
    if (isMeetingOnMap(val)) {

      var listContent = "<tr><td>" + timeConvert(val.start_time) + " " + dayOfWeekAsString(val.weekday_tinyint) + "</td><td>";
      if (val.meeting_name != "NA Meeting") {
        listContent += "<b>" + val.meeting_name + ", </b>";
      }
      if (val.location_text) {
        listContent += val.location_text + ", ";
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
        listContent += "<br><i>Formats: </i>" + val.formats;
      }
      listContent += '<br><a href="http://maps.google.com/maps?daddr=';
      listContent += val.latitude + ',' + val.longitude;
      listContent += '"  target="_blank">Directions </a></td>';
      listContent += "</tr>";

      var markerContent = dayOfWeekAsString(val.weekday_tinyint) + " ";
      markerContent += listContent;

      var aMarker = L.marker([val.latitude, val.longitude], {});
      aMarker.bindPopup(markerContent, {
        autoPan: false,
        className: 'custom-popup'
      });

      switch (val.weekday_tinyint) {
        case "1":
          sunCount++;
          sunExpandLi = sunExpandLi + listContent;
          sundayTabMarkerLayer.push(aMarker);
          break;
        case "2":
          monCount++;
          monExpandLi = monExpandLi + listContent;
          mondayTabMarkerLayer.push(aMarker);
          break;
        case "3":
          tueCount++;
          tueExpandLi = tueExpandLi + listContent;
          tuesdayTabMarkerLayer.push(aMarker);
          break;
        case "4":
          wedCount++;
          wedExpandLi = wedExpandLi + listContent;
          wednesdayTabMarkerLayer.push(aMarker);
          break;
        case "5":
          thuCount++;
          thuExpandLi = thuExpandLi + listContent;
          thursdayTabMarkerLayer.push(aMarker);
          break;
        case "6":
          friCount++;
          friExpandLi = friExpandLi + listContent;
          fridayTabMarkerLayer.push(aMarker);
          break;
        case "7":
          satCount++;
          satExpandLi = satExpandLi + listContent;
          saturdayTabMarkerLayer.push(aMarker);
          break;
      }
    }
  }

  var generateResultTable = function() {
    var result = "<div>";

    result += "<div class='container' id='sundayTabTableContents'>";
    result += "<table id='sundayTabTable'>";
    result += openTable;
    result += sunExpandLi;
    result += closeTable;

    result += "  <div class='container' id='mondayTabTableContents'>";
    result += "   <table id='mondayTabTable'>";
    result += openTable;
    result += monExpandLi;
    result += closeTable;

    result += "  <div class='container' id='tuesdayTabTableContents'>";
    result += "   <table id='tuesdayTabTable'>";
    result += openTable;
    result += tueExpandLi;
    result += closeTable;

    result += "  <div  class='container' id='wednesdayTabTableContents'>";
    result += "   <table id='wednesdayTabTable'>";
    result += openTable;
    result += wedExpandLi;
    result += closeTable;

    result += "  <div  class='container' id='thursdayTabTableContents'>";
    result += "   <table id='thursdayTabTable'>";
    result += openTable;
    result += thuExpandLi;
    result += closeTable;

    result += "  <div  class='container' id='fridayTabTableContents'>";
    result += "   <table id='fridayTabTable' >";
    result += openTable;
    result += friExpandLi;
    result += closeTable;

    result += "  <div  class='container' id='saturdayTabTableContents'>";
    result += "   <table id='saturdayTabTable'>";
    result += openTable;
    result += satExpandLi;
    result += closeTable;

    result += "</div>";

    return result;
  }

  var resetSearch = function() {
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
    sunCount = monCount = tueCount = wedCount = thuCount = friCount = satCount = 0;
    sunExpandLi = monExpandLi = tueExpandLi = wedExpandLi = thuExpandLi = friExpandLi = satExpandLi = "";
  }

  var runSearch = function() {
    DEBUG && console && console.log("**** runSearch()****");

    resetSearch();

    var search_url = buildSearchURL();

    jsonQuery = $.getJSON(search_url, function(data) {
      DEBUG && console && console.log("**** runSearch() -> getJSON");

      $("#list-results").empty();
      markerClusterer = new L.markerClusterGroup({
        showCoverageOnHover: false,
        removeOutsideVisibleBounds: false
      });

      if (!jQuery.isEmptyObject(data)) {
        $.each(data, function(key, val) {
          processSingleJSONMeetingResult(val);
        });
      }

      var result = generateResultTable();

      document.getElementById("list_result").innerHTML = result;
      document.getElementById("sunday-badge").innerHTML = sunCount;
      document.getElementById("monday-badge").innerHTML = monCount;
      document.getElementById("tuesday-badge").innerHTML = tueCount;
      document.getElementById("wednesday-badge").innerHTML = wedCount;
      document.getElementById("thursday-badge").innerHTML = thuCount;
      document.getElementById("friday-badge").innerHTML = friCount;
      document.getElementById("saturday-badge").innerHTML = satCount;

      markerClusterer.clearLayers();

      if (!activeTab) {
        DEBUG && console && console.log("!!! activeTab : ", activeTab);
        var today = new Date().getDay();
        DEBUG && console && console.log("Today is ", today);
        $('#tabs li a').eq(today).click();
      } else {
        DEBUG && console && console.log("Search was run, with ni click event yet: ", activeTab);
          $("#tabs li a:not('.inactive')").click();
      }

      map.addLayer(markerClusterer);
      map.spin(false);

    });
  }

  var registerTabClickEvent = function () {
    $('#tabs li a').click(function() {
      activeTab = $(this).attr('id');
      DEBUG && console && console.log("Tab has been clicked: ", activeTab);

      if ($(this).hasClass('inactive')) {
        DEBUG && console && console.log("Tab was inactive: ", activeTab);
        $('#tabs li a').addClass('inactive');
        $(this).removeClass('inactive');
      }
      $('.container').hide();
      DEBUG && console && console.log("Fading in the tab: ", activeTab + 'TableContents');

      $('#' + activeTab + 'TableContents').fadeIn('slow');

      markerClusterer.clearLayers();
      switch (activeTab) {
        case "sundayTab":    markerClusterer.addLayers(sundayTabMarkerLayer);    $('#sundayTabTable').DataTable();break;
        case "mondayTab":    markerClusterer.addLayers(mondayTabMarkerLayer);    $('#mondayTabTable').DataTable();break;
        case "tuesdayTab":   markerClusterer.addLayers(tuesdayTabMarkerLayer);   $('#tuesdayTabTable').DataTable();break;
        case "wednesdayTab": markerClusterer.addLayers(wednesdayTabMarkerLayer); $('#wednesdayTabTable').DataTable();break;
        case "thursdayTab":  markerClusterer.addLayers(thursdayTabMarkerLayer);  $('#thursdayTabTable').DataTable();break;
        case "fridayTab":    markerClusterer.addLayers(fridayTabMarkerLayer);    $('#fridayTabTable').DataTable();break;
        case "saturdayTab":  markerClusterer.addLayers(saturdayTabMarkerLayer);  $('#saturdayTabTable').DataTable(); break;
        }

    });
  }

  return {
    doIt: function() {
      registerTabClickEvent();
      newMap();
    }
  };

}(jQuery);
