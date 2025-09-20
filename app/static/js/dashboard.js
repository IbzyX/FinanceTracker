// dashboard.js
document.addEventListener("DOMContentLoaded", () => {
    const savedOrder = JSON.parse(localStorage.getItem("widgetOrder"));
    const slots = document.querySelectorAll(".widget-slot");

    if (savedOrder && savedOrder.length === slots.length) {
        // 🔁 Load widgets from saved order
        savedOrder.forEach((widgetName, i) => {
            const slot = slots[i];
            slot.dataset.widget = widgetName;

            const dropdown = slot.querySelector(".widget-dropdown");
            if (dropdown) dropdown.value = widgetName;

            loadWidget(widgetName, slot);

            dropdown?.addEventListener("change", (e) => {
                const selectedWidget = e.target.value;
                handleWidgetSwap(slot, selectedWidget);
            });
        });
    } else {
        // 🧩 Load default widgets
        slots.forEach(slot => {
            const dropdown = slot.querySelector(".widget-dropdown");
            const widgetName = slot.dataset.widget;

            loadWidget(widgetName, slot);

            dropdown?.addEventListener("change", (e) => {
                const selectedWidget = e.target.value;
                handleWidgetSwap(slot, selectedWidget);
            });
        });

        // Save initial order for first-time users
        saveWidgetPositions();
    }
});

/**
 * Handles swapping widgets between slots
 */
function handleWidgetSwap(currentSlot, selectedWidget) {
    const slots = document.querySelectorAll(".widget-slot");
    const currentWidget = currentSlot.dataset.widget;

    const targetSlot = Array.from(slots).find(s => s.dataset.widget === selectedWidget);

    if (targetSlot) {
        // 🔄 Swap the widgets between the two slots
        swapSlots(currentSlot, targetSlot);
    } else {
        // Just replace inside the current slot
        loadWidget(selectedWidget, currentSlot);
        currentSlot.dataset.widget = selectedWidget;

        const dropdown = currentSlot.querySelector(".widget-dropdown");
        if (dropdown) dropdown.value = selectedWidget;
    }

    // 💾 Save updated widget layout
    saveWidgetPositions();
}

/**
 * Swap widget contents and dataset values between two slots
 */
function swapSlots(slotA, slotB) {
    const widgetA = slotA.dataset.widget;
    const widgetB = slotB.dataset.widget;

    // Destroy old charts before swapping
    destroyCharts(slotA);
    destroyCharts(slotB);

    // Swap dataset
    slotA.dataset.widget = widgetB;
    slotB.dataset.widget = widgetA;

    // Swap dropdown values
    const dropdownA = slotA.querySelector(".widget-dropdown");
    const dropdownB = slotB.querySelector(".widget-dropdown");
    if (dropdownA) dropdownA.value = widgetB;
    if (dropdownB) dropdownB.value = widgetA;

    // Reload both slots with correct content
    loadWidget(widgetB, slotA);
    loadWidget(widgetA, slotB);
}

/**
 * Load widget HTML + script into a slot
 */
function loadWidget(widgetName, container) {
    const dropdown = container.querySelector(".widget-dropdown");
    const dropdownValue = dropdown ? dropdown.value : null;

    // 🔥 Clean old chart instances before reloading
    destroyCharts(container);

    fetch(`/widget/${widgetName}`)
        .then(res => {
            if (!res.ok) throw new Error(`Failed to load widget: ${widgetName}`);
            return res.text();
        })
        .then(html => {
            const widgetContentDiv = container.querySelector(".widget-content");
            widgetContentDiv.innerHTML = html;

            if (dropdown && dropdownValue) {
                dropdown.value = dropdownValue;
            }

            // Run widget-specific JS
            loadWidgetScript(widgetName, container);
        })
        .catch(err => console.error(err));
}

/**
 * Load widget script (only once per widget type) and run its init
 */
function loadWidgetScript(widgetName, container) {
    const scriptId = `widget-script-${widgetName}`;
    if (document.getElementById(scriptId)) {
        runWidgetInit(widgetName, container);
        return;
    }

    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = `/static/js/widgets/${widgetName}.js`;
        script.id = scriptId;

        script.onload = () => {
            runWidgetInit(widgetName, container);
            resolve();
        };

        script.onerror = () => reject(new Error(`❌ Failed to load script for widget ${widgetName}`));
        document.body.appendChild(script);
    });
}

/**
 * Call the init function for a widget
 */
function runWidgetInit(widgetName, container) {
    const initFunctionName = `init${widgetName.charAt(0).toUpperCase()}${widgetName.slice(1)}`;
    if (typeof window[initFunctionName] === "function") {
        console.log(`✅ Running ${initFunctionName}`);
        window[initFunctionName](container); // pass container
    } else {
        console.warn(`❌ Init function ${initFunctionName} not found for widget ${widgetName}`);
    }
}

/**
 * Destroy all Chart.js instances inside a container
 */
function destroyCharts(container) {
    const canvases = container.querySelectorAll("canvas");
    canvases.forEach(canvas => {
        const chart = Chart.getChart(canvas);
        if (chart) {
            console.log("🧹 Destroying chart", chart);
            chart.destroy();
        }
    });
}

/**
 * Save the current widget layout order to localStorage
 */
function saveWidgetPositions() {
    const slots = document.querySelectorAll(".widget-slot");
    const order = Array.from(slots).map(slot => slot.dataset.widget);
    localStorage.setItem("widgetOrder", JSON.stringify(order));
}
