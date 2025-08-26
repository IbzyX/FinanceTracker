function initUpcoming_bills() {
    console.log("initUpcoming_bills called ✅");

    const bills = JSON.parse(localStorage.getItem("bills")) || [];

    const tbody = document.getElementById("bills-table-body");
    const totalSpan = document.getElementById("total-bills");

    if (!tbody || !totalSpan) return;

    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    tbody.innerHTML = "";
    let total = 0;

    // ✅ Sort by date
    const upcomingBills = bills
        .filter(bill => {
            const billDate = new Date(bill.date);
            return billDate >= today && billDate <= thirtyDaysFromNow;
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date)); // Closest date first

    // ✅ Render sorted bills
    upcomingBills.forEach(bill => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${bill.name}</td>
            <td>${bill.date}</td>
            <td>£${bill.amount.toFixed(2)}</td>`;
        tbody.appendChild(row);
        total += bill.amount;
    });

    totalSpan.textContent = total.toFixed(2);
}
