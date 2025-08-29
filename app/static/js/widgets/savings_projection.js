document.addEventListener("DOMContentLoaded", initSavings_projection);

function initSavings_projection() {
    const savingsData = JSON.parse(localStorage.getItem("savings"));
    const savingsProjectionWidget = document.getElementById("savings_projection-widget");

    if (!savingsData) {
        console.error("No savings data found.");
        return;
    }

    // Function to update the savings projection graph
    function updateSavingsProjection(data) {
        const { amount, interval, percentage, goalDate, instalment } = data;

        if (isNaN(amount) || isNaN(instalment) || isNaN(percentage)) {
            console.error("Invalid data: amount, instalment, or percentage is NaN.");
            return;
        }

        // Calculate the projection data
        const projectionData = calculateSavingsProjection(amount, interval, percentage, goalDate, instalment);

        if (projectionData.length === 0) {
            console.error("No projection data found.");
            return;
        }

        // ✅ AER Display
        const aerDisplayEl = document.getElementById("aer-display");
        if (aerDisplayEl) {
            aerDisplayEl.textContent = `AER: ${percentage}%`;
        }

        // ✅ Goal Feasibility Check with Tooltip
        const finalProjection = projectionData[projectionData.length - 1];
        const finalCompound = parseFloat(finalProjection.compound);
        const goalFeasibilityEl = document.getElementById("goal-feasibility");

        if (goalFeasibilityEl) {
            if (finalCompound >= savingsData.goalAmount) {
                goalFeasibilityEl.textContent = "✅";
                goalFeasibilityEl.style.color = "green";
                goalFeasibilityEl.setAttribute("aria-label", "Goal IS achievable.");
            } else {
                goalFeasibilityEl.textContent = "⚠️";
                goalFeasibilityEl.style.color = "crimson";
                goalFeasibilityEl.setAttribute("aria-label", "Goal NOT achievable.");


            }
        }


        // Now render the chart
        renderSavingsProjection(projectionData);
    }

    // Function to calculate the savings projection
    function calculateSavingsProjection(amount, interval, percentage, goalDate, instalment) {
        let projections = [];
        const startDate = new Date();
        const endDate = new Date(goalDate);
        let currentAmount = amount;
        let currentCompoundAmount = amount;

        const timeInterval = {
            daily: 1,
            weekly: 7,
            monthly: 30,
            quarterly: 90,
            "half-year": 180,
            yearly: 365
        };

        const dailyRate = Math.pow(1 + percentage / 100, 1 / 365) - 1;
        const daysToGoal = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
        const intervalDays = timeInterval[interval];

        if (isNaN(intervalDays)) {
            console.error(`Invalid interval: ${interval}`);
            return [];
        }

        for (let day = 0; day <= daysToGoal; day += intervalDays) {
            const date = new Date(startDate.getTime() + day * (1000 * 60 * 60 * 24));
            currentAmount += instalment;
            currentCompoundAmount += instalment;

            const compoundInterest = currentCompoundAmount * (Math.pow(1 + dailyRate, intervalDays) - 1);
            currentCompoundAmount += compoundInterest;

            projections.push({
                date: date.toISOString().split("T")[0],
                amount: currentAmount.toFixed(2),
                compound: currentCompoundAmount.toFixed(2)
            });
        }

        return projections;
    }

    // Function to render the chart
    function renderSavingsProjection(projectionData) {
        const labels = projectionData.map(item => item.date);
        const amountData = projectionData.map(item => item.amount);
        const compoundData = projectionData.map(item => item.compound);

        if (labels.length === 0 || amountData.length === 0 || compoundData.length === 0) {
            console.error("Data for chart is empty.");
            return;
        }

        const ctx = savingsProjectionWidget.querySelector("canvas").getContext("2d");

        if (window.savingsChart) {
            window.savingsChart.destroy();
        }

        window.savingsChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Total',
                        data: amountData,
                        fill: false,
                        borderColor: '#6ce5e8',
                        tension: 0.1
                    },
                    {
                        label: 'Compound',
                        data: compoundData,
                        fill: false,
                        borderColor: '#ff3bb4',
                        tension: 0.1
                    }
                ]
            },
            options: {
                layout: {
                    padding: { bottom: 10 },
                },
                scales: {
                    x: {
                        ticks: {
                            maxRotation: 45,
                            minRotation: 45,
                            autoSkip: true,
                            maxTicksLimit: 8
                        },
                        title: {
                            display: true,
                            text: ''
                        }
                    }
                }
            }
        });
    }

    // 🔁 Initial graph render
    updateSavingsProjection(savingsData);
}
