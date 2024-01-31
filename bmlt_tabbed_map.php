<?php

/**
 *
 * @wordpress-plugin
 * Plugin Name:       BMLT Tabbed Map
 * Plugin URI:        https://bmlt.app
 * Description:       A plugin to display NA Meetings from the BMLT Aggregator server on a map, tabbed by weekday.
 * Version:           1.1.8
 * Author: bmlt-enabled
 * Author URI: https://bmlt.app
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       bmlt_tabbed_map
 * Domain Path:       /languages
 */

if (! defined('WPINC')) {
    die;
}

define('BMLT_TABBED_MAP_PLUGIN_VERSION', '1.1.8');

function activate_bmlt_tabbed_map()
{
    require_once plugin_dir_path(__FILE__) . 'includes/class-bmlt_tabbed_map-activator.php';
    Bmlt_tabbed_map_Activator::activate();
}

function deactivate_bmlt_tabbed_map()
{
    require_once plugin_dir_path(__FILE__) . 'includes/class-bmlt_tabbed_map-deactivator.php';
    Bmlt_tabbed_map_Deactivator::deactivate();
}

register_activation_hook(__FILE__, 'activate_bmlt_tabbed_map');
register_deactivation_hook(__FILE__, 'deactivate_bmlt_tabbed_map');

require plugin_dir_path(__FILE__) . 'includes/class-bmlt_tabbed_map.php';


function run_bmlt_tabbed_map()
{

    $plugin = new Bmlt_tabbed_map();
    $plugin->run();
}
run_bmlt_tabbed_map();
