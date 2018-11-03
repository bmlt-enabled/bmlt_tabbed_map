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
                do_settings_sections($this->plugin_name); ?>
								<div id="map"> </div>

								  <script>
								    bmlt_tabbed_map_admin.showMap();
								  </script>

<?php

                submit_button();
            ?>
	    </form>
 <div>


</div>

	</div>
