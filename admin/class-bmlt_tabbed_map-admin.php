<?php
// phpcs:disable PSR1.Classes.ClassDeclaration.MissingNamespace
// phpcs:disable Squiz.Classes.ValidClassName.NotCamelCaps
class Bmlt_tabbed_map_Admin
{
    // phpcs:enable PSR1.Classes.ClassDeclaration.MissingNamespace
    // phpcs:enable Squiz.Classes.ValidClassName.NotCamelCaps
    private $plugin_name;

    private $version;

    private $option_name = 'bmlt_tabbed_map';

    private $tmpZoomPosition;
    private $tmpLngPosition;
    private $tmpLatPosition;
    private $plugin_screen_hook_suffix;

    public function __construct($plugin_name, $version)
    {
        $this->plugin_name = $plugin_name;
        $this->version = $version;
    }
    // phpcs:disable PSR1.Methods.CamelCapsMethodName.NotCamelCaps
    public function receive_new_settings()
    {
        // phpcs:enable PSR1.Methods.CamelCapsMethodName.NotCamelCaps
        $nonce = $_POST['nextNonce'];
        if (! wp_verify_nonce($nonce, 'myajax-next-nonce')) {
            die();
        }

        global $wpdb;

        // Validate/sanitize zoomPosition POST
        $safe_zoomPosition = intval($_POST['zoomPosition']);
        if (! $safe_zoomPosition) {
            $safe_zoomPosition = 7;
        }

        if (strlen($safe_zoomPosition) > 2) {
            $safe_zoomPosition = substr($safe_zoomPosition, 0, 2);
        }

        $this->tmpZoomPosition = $safe_zoomPosition;

        // Validate/sanitize lngPosition post
        if (is_numeric($_POST['lngPosition'])) {
            $this->tmpLngPosition  = $_POST['lngPosition'];
        } else {
            $this->tmpLngPosition  = 0;
        }

        // Validate/sanitize latPosition post
        if (is_numeric($_POST['latPosition'])) {
            $this->tmpLatPosition  = $_POST['latPosition'];
        } else {
            $this->tmpLatPosition  = 0;
        }

        $response = json_encode($_POST);
        // response output
        header("Content-Type: application/json");
        echo $response;


        update_option($this->option_name . '_zoom_position', $this->tmpZoomPosition);
        update_option($this->option_name . '_lat_position', $this->tmpLatPosition);
        update_option($this->option_name . '_lng_position', $this->tmpLngPosition);

        wp_die();
    }
    // phpcs:disable PSR1.Methods.CamelCapsMethodName.NotCamelCaps
    public function enqueue_styles()
    {
        // phpcs:enable PSR1.Methods.CamelCapsMethodName.NotCamelCaps
        wp_enqueue_style('leaflet_admin', plugin_dir_url(__FILE__) . 'css/leaflet.css', array(), $this->version, 'all');
        wp_enqueue_style('L_control_admin', plugin_dir_url(__FILE__) . 'css/L.Control.Locate.min.css', array(), $this->version, 'all');
        wp_enqueue_style('fa_solid_admin', plugin_dir_url(__FILE__) . 'css/fontawesome-5.6.1.css', array(), $this->version, 'all');
        wp_enqueue_style($this->plugin_name, plugin_dir_url(__FILE__) . 'css/bmlt_tabbed_map-admin.css', array(), $this->version, 'all');
    }
    // phpcs:disable PSR1.Methods.CamelCapsMethodName.NotCamelCaps
    public function enqueue_scripts()
    {
        // phpcs:enable PSR1.Methods.CamelCapsMethodName.NotCamelCaps
        wp_enqueue_script('leaflet_admin', plugin_dir_url(__FILE__) . 'js/leaflet.js', array(), $this->version, false);
        wp_enqueue_script('leafletlocate_admin', plugin_dir_url(__FILE__) . 'js/L.Control.Locate.min.js', array(), $this->version, false);
        wp_enqueue_script($this->plugin_name, plugin_dir_url(__FILE__) . 'js/bmlt_tabbed_map-admin.js', array( 'jquery' ), $this->version, false);

        $script_data = array( 'zoom_js'   => get_option($this->option_name . '_zoom_position'),
                              'lat_js'    => get_option($this->option_name . '_lat_position'),
                              'lng_js'    => get_option($this->option_name . '_lng_position'),
                              'nextNonce' => wp_create_nonce('myajax-next-nonce')  );

        wp_localize_script($this->plugin_name, 'js_vars', $script_data);
    }
    // phpcs:disable PSR1.Methods.CamelCapsMethodName.NotCamelCaps
    public function add_options_page()
    {
        // phpcs:enable PSR1.Methods.CamelCapsMethodName.NotCamelCaps
        $this->plugin_screen_hook_suffix = add_options_page(
            __('BMLT Tabbed Map Settings', 'bmlt_tabbed_map'),
            __('BMLT Tabbed Map', 'bmlt_tabbed_map'),
            'manage_options',
            $this->plugin_name,
            array( $this, 'display_options_page' )
        );
    }
    // phpcs:disable PSR1.Methods.CamelCapsMethodName.NotCamelCaps
    public function display_options_page()
    {
        // phpcs:enable PSR1.Methods.CamelCapsMethodName.NotCamelCaps
        include_once 'partials/bmlt_tabbed_map-admin-display.php';
    }
    // phpcs:disable PSR1.Methods.CamelCapsMethodName.NotCamelCaps
    public function register_setting()
    {
        // phpcs:enable PSR1.Methods.CamelCapsMethodName.NotCamelCaps
        // Add a General section
        add_settings_section(
            $this->option_name . '_general',
            __('Center and zoom the map', 'bmlt_tabbed_map'),
            array( $this, $this->option_name . '_general_cb' ),
            $this->plugin_name
        );

        $lat_args = array(
              'type' => 'number',
              'sanitize_callback' => null,
              'default' => null
              );

        register_setting($this->plugin_name, $this->option_name . '_lat_position', $lat_args);

        $lng_args = array(
              'type' => 'number',
              'sanitize_callback' => null,
              'default' =>  null
              );

        register_setting($this->plugin_name, $this->option_name . '_lng_position', $lng_args);

        $zoom_args = array(
              'type' => 'integer',
              'sanitize_callback' => null,
              'default' =>  null
              );

        register_setting($this->plugin_name, $this->option_name . '_zoom_position', $zoom_args);
    }
    // phpcs:disable PSR1.Methods.CamelCapsMethodName.NotCamelCaps
    public function bmlt_tabbed_map_lat_position_cb()
    {
        // phpcs:enable PSR1.Methods.CamelCapsMethodName.NotCamelCaps
        $lat_position = get_option($this->option_name . '_lat_position'); ?>
      <p><?php echo esc_html($lat_position) ?></p>

            <?php
    }
    // phpcs:disable PSR1.Methods.CamelCapsMethodName.NotCamelCaps
    public function bmlt_tabbed_map_lng_position_cb()
    {
        // phpcs:enable PSR1.Methods.CamelCapsMethodName.NotCamelCaps
        $lng_position = get_option($this->option_name . '_lng_position'); ?>
      <p><?php echo esc_html($lng_position) ?></p>

        <?php
    }
    // phpcs:disable PSR1.Methods.CamelCapsMethodName.NotCamelCaps
    public function bmlt_tabbed_map_zoom_position_cb()
    {
        // phpcs:enable PSR1.Methods.CamelCapsMethodName.NotCamelCaps
        $zoom_position = get_option($this->option_name . '_zoom_position'); ?>
      <p><?php echo esc_html($zoom_position) ?></p>

        <?php
    }
    // phpcs:disable PSR1.Methods.CamelCapsMethodName.NotCamelCaps
    public function bmlt_tabbed_map_general_cb()
    {
        // phpcs:enable PSR1.Methods.CamelCapsMethodName.NotCamelCaps
        update_option($this->option_name . '_zoom_position', $this->tmpZoomPosition);
        update_option($this->option_name . '_lat_position', $this->tmpLatPosition);
        update_option($this->option_name . '_lng_position', $this->tmpLngPosition);
    }
    // phpcs:disable PSR1.Methods.CamelCapsMethodName.NotCamelCaps
    public function add_action_links($links)
    {
        // phpcs:enable PSR1.Methods.CamelCapsMethodName.NotCamelCaps
        $settings_link = array(
        '<a href="' . admin_url('options-general.php?page=' . $this->plugin_name) . '">' . __('Settings', $this->plugin_name) . '</a>',
        );
        return array_merge($settings_link, $links);
    }
}
