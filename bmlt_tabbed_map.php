<?php

/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              https://www.na-ireland.org
 * @since             1.0.0
 * @package           Bmlt_tabbed_map
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

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Currently plugin version.
 * Start at version 1.0.0 and use SemVer - https://semver.org
 * Rename this for your plugin and update it as you release new versions.
 */
define( 'PLUGIN_NAME_VERSION', '1.0.0' );

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-bmlt_tabbed_map-activator.php
 */
function activate_bmlt_tabbed_map() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-bmlt_tabbed_map-activator.php';
	Bmlt_tabbed_map_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-bmlt_tabbed_map-deactivator.php
 */
function deactivate_bmlt_tabbed_map() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-bmlt_tabbed_map-deactivator.php';
	Bmlt_tabbed_map_Deactivator::deactivate();
}

register_activation_hook( __FILE__, 'activate_bmlt_tabbed_map' );
register_deactivation_hook( __FILE__, 'deactivate_bmlt_tabbed_map' );



/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path( __FILE__ ) . 'includes/class-bmlt_tabbed_map.php';

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function run_bmlt_tabbed_map() {

	$plugin = new Bmlt_tabbed_map();
	$plugin->run();

}
run_bmlt_tabbed_map();
