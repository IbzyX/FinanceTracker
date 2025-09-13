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

    // ✅ Adjust bills with past dates by rolling them forward to the next month
    const adjustedBills = bills.map(bill => {
        let billDate = new Date(bill.date);

        // 🔥 If bill is in the past, keep adding 1 month until it's in the future
        while (billDate < today) {
            billDate.setMonth(billDate.getMonth() + 1);
        }

        return { ...bill, date: billDate.toISOString().split("T")[0] }; 
    });

    // ✅ Filter and sort upcoming bills
    const upcomingBills = adjustedBills
        .filter(bill => {
            const billDate = new Date(bill.date);
            return billDate >= today && billDate <= thirtyDaysFromNow;
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date));

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
