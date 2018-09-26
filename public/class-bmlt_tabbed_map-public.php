<?php

/**
 * The public-facing functionality of the plugin.
 *
 * @link       https://www.na-ireland.org
 * @since      1.0.0
 *
 * @package    Bmlt_tabbed_map
 * @subpackage Bmlt_tabbed_map/public
 */

/**
 * The public-facing functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the public-facing stylesheet and JavaScript.
 *
 * @package    Bmlt_tabbed_map
 * @subpackage Bmlt_tabbed_map/public
 * @author     Paul N <web@na-ireland.org>
 */
class Bmlt_tabbed_map_Public {

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of the plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {

		$this->plugin_name = $plugin_name;
		$this->version = $version;

	}

	/**
	 * Register the stylesheets for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles() {

		/**
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Bmlt_tabbed_map_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Bmlt_tabbed_map_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_style( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'css/bmlt_tabbed_map-public.css', array(), $this->version, 'all' );

	}

	/**
	 * Register the JavaScript for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {

		/**
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Bmlt_tabbed_map_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Bmlt_tabbed_map_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */


		 $googlemaps_source = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAsffU8WwV1vQ3XLCt4fGUctg7jx8T9b8g';
		 $oms_source = 'https://cdnjs.cloudflare.com/ajax/libs/OverlappingMarkerSpiderfier/1.0.3/oms.min.js';
		 $markerclusterer_source = 'https://cdnjs.cloudflare.com/ajax/libs/js-marker-clusterer/1.0.0/markerclusterer_compiled.js';
     $spin_source = 'https://cdnjs.cloudflare.com/ajax/libs/spin.js/2.3.2/spin.min.js';

     wp_enqueue_script( 'google-maps', $googlemaps_source );
		 wp_enqueue_script( 'oms', $oms_source);
		 wp_enqueue_script( 'markerclusterer', $markerclusterer_source);
		 wp_enqueue_script( 'spin', $spin_source);

		 wp_enqueue_script( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'js/bmlt_tabbed_map-public.js', array( 'jquery' ), $this->version, false );
	}

	public function bmlt_tabbed_map_shortcode( $atts ) {
		$output = '<div id="map-loader"  >';
		$output .= '<strong><em>Please wait while the map loads</em></strong>
		</div>
		<div id="map-controls" style="display: inline;" >
		   <strong><em>Click on the day and the meetings will appear on the map, and in a list below the map</em></strong><br><br>
		   <label><input type="checkbox" id="Sun" onclick="bmlt_tabbed_map_js.toggleDay(this,\'Sun\')">Sunday</label>
			 <label><input type="checkbox" id="Mon" onclick="bmlt_tabbed_map_js.toggleDay(this,\'Mon\')">Monday</label>
			 <label><input type="checkbox" id="Tue" onclick="bmlt_tabbed_map_js.toggleDay(this,\'Tue\')">Tuesday</label>
			 <label><input type="checkbox" id="Wed" onclick="bmlt_tabbed_map_js.toggleDay(this,\'Wed\')">Wednesday</label>
			 <label><input type="checkbox" id="Thu" onclick="bmlt_tabbed_map_js.toggleDay(this,\'Thu\')">Thursday</label>
			 <label><input type="checkbox" id="Fri" onclick="bmlt_tabbed_map_js.toggleDay(this,\'Fri\')">Friday</label>
			 <label><input type="checkbox" id="Sat" onclick="bmlt_tabbed_map_js.toggleDay(this,\'Sat\')">Saturday</label>
		</div>

		<div id="map-canvas" style="width: 100%; height: 600px;" ></div>
		<br>
		<div id="test-results">
			<div id="SunResult"></div>
			<div id="MonResult"></div>
			<div id="TueResult"></div>
			<div id="WedResult"></div>
			<div id="ThuResult"></div>
			<div id="FriResult"></div>
			<div id="SatResult"></div>
		</div>

		';

    return $output;
	}

}
