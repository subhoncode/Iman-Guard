chrome.history.onVisited.addListener((item) => {
    if (item.url && item.url.includes('blocked.html')) {
        
        const twoSecondsAgo = Date.now() - 2000;
        const now = Date.now() + 1000;

        chrome.history.deleteRange({
            startTime: twoSecondsAgo,
            endTime: now
        }, () => {
            console.log("Last 2 seconds of history purged.");
        });
    }
});