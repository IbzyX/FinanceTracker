function formatDateToDDMMYYYY(dateStr) {
    if (!dateStr || !dateStr.includes("-")) return dateStr;
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
}

function initSavings(container = document) {
    console.log("💰 initSavings called");

    const data = JSON.parse(localStorage.getItem("savings"));
    if (!data) {
        console.warn("⚠️ No savings data found in localStorage.");
        return;
    }

    const { amount = 0, goalAmount = 0, goalDate = "Goal date" } = data;
    const progress = goalAmount > 0 ? Math.min((amount / goalAmount) * 100, 100) : 0;

    const formattedAmount = amount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    const formattedGoalAmount = goalAmount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    const widget = container.querySelector("#savings-widget");
    if (!widget) {
        console.warn("⚠️ Savings widget container not found.");
        return;
    }

    const amountEl = widget.querySelector(".amount");
    const goalDateEl = widget.querySelector(".goal-date");
    const goalAmountEl = widget.querySelector(".goal-amount");
    const circle = widget.querySelector(".donut-fill");

    if (amountEl) amountEl.textContent = formattedAmount;
    if (goalDateEl) goalDateEl.textContent = `Goal: ${formatDateToDDMMYYYY(goalDate)}`;
    if (goalAmountEl) goalAmountEl.textContent = `£${formattedGoalAmount}`;

    if (circle) {
        const length = circle.getTotalLength();
        circle.style.strokeDasharray = length;
        circle.style.strokeDashoffset = length * (1 - progress / 100);
    }
}

// Optional: Re-initialize on storage change
window.addEventListener("storage", () => initSavings(document));
