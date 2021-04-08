declare interface PortControlElements {
    port_list_container: HTMLUListElement;
    indicator: SimpleIndicator;
    disconnect_button: HTMLButtonElement;
    connect_button: HTMLButtonElement;
    dismiss(): void;
}

declare interface ParentNode {
    /**
     * Returns the first element that is a descendant of node that matches selectors.
     */
    querySelectorAlways<K extends keyof HTMLElementTagNameMap>(
        selectors: K
    ): HTMLElementTagNameMap[K];
    querySelectorAlways<K extends keyof SVGElementTagNameMap>(
        selectors: K
    ): SVGElementTagNameMap[K];
    querySelectorAlways<E extends Element = Element>(selectors: string): E;
}
