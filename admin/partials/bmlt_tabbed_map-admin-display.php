<?php

/**
 * Provide a admin area view for the plugin
 *
 * This file is used to markup the admin-facing aspects of the plugin.
 *
 * @link       https://www.na-ireland.org
 * @since      1.0.0
 *
 * @package    Bmlt_tabbed_map
 * @subpackage Bmlt_tabbed_map/admin/partials
 */
?>

<!-- This file should primarily consist of HTML with a little bit of PHP. -->

<div class="wrap">
        <h2><?php echo esc_html(get_admin_page_title()); ?></h2>
        <form action="options.php" method="post">
            <?php
                settings_fields($this->plugin_name);
                do_settings_sections($this->plugin_name);
            ?>
                                <div><h4>Any changes you make to the position of the map here will be be seen in your [bmlt_tabbed_map] pages </h4></div>

                                <div id="map"> </div>
                                <div id="zoom"> </div>
                                <div id="latitude"> </div>
                              <div id="longitude"> </div>
                                <div><h3>Just add the shortcode [bmlt_tabbed_map] to any webpage, and the map will be displayed along with the meetings</h3></div>
                <div><h4>Or, you can override the settings page by passing the latitude, longitude and zoom levels to the shortcode i.e. [bmlt_tabbed_map lat=53.4 lng=-7.24 zoom=7 ]  </h4></div>
                                <div><p>If you come accross any bugs, or would like something added to this plugin, you can open an issue on github using this link <a href="https://github.com/bmlt-enabled/bmlt_tabbed_map/issues">Open Issue</a></p></div>
                                  <script>
                                    bmlt_tabbed_map_admin.showMap();
                                  </script>

<?php

//                submit_button();
?>
        </form>
 <div>


</div>

    </div>
