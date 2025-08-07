async function getStockInfo() {
    const symbol = document.getElementById("symbolInput").value.trim().toUpperCase();

    if (!symbol) {
        alert("Please enter a stock symbol.");
        return;
    }

    const apiKey = "c4111ac3814740a895978ee961e97fa0"; 
    const url = `https://api.twelvedata.com/quote?symbol=${symbol}&apikey=${apiKey}`;

    try {
        const res = await fetch(url);
        const stock = await res.json();

        console.log("Fetched stock data:", stock);

        // Check for API error
        if (stock.code || !stock.name) {
            alert("Error: " + (stock.message || "Invalid symbol or data unavailable."));
            return;
        }
        document.getElementById("price").innerText = `$${stock.close}` || "-";
        document.getElementById("dailychange").innerText = `$${stock.change}` || "-";
        document.getElementById("dailychangepercent").innerText = `${stock.percent_change}%` || "-";
        document.getElementById("volume").innerText = stock.volume || "-";
        document.getElementById("dailyhigh").innerText = `$${stock.high}` || "-";
        document.getElementById("dailylow").innerText = `$${stock.low}` || "-";

    } catch (err) {
        console.error("Fetch error:", err);
        alert("Error fetching stock data. Please try again later.");
    }
}