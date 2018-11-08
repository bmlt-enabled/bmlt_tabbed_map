<?php

class Bmlt_tabbed_map_Public
{

    private $plugin_name;
    private $version;
    private $option_name = 'bmlt_tabbed_map';

    public function __construct($plugin_name, $version)
    {
        $this->plugin_name = $plugin_name;
        $this->version = $version;
    }

    public function enqueue_styles()
    {
        $wp_scripts = wp_scripts();

        wp_enqueue_style('leaflet_css',        plugin_dir_url(__FILE__) . 'css/leaflet.css',                       array(), $this->version, 'all');
        wp_enqueue_style('L_control',          plugin_dir_url(__FILE__) . 'css/L.Control.Locate.min.css',          array(), $this->version, 'all');
        wp_enqueue_style('marker_cluster_css', plugin_dir_url(__FILE__) . 'css/MarkerCluster.css',                 array(), $this->version, 'all');
        wp_enqueue_style('marker_cluster_default', plugin_dir_url(__FILE__) . 'css/MarkerCluster.Default.css',     array(), $this->version, 'all');
        wp_enqueue_style('fa_solid',           'https://use.fontawesome.com/releases/v5.4.1/css/solid.css',        array(), $this->version, 'all');
        wp_enqueue_style('fa',                 'https://use.fontawesome.com/releases/v5.4.1/css/fontawesome.css',  array(), $this->version, 'all');
        wp_enqueue_style('bootstrap_css',      'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css',array(), $this->version, 'all');
        wp_enqueue_style('data_table_css',     plugin_dir_url(__FILE__) . 'css/dataTables.bootstrap4.min.css',     array(), $this->version, 'all');
        wp_enqueue_style($this->plugin_name,   plugin_dir_url(__FILE__) . 'css/bmlt_tabbed_map-public.css',        array(), $this->version, 'all');
    }

    public function enqueue_scripts()
    {

        wp_enqueue_script('jquery',             'https://code.jquery.com/jquery-3.3.1.slim.min.js', array(), $this->version, false);
        wp_enqueue_script('popper',             'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js', array(), $this->version, false);
        wp_enqueue_script('bootstrap',          'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js', array(), $this->version, false);
        wp_enqueue_script('jquerydataTables',   plugin_dir_url(__FILE__) . 'js/jquery.dataTables.min.js',  array(), $this->version, false);
        wp_enqueue_script('datatables',         plugin_dir_url(__FILE__) . 'js/dataTables.bootstrap4.min.js', array(), $this->version, false);
        wp_enqueue_script('leaflet',            plugin_dir_url(__FILE__) . 'js/leaflet.js',                array(), $this->version, false);
        wp_enqueue_script('leafletlocate',      plugin_dir_url(__FILE__) . 'js/L.Control.Locate.min.js',   array(), $this->version, false);
        wp_enqueue_script('leafletmarker',      plugin_dir_url(__FILE__) . 'js/leaflet.markercluster.js',  array(), $this->version, false);
        wp_enqueue_script('leafletspin',        plugin_dir_url(__FILE__) . 'js/leaflet.spin.js',           array(), $this->version, false);
        wp_enqueue_script('spinmin',            plugin_dir_url(__FILE__) . 'js/spin.min.js',               array(), $this->version, false);
        wp_enqueue_script($this->plugin_name,   plugin_dir_url(__FILE__) . 'js/bmlt_tabbed_map-public.js', array( 'jquery' ), $this->version, false);


        $script_data = array( 'zoom_js'   => get_option($this->option_name . '_zoom_position'),
                              'lat_js'    => get_option($this->option_name . '_lat_position'),
                              'lng_js'    => get_option($this->option_name . '_lng_position') );
        wp_localize_script($this->plugin_name, 'js_vars', $script_data);


    }

    public function bmlt_tabbed_map_shortcode($atts)
    {
        $output  = '      <ul class="nav nav-tabs nav-fill" role="tablist" id="myTab" >
                            <li class="nav-item">
                              <a class="nav-link" id="sunday-tab" data-toggle="tab" href="#sunday" role="tab" >Sun <span id="sunday-badge" class="badge badge-primary"></span></a>
                            </li>
                            <li class="nav-item  ">
                              <a class="nav-link" id="monday-tab" data-toggle="tab" href="#monday" role="tab" >Mon <span id="monday-badge" class="badge badge-primary"></span></a>
                            </li>
                            <li class="nav-item ">
                              <a class="nav-link" id="tuesday-tab" data-toggle="tab" href="#tuesday" role="tab" >Tue <span id="tuesday-badge" class="badge badge-primary"></span></a>
                            </li>
                            <li class="nav-item r ">
                              <a class="nav-link" id="wednesday-tab" data-toggle="tab" href="#wednesday" role="tab" >Wed <span id="wednesday-badge" class="badge badge-primary"></span></a>
                            </li>
                            <li class="nav-item  ">
                              <a class="nav-link" id="thursday-tab" data-toggle="tab" href="#thursday" role="tab" >Thu <span id="thursday-badge" class="badge badge-primary"></span></a>
                            </li>
                            <li class="nav-item ">
                              <a class="nav-link" id="friday-tab" data-toggle="tab" href="#friday" role="tab" >Fri <span id="friday-badge" class="badge badge-primary"></span></a>
                            </li>
                            <li class="nav-item  ">
                              <a class="nav-link" id="saturday-tab" data-toggle="tab" href="#saturday" role="tab" >Sat <span id="saturday-badge" class="badge badge-primary"></span></a>
                            </li>
                          </ul>


                          <div id="map"> </div>

                          <div id="list_result"></div>
                          <script>
                            bmlt_tabbed_map_js.doIt();
                          </script>';

        return $output;
    }
}
