document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('alertAudio');
    
    document.body.addEventListener('click', () => {
        audio.play().catch(e => console.log("Audio error:", e));
    });

    audio.play().catch(() => {
        console.log("Autoplay blocked. Enable sound on page.");
    });
});