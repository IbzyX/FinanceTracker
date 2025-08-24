document.addEventListener("DOMContentLoaded", () => {
    const slots = document.querySelectorAll(".widget-slot");

    slots.forEach(slot => {
        const widgetName = slot.dataset.widget;
        loadWidget(widgetName, slot);
    });
});

function loadWidget(widgetName, container) {
    // fetch widget HTML from Flask route
    fetch(`/widget/${widgetName}`)
        .then(res => {
            if (!res.ok) throw new Error(`Failed to load widget: ${widgetName}`);
            return res.text();
        })
        .then(html => {
            container.innerHTML = html;
            // After HTML injected, load widget-specific JS
            loadWidgetScript(widgetName);
        })
        .catch(err => console.error(err));
}

function loadWidgetScript(widgetName) {
    const scriptId = `widget-script-${widgetName}`;
    if (document.getElementById(scriptId)) return; // prevent duplicate loads

    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = `/static/js/widgets/${widgetName}.js`;
        script.id = scriptId;
        script.onload = () => {
            // Call the widget init function after script loads
            const initFunctionName = `init${widgetName.charAt(0).toUpperCase() + widgetName.slice(1)}`;
            if (typeof window[initFunctionName] === "function") {
                window[initFunctionName]();
            } else {
                console.warn(`Init function ${initFunctionName} not found for widget ${widgetName}`);
            }
            resolve();
        };
        script.onerror = () => reject(new Error(`Failed to load script for widget ${widgetName}`));
        document.body.appendChild(script);
    });
}
