const bmlt_tabbed_map_js = function($) {

    "use strict";

    var DEBUG = true;
    // Dont forget to comment all of this
    var map = null;
    var circle = null;
    var markerClusterer = null;
    var myLatLng = new L.latLng(53.341318, -6.270205); // Irish Service Office
    var searchZoom = 10; // default to 10
    var jsonQuery;
    var activeTab;

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

    var sunMarkers = [];
    var monMarkers = [];
    var tueMarkers = [];
    var wedMarkers = [];
    var thuMarkers = [];
    var friMarkers = [];
    var satMarkers = [];

    var openTable = "  <thead>";
    openTable += "   <tr>";
    openTable += "    <th>Time</th>";
    openTable += "    <th>Meeting</th>";
    openTable += "   </tr>";
    openTable += "  </thead>";
    openTable += "  <tbody>";

    var closeTable = "  </tbody></table></div></div>";

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

      map.setView(myLatLng, 9);
      L.control.locate().addTo(map);
      map.spin(false);
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

        var listContent = "<tr><td>" + val.start_time.substring(0, 5) + "&nbsp;<i>(" +timeConvert(val.start_time) + ")</i>&nbsp;</td><td>";
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
            sunMarkers.push(aMarker);
            break;
          case "2":
            monCount++;
            monExpandLi = monExpandLi + listContent;
            monMarkers.push(aMarker);
            break;
          case "3":
            tueCount++;
            tueExpandLi = tueExpandLi + listContent;
            tueMarkers.push(aMarker);
            break;
          case "4":
            wedCount++;
            wedExpandLi = wedExpandLi + listContent;
            wedMarkers.push(aMarker);
            break;
          case "5":
            thuCount++;
            thuExpandLi = thuExpandLi + listContent;
            thuMarkers.push(aMarker);
            break;
          case "6":
            friCount++;
            friExpandLi = friExpandLi + listContent;
            friMarkers.push(aMarker);
            break;
          case "7":
            satCount++;
            satExpandLi = satExpandLi + listContent;
            satMarkers.push(aMarker);
            break;
        }
      }
    }

    var generateResultTable = function() {
      var result = "<div class='tab-content' id='myTabContent'>";

      result += "<div id='sunday' class='tab-pane fade show active' role='tabpanel' aria-labelledby='sunday-tab'>";
      result += "<div class='table-responsive'> <table id='sunday-table'  class='table table-bordered table-striped display'>";
      result += openTable;
      result += sunExpandLi;
      result += closeTable;

      result += "  <div id='monday' class='tab-pane fade' role='tabpanel' aria-labelledby='monday-tab'>";
      result += "   <div class='table-responsive'> <table id='monday-table'  class='table table-bordered table-striped display'>";
      result += openTable;
      result += monExpandLi;
      result += closeTable;

      result += "  <div id='tuesday' class='tab-pane fade' role='tabpanel' aria-labelledby='tuesday-tab'>";
      result += "   <div class='table-responsive'> <table id='tuesday-table'  class='table table-bordered table-striped display'>";
      result += openTable;
      result += tueExpandLi;
      result += closeTable;

      result += "  <div id='wednesday' class='tab-pane fade' role='tabpanel' aria-labelledby='wednesday-tab'>";
      result += "   <div class='table-responsive'> <table id='wednesday-table'  class='table table-bordered table-striped display'>";
      result += openTable;
      result += wedExpandLi;
      result += closeTable;

      result += "  <div id='thursday' class='tab-pane fade' role='tabpanel' aria-labelledby='thursday-tab'>";
      result += "   <div class='table-responsive'> <table id='thursday-table'  class='table table-bordered table-striped display'>";
      result += openTable;
      result += thuExpandLi;
      result += closeTable;

      result += "  <div id='friday' class='tab-pane fade' role='tabpanel' aria-labelledby='friday-tab'>";
      result += "   <div class='table-responsive'> <table id='friday-table'  class='table table-bordered table-striped display'>";
      result += openTable;
      result += friExpandLi;
      result += closeTable;

      result += "  <div id='saturday' class='tab-pane fade' role='tabpanel' aria-labelledby='saturday-tab'>";
      result += "   <div class='table-responsive'> <table id='saturday-table'  class='table table-bordered table-striped display'>";
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

      monMarkers.length = tueMarkers.length = wedMarkers.length = thuMarkers.length = friMarkers.length = satMarkers.length = sunMarkers.length = 0;
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

        DEBUG && console && console.log("activeTab : ", activeTab);

        switch (activeTab) {
          case "sunday-tab":
            markerClusterer.addLayers(sunMarkers);
            break;
          case "monday-tab":
            markerClusterer.addLayers(monMarkers);
            $('[href="#sunday"]').tab('show');
            $('[href="#monday"]').tab('show');
            break;
          case "tuesday-tab":
            markerClusterer.addLayers(tueMarkers);
            $('[href="#sunday"]').tab('show');
            $('[href="#tuesday"]').tab('show');
            break;
          case "wednesday-tab":
            markerClusterer.addLayers(wedMarkers);
            $('[href="#sunday"]').tab('show');
            $('[href="#wednesday"]').tab('show');
            break;
          case "thursday-tab":
            markerClusterer.addLayers(thuMarkers);
            $('[href="#sunday"]').tab('show');
            $('[href="#thursday"]').tab('show');
            break;
          case "friday-tab":
            markerClusterer.addLayers(friMarkers);
            $('[href="#sunday"]').tab('show');
            $('[href="#friday"]').tab('show');
            break;
          case "saturday-tab":
            markerClusterer.addLayers(satMarkers);
            $('[href="#sunday"]').tab('show');
            $('[href="#saturday"]').tab('show');
            break;
          default:
          // Set active tab to today
          var today = new Date().getDay();
          DEBUG && console && console.log("Today is :", today);
          switch (today) {
            case 0: $('[href="#sunday"]').tab('show');    activeTab="sunday-tab";    break;
            case 1: $('[href="#monday"]').tab('show');    activeTab="monday-tab";    break;
            case 2: $('[href="#tuesday"]').tab('show');   activeTab="tuesday-tab";   break;
            case 3: $('[href="#wednesday"]').tab('show'); activeTab="wednesday-tab"; break;
            case 4: $('[href="#thursday"]').tab('show');  activeTab="thursday-tab";  break;
            case 5: $('[href="#friday"]').tab('show');    activeTab="friday-tab";    break;
            case 6: $('[href="#saturday"]').tab('show');  activeTab="saturday-tab";  break;
          }
        }

        map.addLayer(markerClusterer);
        map.spin(false);

        $('#monday-table').DataTable();
        $('#tuesday-table').DataTable();
        $('#wednesday-table').DataTable();
        $('#thursday-table').DataTable();
        $('#friday-table').DataTable();
        $('#saturday-table').DataTable();
        $('#sunday-table').DataTable();

      });
    }

    $(document).ready(function() {
      $('#sunday-tab').on('shown.bs.tab', function(e) {
        DEBUG && console && console.log("#sunday-tab -> shown.bs.tab");
        DEBUG && console && console.log("activeTab : [", e.target.id, "]");
        activeTab = e.target.id;
        markerClusterer.clearLayers();
        markerClusterer.addLayers(sunMarkers);
      })
      $('#monday-tab').on('shown.bs.tab', function(e) {
        DEBUG && console && console.log("#monday-tab -> shown.bs.tab");
        DEBUG && console && console.log("activeTab : ", e.target.id);

        activeTab = e.target.id;
        markerClusterer.clearLayers();
        markerClusterer.addLayers(monMarkers);
      })
      $('#tuesday-tab').on('shown.bs.tab', function(e) {
        DEBUG && console && console.log("#tuesday-tab -> shown.bs.tab");
        DEBUG && console && console.log("activeTab : ", e.target.id);
        activeTab = e.target.id;
        markerClusterer.clearLayers();
        markerClusterer.addLayers(tueMarkers);
      })
      $('#wednesday-tab').on('shown.bs.tab', function(e) {
        DEBUG && console && console.log("#wednesday-tab -> shown.bs.tab");
        DEBUG && console && console.log("activeTab : ", e.target.id);
        activeTab = e.target.id;
        markerClusterer.clearLayers();
        markerClusterer.addLayers(wedMarkers);
      })
      $('#thursday-tab').on('shown.bs.tab', function(e) {
        DEBUG && console && console.log("#thursday-tab -> shown.bs.tab");
        DEBUG && console && console.log("activeTab : ", e.target.id);
        activeTab = e.target.id;
        markerClusterer.clearLayers();
        markerClusterer.addLayers(thuMarkers);
      })
      $('#friday-tab').on('shown.bs.tab', function(e) {
        DEBUG && console && console.log("#friday-tab -> shown.bs.tab");
        DEBUG && console && console.log("activeTab : ", e.target.id);
        activeTab = e.target.id;
        markerClusterer.clearLayers();
        markerClusterer.addLayers(friMarkers);
      })
      $('#saturday-tab').on('shown.bs.tab', function(e) {
        DEBUG && console && console.log("#saturday-tab -> shown.bs.tab");
        DEBUG && console && console.log("activeTab : ", e.target.id);
        activeTab = e.target.id;
        markerClusterer.clearLayers();
        markerClusterer.addLayers(satMarkers);
      })

    });

    return {
      doIt: function() {
        newMap();
      }
    };

}(jQuery);
