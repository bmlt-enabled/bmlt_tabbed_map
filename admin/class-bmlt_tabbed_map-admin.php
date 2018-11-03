<?php

class Bmlt_tabbed_map_Admin
{

    private $plugin_name;

    private $version;

    private $option_name = 'bmlt_tabbed_map';

    public function __construct($plugin_name, $version)
    {
        $this->plugin_name = $plugin_name;
        $this->version = $version;
        add_action( 'wp_ajax_wpa_49691', 'wpa_49691_callback' );
add_action( 'wp_ajax_nopriv_wpa_49691', 'wpa_49691_callback' );
    }

    public function enqueue_styles()
    {
        wp_enqueue_style(leaflet_admin, plugin_dir_url(__FILE__) . 'css/leaflet.css', array(), $this->version, 'all');
        wp_enqueue_style(L_control_admin, plugin_dir_url(__FILE__) . 'css/L.Control.Locate.min.css', array(), $this->version, 'all');
        wp_enqueue_style(fa_solid_admin, 'https://use.fontawesome.com/releases/v5.4.1/css/solid.css', array(), $this->version, 'all');
        wp_enqueue_style(fa_admin, 'https://use.fontawesome.com/releases/v5.4.1/css/fontawesome.css', array(), $this->version, 'all');
        wp_enqueue_style($this->plugin_name, plugin_dir_url(__FILE__) . 'css/bmlt_tabbed_map-admin.css', array(), $this->version, 'all');
    }

    public function enqueue_scripts()
    {
        wp_enqueue_script(leaflet_admin, plugin_dir_url(__FILE__) . 'js/leaflet.js', array(), $this->version, false);
        wp_enqueue_script(leafletlocate_admin, plugin_dir_url(__FILE__) . 'js/L.Control.Locate.min.js', array(), $this->version, false);
        wp_enqueue_script($this->plugin_name, plugin_dir_url(__FILE__) . 'js/bmlt_tabbed_map-admin.js', array( 'jquery' ), $this->version, false);
        $script_data = array( 'zoom_js' => get_option($this->option_name . '_zoom_position'),
                              'lat_js' => get_option($this->option_name . '_lat_position'),
                              'lng_js'  => get_option($this->option_name . '_lng_position') );
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
        __('Position the map as you would like it to appear on your webpage and then click on Save Changes', 'bmlt_tabbed_map'),
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
              'sanitize_callback' => NULL,
              'default' => '53.341318',
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
              'sanitize_callback' => NULL,
              'default' => '-6.270205',
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
              'sanitize_callback' => NULL,
              'default' => '10',
              );

      register_setting($this->plugin_name, $this->option_name . '_zoom_position', $zoom_args);

    }

    public function bmlt_tabbed_map_lat_position_cb()
    {
      update_option( $this->option_name . '_lat_position', '44' );
      $lat_position = get_option($this->option_name . '_lat_position'); ?>
      <p><?php echo $lat_position ?></p>

			<?php
    }

    public function bmlt_tabbed_map_lng_position_cb()
    {
      update_option( $this->option_name . '_lng_position', '55' );
      $lng_position = get_option($this->option_name . '_lng_position'); ?>
      <p><?php echo $lng_position ?></p>

      <?php
    }

    public function bmlt_tabbed_map_zoom_position_cb()
    {
      update_option( $this->option_name . '_zoom_position', '17' );
      $zoom_position = get_option($this->option_name . '_zoom_position'); ?>
      <p><?php echo $zoom_position ?></p>

      <?php
    }


    function wpa_49691_callback() {
        // Do whatever you need with update_option() here.
        // You have full access to the $_POST object.
        update_option( $this->option_name . '_zoom_position', '9' );
        ?>
        <p><?php echo $zoom_position ?></p>

        <?php
    }

}
