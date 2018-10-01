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
class Bmlt_tabbed_map_Public
{

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
    public function __construct($plugin_name, $version)
    {
        $this->plugin_name = $plugin_name;
        $this->version = $version;
    }

    /**
     * Register the stylesheets for the public-facing side of the site.
     *
     * @since    1.0.0
     */
    public function enqueue_styles()
    {

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
        $wp_scripts = wp_scripts();

        wp_enqueue_style(
             'jquery-ui-tabs',
                 'https://ajax.googleapis.com/ajax/libs/jqueryui/' . $wp_scripts->registered['jquery-ui-core']->ver . '/themes/redmond/jquery-ui.css',
                 false,
                 $this->version,
                 'all'
         );
         wp_enqueue_style('dataTables_css', 'https://cdn.datatables.net/1.10.19/css/jquery.dataTables.min.css', false, $this->version, 'all');
         wp_enqueue_style($this->plugin_name, plugin_dir_url(__FILE__) . 'css/bmlt_tabbed_map-public.css', array(), $this->version, 'all');
    }

    /**
     * Register the JavaScript for the public-facing side of the site.
     *
     * @since    1.0.0
     */
    public function enqueue_scripts()
    {

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
        $dataTable_source = 'https://cdn.datatables.net/1.10.19/js/jquery.dataTables.min.js';

        wp_enqueue_script('google-maps', $googlemaps_source);
        wp_enqueue_script('oms', $oms_source);
        wp_enqueue_script('markerclusterer', $markerclusterer_source);
        wp_enqueue_script('spin', $spin_source);
        wp_enqueue_script('datatables', $dataTable_source);
        wp_enqueue_script('jquery-ui-tabs');

        wp_enqueue_script($this->plugin_name, plugin_dir_url(__FILE__) . 'js/bmlt_tabbed_map-public.js', array( 'jquery' ), $this->version, false);

        $script_data = array( 'image_path' => plugin_dir_url(__FILE__) . '/img/',
                              'bmlt_server' => "https://bmlt.nasouth.ie/main_server/" );
        wp_localize_script($this->plugin_name, 'js_vars', $script_data);
    }

    public function bmlt_tabbed_map_shortcode($atts)
    {
        $output  = '<div id="meeting-loader">';
        $output .= '<strong><em>Please wait while the meetings load</em></strong></div>';
        $output .= ' <div id="tabs" class="style-tabs">  ';
        $output .= '  <ul> ';
        $output .= '    <li><a href="#SunResult">Sun</a></li>  ';
        $output .= '    <li><a href="#MonResult">Mon</a></li>  ';
        $output .= '    <li><a href="#TueResult">Tue</a></li>  ';
        $output .= '    <li><a href="#WedResult">Wed</a></li>  ';
        $output .= '    <li><a href="#ThuResult">Thu</a></li>  ';
        $output .= '    <li><a href="#FriResult">Fri</a></li>  ';
        $output .= '    <li><a href="#SatResult">Sat</a></li>  ';
        $output .= '  </ul>  ';
        $output .= '  <div id="map-canvas" style="width: 100%; height: 600px;" ></div> ';
        $output .= '  <div id="SunResult" class="style-tabs"></div>  ';
        $output .= '  <div id="MonResult" class="style-tabs"></div>  ';
        $output .= '  <div id="TueResult" class="style-tabs"></div>  ';
        $output .= '  <div id="WedResult" class="style-tabs"></div>  ';
        $output .= '  <div id="ThuResult" class="style-tabs"></div>  ';
        $output .= '  <div id="FriResult" class="style-tabs"></div>  ';
        $output .= '  <div id="SatResult" class="style-tabs"></div>  ';
        $output .= '</div>  ';

        return $output;
    }
}
