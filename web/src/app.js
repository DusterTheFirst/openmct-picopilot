import { disconnect, refresh_port_listing } from "./ingest/connect.js";
import { HistoricalTelemetryPlugin } from "./plugins/historical-telemetry.js";
import { PicoPilotPlugin } from "./plugins/pico-pilot.js";

window.onload = async () => {
    openmct.setAssetPath("./openmct/");
    openmct.install(openmct.plugins.LocalStorage());
    openmct.install(openmct.plugins.MyItems());
    openmct.install(openmct.plugins.UTCTimeSystem());
    openmct.time.clock("local", { start: -15 * 60 * 1000, end: 0 });
    openmct.time.timeSystem("utc");
    openmct.install(openmct.plugins.Espresso());

    openmct.install(PicoPilotPlugin());
    openmct.install(HistoricalTelemetryPlugin());

    openmct.start();

    // Overlay

    const container = document.createElement("div");
    const port_list_container = document.createElement("ul");
    const title = document.createElement("h1");

    title.textContent = "Select a device";

    container.appendChild(title);
    container.appendChild(port_list_container);

    const indicator = openmct.indicators.simpleIndicator();

    indicator.iconClass("icon-tabular-lad-set");
    indicator.text("Disconnected");
    indicator.statusClass("s-status-disabled");
    openmct.indicators.add(indicator);

    const disconnect_button = document.createElement("button");
    const connect_button = document.createElement("button");

    /** @type {Overlay | undefined} */
    let overlay = undefined;

    const elements = {
        port_list_container,
        indicator,
        disconnect_button,
        connect_button,
        dismiss() {
            if (overlay !== undefined) {
                overlay.dismiss();
            }

            overlay = undefined;
        },
    };

    const show_overlay = () => {
        overlay = openmct.overlays.overlay({
            buttons: [
                {
                    callback() {
                        refresh_port_listing(elements);
                    },
                    label: "Refresh",
                },
            ],
            element: container,
            onDestroy() {},
            size: "small",
        });

        refresh_port_listing(elements);
    };

    disconnect_button.classList.add("c-button");
    disconnect_button.textContent = "Disconnect";
    disconnect_button.style.display = "none";
    disconnect_button.addEventListener("click", () => disconnect(elements));
    openmct.indicators.add({ element: disconnect_button });

    connect_button.classList.add("c-button");
    connect_button.textContent = "Connect";
    connect_button.addEventListener("click", () => show_overlay());
    openmct.indicators.add({ element: connect_button });
};
