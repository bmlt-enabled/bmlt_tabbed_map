<?php
// phpcs:disable PSR1.Classes.ClassDeclaration.MissingNamespace
// phpcs:disable Squiz.Classes.ValidClassName.NotCamelCaps
class Bmlt_tabbed_map
{
    // phpcs:enable PSR1.Classes.ClassDeclaration.MissingNamespace
    // phpcs:enable Squiz.Classes.ValidClassName.NotCamelCaps
    protected $loader;

    protected $plugin_name;

    protected $version;

    public function __construct()
    {
        if (defined('BMLT_TABBED_MAP_PLUGIN_VERSION')) {
            $this->version = BMLT_TABBED_MAP_PLUGIN_VERSION;
        } else {
            $this->version = '1.0.0';
        }
        $this->plugin_name = 'bmlt_tabbed_map';

        $this->load_dependencies();
        $this->set_locale();
        $this->define_admin_hooks();
        $this->define_public_hooks();
    }
    // phpcs:disable PSR1.Methods.CamelCapsMethodName.NotCamelCaps
    private function load_dependencies()
    {
        // phpcs:enable PSR1.Methods.CamelCapsMethodName.NotCamelCaps
        require_once plugin_dir_path(dirname(__FILE__)) . 'includes/class-bmlt_tabbed_map-loader.php';
        require_once plugin_dir_path(dirname(__FILE__)) . 'includes/class-bmlt_tabbed_map-i18n.php';
        require_once plugin_dir_path(dirname(__FILE__)) . 'admin/class-bmlt_tabbed_map-admin.php';
        require_once plugin_dir_path(dirname(__FILE__)) . 'public/class-bmlt_tabbed_map-public.php';

        $this->loader = new Bmlt_tabbed_map_Loader();
    }
    // phpcs:disable PSR1.Methods.CamelCapsMethodName.NotCamelCaps
    private function set_locale()
    {
        // phpcs:enable PSR1.Methods.CamelCapsMethodName.NotCamelCaps
        $plugin_i18n = new Bmlt_tabbed_map_i18n();
        $this->loader->add_action('plugins_loaded', $plugin_i18n, 'load_plugin_textdomain');
    }
    // phpcs:disable PSR1.Methods.CamelCapsMethodName.NotCamelCaps
    private function define_admin_hooks()
    {
        // phpcs:enable PSR1.Methods.CamelCapsMethodName.NotCamelCaps
        $plugin_admin = new Bmlt_tabbed_map_Admin($this->get_plugin_name(), $this->get_version());

        $this->loader->add_action('admin_menu', $plugin_admin, 'add_options_page');
        $this->loader->add_action('admin_init', $plugin_admin, 'register_setting');

        $this->loader->add_action('admin_enqueue_scripts', $plugin_admin, 'enqueue_styles');
        $this->loader->add_action('admin_enqueue_scripts', $plugin_admin, 'enqueue_scripts');

        $this->loader->add_action('wp_ajax_receive_new_settings', $plugin_admin, 'receive_new_settings');
        $this->loader->add_action('wp_ajax_nopriv_receive_new_settings', $plugin_admin, 'receive_new_settings');

        $plugin_basename = plugin_basename(plugin_dir_path(__DIR__) . $this->plugin_name . '.php');
        $this->loader->add_filter('plugin_action_links_' . $plugin_basename, $plugin_admin, 'add_action_links');
    }
    // phpcs:disable PSR1.Methods.CamelCapsMethodName.NotCamelCaps
    private function define_public_hooks()
    {
        // phpcs:enable PSR1.Methods.CamelCapsMethodName.NotCamelCaps
        $plugin_public = new Bmlt_tabbed_map_Public($this->get_plugin_name(), $this->get_version());

        $this->loader->add_action('wp_enqueue_scripts', $plugin_public, 'enqueue_styles', 100000);
        $this->loader->add_action('wp_enqueue_scripts', $plugin_public, 'enqueue_scripts');
        $this->loader->add_shortcode("bmlt_tabbed_map", $plugin_public, "bmlt_tabbed_map_shortcode", 10, 2);
    }

    public function run()
    {
        $this->loader->run();
    }
    // phpcs:disable PSR1.Methods.CamelCapsMethodName.NotCamelCaps
    public function get_plugin_name()
    {
        // phpcs:enable PSR1.Methods.CamelCapsMethodName.NotCamelCaps
        return $this->plugin_name;
    }
    // phpcs:disable PSR1.Methods.CamelCapsMethodName.NotCamelCaps
    public function get_loader()
    {
        // phpcs:enable PSR1.Methods.CamelCapsMethodName.NotCamelCaps
        return $this->loader;
    }
    // phpcs:disable PSR1.Methods.CamelCapsMethodName.NotCamelCaps
    public function get_version()
    {
        // phpcs:enable PSR1.Methods.CamelCapsMethodName.NotCamelCaps
        return $this->version;
    }
}
