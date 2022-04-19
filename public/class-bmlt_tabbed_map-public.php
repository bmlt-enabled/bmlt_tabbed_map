<?php
// phpcs:disable PSR1.Classes.ClassDeclaration.MissingNamespace
// phpcs:disable Squiz.Classes.ValidClassName.NotCamelCaps
class Bmlt_tabbed_map_Public
{
    // phpcs:enable PSR1.Classes.ClassDeclaration.MissingNamespace
    // phpcs:enable Squiz.Classes.ValidClassName.NotCamelCaps
    private $plugin_name;
    private $version;
    private $option_name = 'bmlt_tabbed_map';

    public function __construct($plugin_name, $version)
    {
        $this->plugin_name = $plugin_name;
        $this->version = $version;
    }
    // phpcs:disable PSR1.Methods.CamelCapsMethodName.NotCamelCaps
    public function enqueue_styles()
    {
        // phpcs:enable PSR1.Methods.CamelCapsMethodName.NotCamelCaps
        $wp_scripts = wp_scripts();

        wp_enqueue_style('roboto_font', 'https://fonts.googleapis.com/css?family=Roboto', array(), $this->version, 'all');
        wp_enqueue_style('leaflet_css', plugin_dir_url(__FILE__) . 'css/leaflet.css', array(), $this->version, 'all');
        wp_enqueue_style('L_control', plugin_dir_url(__FILE__) . 'css/L.Control.Locate.min.css', array(), $this->version, 'all');
        wp_enqueue_style('marker_cluster_css', plugin_dir_url(__FILE__) . 'css/MarkerCluster.css', array(), $this->version, 'all');
        wp_enqueue_style('marker_cluster_default', plugin_dir_url(__FILE__) . 'css/MarkerCluster.Default.css', array(), $this->version, 'all');
        wp_enqueue_style('leaflet_legend', plugin_dir_url(__FILE__) . 'css/L.Control.HtmlLegend.css', array(), $this->version, 'all');

        wp_enqueue_style('badge_css', plugin_dir_url(__FILE__) . 'css/jquery.badge.css', array(), $this->version, 'all');
        wp_enqueue_style('fa_solid', plugin_dir_url(__FILE__) . 'css/fontawesome-5.6.1.css', array(), $this->version, 'all');
        wp_enqueue_style('dataTablesCss', plugin_dir_url(__FILE__) . 'css/datatables-1.11.5.min.css', array(), $this->version, 'all');
        wp_enqueue_style($this->plugin_name, plugin_dir_url(__FILE__) . 'css/bmlt_tabbed_map-public.css', array(), $this->version, 'all');
    }
    // phpcs:disable PSR1.Methods.CamelCapsMethodName.NotCamelCaps
    public function enqueue_scripts()
    {
        // phpcs:enable PSR1.Methods.CamelCapsMethodName.NotCamelCaps
        wp_enqueue_script('leaflet', plugin_dir_url(__FILE__) . 'js/leaflet.js', array(), $this->version, false);
        wp_enqueue_script('leafletlocate', plugin_dir_url(__FILE__) . 'js/L.Control.Locate.min.js', array(), $this->version, false);
        wp_enqueue_script('leafletmarker', plugin_dir_url(__FILE__) . 'js/leaflet.markercluster.js', array(), $this->version, false);
        wp_enqueue_script('leafletspin', plugin_dir_url(__FILE__) . 'js/leaflet.spin.js', array(), $this->version, false);
        wp_enqueue_script('leafletledend', plugin_dir_url(__FILE__) . 'js/L.Control.HtmlLegend.js', array(), $this->version, false);

        wp_enqueue_script('spinmin', plugin_dir_url(__FILE__) . 'js/spin.min.js', array(), $this->version, false);
        wp_enqueue_script('badge_js', plugin_dir_url(__FILE__) . 'js/jquery.badge.js', array( 'jquery' ), $this->version, false);
        wp_enqueue_script('dataTableJS', plugin_dir_url(__FILE__) . 'js/datatables-1.11.5.min.js', array( 'jquery' ), $this->version, false);
        wp_enqueue_script($this->plugin_name, plugin_dir_url(__FILE__) . 'js/bmlt_tabbed_map-public.js', array( 'jquery' ), $this->version, false);

        $script_data = array( 'zoom_js'   => get_option($this->option_name . '_zoom_position'),
                              'lat_js'    => get_option($this->option_name . '_lat_position'),
                              'lng_js'    => get_option($this->option_name . '_lng_position'),
                              'plugin_folder' => plugins_url() );
        wp_localize_script($this->plugin_name, 'js_vars', $script_data);
    }
    // phpcs:disable PSR1.Methods.CamelCapsMethodName.NotCamelCaps
    public function bmlt_tabbed_map_shortcode($atts)
    {
        // phpcs:enable PSR1.Methods.CamelCapsMethodName.NotCamelCaps
        $atts = array_change_key_case((array)$atts, CASE_LOWER);
        extract(shortcode_atts(array(
                "lat" => '0',
                "lng" => '0',
                "zoom" => '0'
            ), $atts));


        $output  = '
        <div class="bmlt_tabbed_map_container">
          <ul id="tabs">
            <li><a id="sundayTab"    >Sun </a></li>
            <li><a id="mondayTab"    >Mon </a></li>
            <li><a id="tuesdayTab"   >Tue </a></li>
            <li><a id="wednesdayTab" >Wed </a></li>
            <li><a id="thursdayTab"  >Thu </a></li>
            <li><a id="fridayTab"    >Fri </a></li>
            <li><a id="saturdayTab"  >Sat </a></li>
          </ul>
          <div id="map"> </div>
          <div id="list_result">
            <script>
              bmltTabbedMapJS.doIt(';
              $output .= $lat;
              $output .= ",";
              $output .= $lng;
              $output .= ",";
              $output .= $zoom;
              $output .=  ');
            </script>
          </div>
        </div>
        ';
        return $output;
    }
}
