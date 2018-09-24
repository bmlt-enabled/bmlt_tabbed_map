<?php

/**
 * Define the internationalization functionality
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @link       https://www.na-ireland.org
 * @since      1.0.0
 *
 * @package    Bmlt_tabbed_map
 * @subpackage Bmlt_tabbed_map/includes
 */

/**
 * Define the internationalization functionality.
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @since      1.0.0
 * @package    Bmlt_tabbed_map
 * @subpackage Bmlt_tabbed_map/includes
 * @author     Paul N <web@na-ireland.org>
 */
class Bmlt_tabbed_map_i18n {


	/**
	 * Load the plugin text domain for translation.
	 *
	 * @since    1.0.0
	 */
	public function load_plugin_textdomain() {

		load_plugin_textdomain(
			'bmlt_tabbed_map',
			false,
			dirname( dirname( plugin_basename( __FILE__ ) ) ) . '/languages/'
		);

	}



}
