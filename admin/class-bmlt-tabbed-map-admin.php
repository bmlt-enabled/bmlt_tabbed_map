<?php

class Bmlt_Tabbed_Map_Admin {
	private $plugin_name;
	private $version;
	private $option_name = 'bmlt_tabbed_map';
	private $tmp_zoom_position;
	private $tmp_lng_position;
	private $tmp_lat_position;
	private $plugin_screen_hook_suffix;

	public function __construct( $plugin_name, $version ) {
		$this->plugin_name = sanitize_text_field( $plugin_name );
		$this->version = sanitize_text_field( $version );
	}

	public function receive_new_settings() {
		check_ajax_referer( 'myajax-next-nonce', 'nextNonce' );

		$safe_zoom_position = isset( $_POST['zoomPosition'] ) ? intval( $_POST['zoomPosition'] ) : 7;
		if ( $safe_zoom_position > 99 ) {
			$safe_zoom_position = 99;
		}
		$this->tmp_zoom_position = $safe_zoom_position;

		$this->tmp_lng_position = isset( $_POST['lngPosition'] ) && is_numeric( $_POST['lngPosition'] )
			? floatval( $_POST['lngPosition'] )
			: 0;

		$this->tmp_lat_position = isset( $_POST['latPosition'] ) && is_numeric( $_POST['latPosition'] )
			? floatval( $_POST['latPosition'] )
			: 0;

		update_option( $this->option_name . '_zoom_position', $this->tmp_zoom_position );
		update_option( $this->option_name . '_lat_position', $this->tmp_lat_position );
		update_option( $this->option_name . '_lng_position', $this->tmp_lng_position );

		wp_send_json_success(
			array(
				'zoomPosition' => $this->tmp_zoom_position,
				'latPosition'  => $this->tmp_lat_position,
				'lngPosition'  => $this->tmp_lng_position,
			)
		);

		wp_die();
	}

	public function enqueue_styles() {
		wp_enqueue_style( 'leaflet_admin', esc_url( plugin_dir_url( __FILE__ ) . 'css/leaflet.css' ), array(), $this->version, 'all' );
		wp_enqueue_style( 'L_control_admin', esc_url( plugin_dir_url( __FILE__ ) . 'css/L.Control.Locate.min.css' ), array(), $this->version, 'all' );
		wp_enqueue_style( 'fa_solid_admin', esc_url( plugin_dir_url( __FILE__ ) . 'css/fontawesome-5.6.1.css' ), array(), $this->version, 'all' );
		wp_enqueue_style( $this->plugin_name, esc_url( plugin_dir_url( __FILE__ ) . 'css/bmlt_tabbed_map-admin.css' ), array(), $this->version, 'all' );
	}

	public function enqueue_scripts() {
		wp_enqueue_script( 'leaflet_admin', esc_url( plugin_dir_url( __FILE__ ) . 'js/leaflet.js' ), array(), $this->version, false );
		wp_enqueue_script( 'leafletlocate_admin', esc_url( plugin_dir_url( __FILE__ ) . 'js/L.Control.Locate.min.js' ), array(), $this->version, false );
		wp_enqueue_script( $this->plugin_name, esc_url( plugin_dir_url( __FILE__ ) . 'js/bmlt_tabbed_map-admin.js' ), array( 'jquery' ), $this->version, false );

		$script_data = array(
			'zoom_js'   => get_option( $this->option_name . '_zoom_position' ),
			'lat_js'    => get_option( $this->option_name . '_lat_position' ),
			'lng_js'    => get_option( $this->option_name . '_lng_position' ),
			'nextNonce' => wp_create_nonce( 'myajax-next-nonce' ),
		);

		wp_localize_script( $this->plugin_name, 'js_vars', $script_data );
	}

	public function add_options_page() {
		$this->plugin_screen_hook_suffix = add_options_page(
			esc_html__( 'BMLT Tabbed Map Settings', 'bmlt_tabbed_map' ),
			esc_html__( 'BMLT Tabbed Map', 'bmlt_tabbed_map' ),
			'manage_options',
			$this->plugin_name,
			array( $this, 'display_options_page' )
		);
	}

	public function display_options_page() {
		include_once 'partials/bmlt-tabbed-map-admin-display.php';
	}

	public function register_setting() {
		add_settings_section(
			$this->option_name . '_general',
			esc_html__( 'Center and zoom the map', 'bmlt_tabbed_map' ),
			array( $this, $this->option_name . '_general_cb' ),
			$this->plugin_name
		);

		register_setting(
			$this->plugin_name,
			$this->option_name . '_lat_position',
			array(
				'type' => 'number',
				'sanitize_callback' => 'sanitize_text_field',
				'default' => null,
			)
		);

		register_setting(
			$this->plugin_name,
			$this->option_name . '_lng_position',
			array(
				'type' => 'number',
				'sanitize_callback' => 'sanitize_text_field',
				'default' => null,
			)
		);

		register_setting(
			$this->plugin_name,
			$this->option_name . '_zoom_position',
			array(
				'type' => 'integer',
				'sanitize_callback' => 'sanitize_text_field',
				'default' => null,
			)
		);
	}

	public function bmlt_tabbed_map_lat_position_cb() {
		$lat_position = get_option( $this->option_name . '_lat_position' );
		echo '<p>' . esc_html( $lat_position ) . '</p>';
	}

	public function bmlt_tabbed_map_lng_position_cb() {
		$lng_position = get_option( $this->option_name . '_lng_position' );
		echo '<p>' . esc_html( $lng_position ) . '</p>';
	}

	public function bmlt_tabbed_map_zoom_position_cb() {
		$zoom_position = get_option( $this->option_name . '_zoom_position' );
		echo '<p>' . esc_html( $zoom_position ) . '</p>';
	}

	public function bmlt_tabbed_map_general_cb() {
		update_option( $this->option_name . '_zoom_position', $this->tmp_zoom_position );
		update_option( $this->option_name . '_lat_position', $this->tmp_lat_position );
		update_option( $this->option_name . '_lng_position', $this->tmp_lng_position );
	}

	public function add_action_links( $links ) {
		$settings_link = array(
			'<a href="' . esc_url( admin_url( 'options-general.php?page=' . $this->plugin_name ) ) . '">' . esc_html__( 'Settings', 'bmlt_tabbed_map' ) . '</a>',
		);
		return array_merge( $settings_link, $links );
	}
}
