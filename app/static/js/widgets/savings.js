function formatDateToDDMMYYYY(dateStr) {
  if (!dateStr || !dateStr.includes("-")) return dateStr;
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
}

function initSavings() {
    const data = JSON.parse(localStorage.getItem("savings"));
    if (!data) return;

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

    document.querySelector("#savings-widget .amount").textContent = formattedAmount;
    document.querySelector("#savings-widget .goal-date")
    .textContent = `Goal: ${formatDateToDDMMYYYY(goalDate)}`;
    document.querySelector("#savings-widget .goal-amount").textContent = `£${formattedGoalAmount}`;

    const circle = document.querySelector("#savings-widget .donut-fill");
    if (circle) {
        const length = circle.getTotalLength(); // true path length
        circle.style.strokeDasharray = length;
        circle.style.strokeDashoffset = length * (1 - progress / 100);
    }
}
document.addEventListener("DOMContentLoaded", initSavings);
