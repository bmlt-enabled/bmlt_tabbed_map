<?php
// phpcs:disable PSR1.Classes.ClassDeclaration.MissingNamespace
// phpcs:disable Squiz.Classes.ValidClassName.NotCamelCaps
class Bmlt_tabbed_map_Loader
{
    // phpcs:enable PSR1.Classes.ClassDeclaration.MissingNamespace
    // phpcs:enable Squiz.Classes.ValidClassName.NotCamelCaps
    protected $actions;

    protected $filters;
    /**
     * @var array
     */
    private $shortcodes;

    public function __construct()
    {
        $this->actions = array();
        $this->filters = array();
        $this->shortcodes = array();
    }

    // phpcs:disable PSR1.Methods.CamelCapsMethodName.NotCamelCaps
    public function add_action($hook, $component, $callback, $priority = 10, $accepted_args = 1)
    {
        // phpcs:enable PSR1.Methods.CamelCapsMethodName.NotCamelCaps
        $this->actions = $this->add($this->actions, $hook, $component, $callback, $priority, $accepted_args);
    }

    // phpcs:disable PSR1.Methods.CamelCapsMethodName.NotCamelCaps
    public function add_filter($hook, $component, $callback, $priority = 10, $accepted_args = 1)
    {
        // phpcs:enable PSR1.Methods.CamelCapsMethodName.NotCamelCaps
        $this->filters = $this->add($this->filters, $hook, $component, $callback, $priority, $accepted_args);
    }


    private function add($hooks, $hook, $component, $callback, $priority, $accepted_args)
    {
        $hooks[] = array(
            'hook'          => $hook,
            'component'     => $component,
            'callback'      => $callback,
            'priority'      => $priority,
            'accepted_args' => $accepted_args
        );

        return $hooks;
    }
    // phpcs:disable PSR1.Methods.CamelCapsMethodName.NotCamelCaps
    public function add_shortcode($tag, $component, $callback, $priority = 10, $accepted_args = 1)
    {
        // phpcs:enable PSR1.Methods.CamelCapsMethodName.NotCamelCaps
        $this->shortcodes = $this->add($this->shortcodes, $tag, $component, $callback, $priority, $accepted_args);
    }

    public function run()
    {
        foreach ($this->filters as $hook) {
            add_filter($hook['hook'], array( $hook['component'], $hook['callback'] ), $hook['priority'], $hook['accepted_args']);
        }

        foreach ($this->actions as $hook) {
            add_action($hook['hook'], array( $hook['component'], $hook['callback'] ), $hook['priority'], $hook['accepted_args']);
        }

        foreach ($this->shortcodes as $hook) {
            add_shortcode($hook['hook'], array( $hook['component'], $hook['callback'] ));
        }
    }
}
