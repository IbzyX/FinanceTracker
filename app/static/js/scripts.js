function toggleDropdown() {
    document.getElementById("settingsDropdown").classList.toggle("show");
}

function toggleTheme() {
    const body = document.body;
    const themeSwitchBtn = document.getElementById("themeSwitch");

    if (body.classList.contains("light")) {
    // Currently light → switch to dark
    body.classList.remove("light");
    themeSwitchBtn.textContent = "Switch to Light Mode";
    } else {
    // Currently dark → switch to light
    body.classList.add("light");
    themeSwitchBtn.textContent = "Switch to Dark Mode";
    }
}

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