<?php

class Bmlt_tabbed_map_Admin
{
    private $plugin_name;

    private $version;

    private $option_name = 'bmlt_tabbed_map';

    private $tmpZoomPosition;
    private $tmpLngPosition;
    private $tmpLatPosition;

    public function __construct($plugin_name, $version)
    {
        $this->plugin_name = $plugin_name;
        $this->version = $version;
    }

    public function receive_new_settings()
    {

        $nonce = $_POST['nextNonce'];
        if (! wp_verify_nonce($nonce, 'myajax-next-nonce')) {
            die();
        }

        global $wpdb;

        $this->tmpZoomPosition = $_POST['zoomPosition'];
        $this->tmpLngPosition  = $_POST['lngPosition'];
        $this->tmpLatPosition  = $_POST['latPosition'];

        $response = json_encode( $_POST );
      	// response output
      	header( "Content-Type: application/json" );
      	echo $response;


        update_option($this->option_name . '_zoom_position', $this->tmpZoomPosition);
        update_option($this->option_name . '_lat_position', $this->tmpLatPosition);
        update_option($this->option_name . '_lng_position', $this->tmpLngPosition);

        wp_die();
    }

    public function enqueue_styles()
    {
        wp_enqueue_style('leaflet_admin', plugin_dir_url(__FILE__) . 'css/leaflet.css', array(), $this->version, 'all');
        wp_enqueue_style('L_control_admin', plugin_dir_url(__FILE__) . 'css/L.Control.Locate.min.css', array(), $this->version, 'all');
        wp_enqueue_style('fa_solid_admin', 'https://use.fontawesome.com/releases/v5.4.1/css/solid.css', array(), $this->version, 'all');
        wp_enqueue_style('fa_admin', 'https://use.fontawesome.com/releases/v5.4.1/css/fontawesome.css', array(), $this->version, 'all');
        wp_enqueue_style($this->plugin_name, plugin_dir_url(__FILE__) . 'css/bmlt_tabbed_map-admin.css', array(), $this->version, 'all');
    }

    public function enqueue_scripts()
    {
        wp_enqueue_script('leaflet_admin', plugin_dir_url(__FILE__) . 'js/leaflet.js', array(), $this->version, false);
        wp_enqueue_script('leafletlocate_admin', plugin_dir_url(__FILE__) . 'js/L.Control.Locate.min.js', array(), $this->version, false);

        wp_enqueue_script($this->plugin_name, plugin_dir_url(__FILE__) . 'js/bmlt_tabbed_map-admin.js', array( 'jquery' ), $this->version, false);

        $script_data = array( 'zoom_js'   => get_option($this->option_name . '_zoom_position'),
                              'lat_js'    => get_option($this->option_name . '_lat_position'),
                              'lng_js'    => get_option($this->option_name . '_lng_position'),
                              'nextNonce' => wp_create_nonce('myajax-next-nonce')  );

        wp_localize_script($this->plugin_name, 'js_vars', $script_data);
    }

    public function add_options_page()
    {
        $this->plugin_screen_hook_suffix = add_options_page(
            __('BMLT Tabbed Map Settings', 'bmlt_tabbed_map'),
            __('BMLT Tabbed Map', 'bmlt_tabbed_map'),
            'manage_options',
            $this->plugin_name,
            array( $this, 'display_options_page' )
        );
    }

    public function display_options_page()
    {
        include_once 'partials/bmlt_tabbed_map-admin-display.php';
    }

    public function register_setting()
    {
        // Add a General section
        add_settings_section(
          $this->option_name . '_general',
          __('Center the map as you would like it to appear on your webpage', 'bmlt_tabbed_map'),
          array( $this, $this->option_name . '_general_cb' ),
          $this->plugin_name
        );

        add_settings_field(
          $this->option_name . '_lat_position',
          __('Map Latitude position', 'bmlt_tabbed_map'),
          array( $this, $this->option_name . '_lat_position_cb' ),
          $this->plugin_name,
          $this->option_name . '_general',
          array( 'label_for' => $this->option_name . '_lat_position' )
        );

        $lat_args = array(
              'type' => 'number',
              'sanitize_callback' => null,
              'default' => null
              );

        register_setting($this->plugin_name, $this->option_name . '_lat_position', $lat_args);


        add_settings_field(
          $this->option_name . '_lng_position',
          __('Map Longitude position', 'bmlt_tabbed_map'),
          array( $this, $this->option_name . '_lng_position_cb' ),
          $this->plugin_name,
          $this->option_name . '_general',
          array( 'label_for' => $this->option_name . '_lng_position' )
        );

        $lng_args = array(
              'type' => 'number',
              'sanitize_callback' => null,
              'default' =>  null
              );

        register_setting($this->plugin_name, $this->option_name . '_lng_position', $lng_args);


        add_settings_field(
          $this->option_name . '_zoom_position',
          __('Map zoom level', 'bmlt_tabbed_map'),
          array( $this, $this->option_name . '_zoom_position_cb' ),
          $this->plugin_name,
          $this->option_name . '_general',
          array( 'label_for' => $this->option_name . '_zoom_position' )
        );

        $zoom_args = array(
              'type' => 'integer',
              'sanitize_callback' => null,
              'default' =>  null
              );

        register_setting($this->plugin_name, $this->option_name . '_zoom_position', $zoom_args);
    }

    public function bmlt_tabbed_map_lat_position_cb()
    {
        $lat_position = get_option($this->option_name . '_lat_position'); ?>
      <p><?php echo $lat_position ?></p>

			<?php
    }

    public function bmlt_tabbed_map_lng_position_cb()
    {
        $lng_position = get_option($this->option_name . '_lng_position'); ?>
      <p><?php echo $lng_position ?></p>

      <?php
    }

    public function bmlt_tabbed_map_zoom_position_cb()
    {
        $zoom_position = get_option($this->option_name . '_zoom_position'); ?>
      <p><?php echo $zoom_position ?></p>

      <?php
    }

    public function bmlt_tabbed_map_general_cb()
    {
        update_option($this->option_name . '_zoom_position', $this->tmpZoomPosition);
        update_option($this->option_name . '_lat_position', $this->tmpLatPosition);
        update_option($this->option_name . '_lng_position', $this->tmpLngPosition);
    }
}
