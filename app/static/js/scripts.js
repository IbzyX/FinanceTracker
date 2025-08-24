function toggleDropdown() {
    document.getElementById("settingsDropdown").classList.toggle("show");
}

function toggleTheme() {
    const body = document.body;
    const themeSwitchBtn = document.getElementById("themeSwitch");

    if (body.classList.contains("light")) {
        // Switch to dark
        body.classList.remove("light");
        themeSwitchBtn.textContent = "Switch to Light Mode";
        localStorage.setItem("theme", "dark");
    } else {
        // Switch to light
        body.classList.add("light");
        themeSwitchBtn.textContent = "Switch to Dark Mode";
        localStorage.setItem("theme", "light");
    }
}
document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("theme") || "dark";

    if (savedTheme === "light") {
        document.body.classList.add("light");
        const btn = document.getElementById("themeSwitch");
        if (btn) btn.textContent = "Switch to Dark Mode";
    }
});


// Close dropdown if clicking outside
window.onclick = function(event) {
    if (!event.target.closest('.dropdown')) {
    document.getElementById("settingsDropdown").classList.remove("show");
    }
}
document.addEventListener('DOMContentLoaded', () => {
  const alerts = document.querySelectorAll('.alert');

    alerts.forEach(alert => {
        setTimeout(() => {
        alert.classList.add('fade-out');
        setTimeout(() => alert.remove(), 1000);
        }, 5000);
    });
});