const requestUrl = `https://api.devnet.solana.com`;
const waitTime = 60000; // 60 seconds cooldown
let isRunning = false;

async function requestFaucet(solAddress) {
    document.getElementById("status").textContent = `Requesting SOL for ${solAddress}...`;
    try {
        const response = await fetch(requestUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "jsonrpc": "2.0",
                "id": 1,
                "method": "requestAirdrop",
                "params": [
                    solAddress,
                    1000000000 // 1 SOL (in Lamports)
                ]
            })
        });

        const data = await response.json();
        if (data.error) {
            document.getElementById("status").textContent = `Error: ${data.error.message}`;
            document.getElementById("link").innerHTML = '';
            isRunning = false;
            document.getElementById("startBtn").disabled = false;
        } else {
            document.getElementById("status").textContent = "Airdrop successful!";
            document.getElementById("link").innerHTML = `
                <a href="https://solscan.io/tx/${data.result}?cluster=devnet" target="_blank">
                    View Transaction on Solscan
                </a>`;
        }
    } catch (err) {
        document.getElementById("status").textContent = `Request failed: ${err.message}`;
        isRunning = false;
        document.getElementById("startBtn").disabled = false;
    }
}

async function startLoop() {
    const solAddress = document.getElementById("solAddress").value.trim();
    if (!solAddress) {
        alert("Please enter a valid Solana address.");
        return;
    }

    isRunning = true;
    document.getElementById("startBtn").disabled = true;

    while (isRunning) {
        await requestFaucet(solAddress);
        
        if (!isRunning) break;

        let countdown = waitTime / 1000;
        document.getElementById("cooldown").textContent = `Cooldown: ${countdown} seconds`;
        
        while (countdown > 0 && isRunning) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            countdown--;
            document.getElementById("cooldown").textContent = `Cooldown: ${countdown} seconds`;
        }
    }
}
