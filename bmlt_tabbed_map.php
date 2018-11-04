<?php

/**
 *
 * @wordpress-plugin
 * Plugin Name:       BMLT Tabbed Map
 * Plugin URI:        https://www.na-ireland.org
 * Description:       This is a short description of what the plugin does. It's displayed in the WordPress admin area.
 * Version:           1.0.0
 * Author:            Paul N
 * Author URI:        https://www.na-ireland.org
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       bmlt_tabbed_map
 * Domain Path:       /languages
 */

if ( ! defined( 'WPINC' ) ) {
	die;
}

define( 'PLUGIN_NAME_VERSION', '1.0.0' );

function activate_bmlt_tabbed_map() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-bmlt_tabbed_map-activator.php';
	Bmlt_tabbed_map_Activator::activate();
}

function deactivate_bmlt_tabbed_map() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-bmlt_tabbed_map-deactivator.php';
	Bmlt_tabbed_map_Deactivator::deactivate();
}

register_activation_hook( __FILE__, 'activate_bmlt_tabbed_map' );
register_deactivation_hook( __FILE__, 'deactivate_bmlt_tabbed_map' );

require plugin_dir_path( __FILE__ ) . 'includes/class-bmlt_tabbed_map.php';


function run_bmlt_tabbed_map() {

	$plugin = new Bmlt_tabbed_map();
	$plugin->run();

}
run_bmlt_tabbed_map();
