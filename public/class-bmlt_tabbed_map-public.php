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

        wp_enqueue_style(bootstrap_css, plugin_dir_url(__FILE__) . 'css/bootstrap.min.css', array(), $this->version, 'all');
        wp_enqueue_style(data_table_css, plugin_dir_url(__FILE__) . 'css/dataTables.bootstrap4.min.css', array(), $this->version, 'all');
        wp_enqueue_style(jquery-ui_css, plugin_dir_url(__FILE__) . 'css/jquery-ui.css', array(), $this->version, 'all');
        wp_enqueue_style(leaflet_css, plugin_dir_url(__FILE__) . 'css/leaflet.css', array(), $this->version, 'all');
        wp_enqueue_style(L_control, plugin_dir_url(__FILE__) . 'css/L.Control.Locate.min.css', array(), $this->version, 'all');
        wp_enqueue_style(marker_cluster_css, plugin_dir_url(__FILE__) . 'css/MarkerCluster.css', array(), $this->version, 'all');
        wp_enqueue_style(marker_cluster_default, plugin_dir_url(__FILE__) . 'css/MarkerCluster.Default.css', array(), $this->version, 'all');
        wp_enqueue_style(theme, plugin_dir_url(__FILE__) . 'css/theme.css', array(), $this->version, 'all');
        wp_enqueue_style(fa_solid, 'https://use.fontawesome.com/releases/v5.4.1/css/solid.css', array(), $this->version, 'all');
        wp_enqueue_style(fa, 'https://use.fontawesome.com/releases/v5.4.1/css/fontawesome.css', array(), $this->version, 'all');

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

        wp_enqueue_script(jquery,             plugin_dir_url(__FILE__) . 'js/jquery.min.js',             array( 'jquery' ), $this->version, false);
        wp_enqueue_script(bootstrap_min_js,   plugin_dir_url(__FILE__) . 'js/bootstrap.min.js',          array( 'jquery' ), $this->version, false);
        wp_enqueue_script(jquerydataTables,   plugin_dir_url(__FILE__) . 'js/jquery.dataTables.min.js',  array( 'jquery' ), $this->version, false);
        wp_enqueue_script(datatables,         plugin_dir_url(__FILE__) . 'js/dataTables.bootstrap4.min.js', array( 'jquery' ), $this->version, false);
        wp_enqueue_script(jqueryui,           plugin_dir_url(__FILE__) . 'js/jquery-ui.min.js',          array( 'jquery' ), $this->version, false);
        wp_enqueue_script(leaflet,            plugin_dir_url(__FILE__) . 'js/leaflet.js',                array(), $this->version, false);
        wp_enqueue_script(leafletlocate,      plugin_dir_url(__FILE__) . 'js/L.Control.Locate.min.js',   array(), $this->version, false);
        wp_enqueue_script(leafletmarker,      plugin_dir_url(__FILE__) . 'js/leaflet.markercluster.js',  array(), $this->version, false);
        wp_enqueue_script(leafletspin,        plugin_dir_url(__FILE__) . 'js/leaflet.spin.js',           array(), $this->version, false);
        wp_enqueue_script(spinmin,            plugin_dir_url(__FILE__) . 'js/spin.min.js',               array(), $this->version, false);
        wp_enqueue_script($this->plugin_name, plugin_dir_url(__FILE__) . 'js/bmlt_tabbed_map-public.js', array( 'jquery' ), $this->version, false);

        // not used...
        $script_data = array( 'image_path' => plugin_dir_url(__FILE__) . '/img/',
                              'bmlt_server' => "https://bmlt.nasouth.ie/main_server/" );
        wp_localize_script($this->plugin_name, 'js_vars', $script_data);
    }

    public function bmlt_tabbed_map_shortcode($atts)
    {
        $output  = '  <div class="container">
                        <div>
                          <ul class="nav nav-tabs nav-justified " id="myTab" >
                            <li class="nav-item">
                              <a class="nav-link" id="sunday-tab" data-toggle="tab" href="#sunday" role="tab" >Sun <span id="sunday-badge" class="badge badge-primary"></span></a>
                            </li>
                            <li class="nav-item  ">
                              <a class="nav-link" id="monday-tab" data-toggle="tab" href="#monday" role="tab" >Mon <span id="monday-badge" class="badge badge-primary"></span></a>
                            </li>
                            <li class="nav-item ">
                              <a class="nav-link" id="tuesday-tab" data-toggle="tab" href="#tuesday" role="tab" >Tue <span id="tuesday-badge" class="badge badge-primary"></span></a>
                            </li>
                            <li class="nav-item r ">
                              <a class="nav-link" id="wednesday-tab" data-toggle="tab" href="#wednesday" role="tab" >Wed <span id="wednesday-badge" class="badge badge-primary"></span></a>
                            </li>
                            <li class="nav-item  ">
                              <a class="nav-link" id="thursday-tab" data-toggle="tab" href="#thursday" role="tab" >Thu <span id="thursday-badge" class="badge badge-primary"></span></a>
                            </li>
                            <li class="nav-item ">
                              <a class="nav-link" id="friday-tab" data-toggle="tab" href="#friday" role="tab" >Fri <span id="friday-badge" class="badge badge-primary"></span></a>
                            </li>
                            <li class="nav-item  ">
                              <a class="nav-link" id="saturday-tab" data-toggle="tab" href="#saturday" role="tab" >Sat <span id="saturday-badge" class="badge badge-primary"></span></a>
                            </li>
                          </ul>


                          <div id="map"> </div>

                          <div id="list_result"></div>
                          <script>
                            bmlt_tabbed_map_js.doIt();
                          </script>
                        </div>
                      </div> ';

        return $output;
    }
}
