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
 * @package    Bmlt_Tabbed_Map
 * @subpackage Bmlt_Tabbed_Map/includes
 */

/**
 * Define the internationalization functionality.
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @since      1.0.0
 * @package    Bmlt_Tabbed_Map
 * @subpackage Bmlt_Tabbed_Map/includes
 * @author     Paul N <web@na-ireland.org>
 */

class Bmlt_Tabbed_Map_I18n {

	/**
	 * Load the plugin text domain for translation.
	 *
	 * @since    1.0.0
	 */
	public function load_plugin_textdomain() {
		load_plugin_textdomain(
			'bmlt_tabbed_map',
			false,
			dirname( plugin_basename( __FILE__ ), 2 ) . '/languages/'
		);
	}
}
