const emoji = document.getElementById('emoji');
const btnStart = document.getElementById('btnStart');
const btnStop = document.getElementById('btnStop');
const btnLaunch = document.getElementById('btnLaunch');

let isSpinning = false;
let currentAngle = 0;
let animationId = null;
let lastFrameTime = null;
let isLaunching = false;
let launchAnimationId = null;
let positionX = 0;
let positionY = 0;

btnStart.addEventListener('click', () => {
    if (!isSpinning) {
        isSpinning = true;
        lastFrameTime = performance.now();
        animate();
    }
});

btnStop.addEventListener('click', () => {
    if (isSpinning) {
        isSpinning = false;
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
        // Mantener el ángulo actual exacto
        emoji.style.transform = `rotate(${currentAngle}deg)`;
    }
});

btnLaunch.addEventListener('click', () => {
    if (!isLaunching && !isSpinning) {
        isLaunching = true;
        launchRocket();
    }
});

function animate() {
    if (!isSpinning) return;
    
    const currentTime = performance.now();
    const deltaTime = currentTime - lastFrameTime;
    lastFrameTime = currentTime;
    
    // Calcular el incremento de ángulo basado en el tiempo delta
    // 360 grados en 2000ms = 0.18 grados por ms
    const angleIncrement = (deltaTime / 2000) * 360;
    currentAngle = currentAngle + angleIncrement;
    
    // Aplicar la rotación al emoji
    emoji.style.transform = `rotate(${currentAngle}deg)`;
    
    animationId = requestAnimationFrame(animate);
}

function launchRocket() {
    // Calcular la dirección basada en el ángulo actual
    // El emoji 🚀 normalmente apunta hacia arriba en 0 grados
    // Convertir ángulo a radianes para cálculos trigonométricos
    const angleInRadians = (currentAngle - 45) * (Math.PI / 180); // -45 ajuste de dirección
    
    positionX = 0;
    positionY = 0;
    const speed = 5; // Velocidad de lanzamiento
    let launchStartTime = performance.now();
    
    function animateLaunch() {
        if (!isLaunching) return;
        
        const currentTime = performance.now();
        const deltaTime = currentTime - launchStartTime;
        launchStartTime = currentTime;
        
        // Calcular el movimiento en la dirección de la punta
        positionX += Math.cos(angleInRadians) * speed;
        positionY += Math.sin(angleInRadians) * speed;
        
        // Aplicar el movimiento (rotación + traslación)
        emoji.style.transform = `translate(${positionX}px, ${positionY}px) rotate(${currentAngle}deg)`;
        
        // Verificar si el cohete salió de la pantalla
        const rect = emoji.getBoundingClientRect();
        const isVisible = (
            rect.bottom > 0 &&
            rect.right > 0 &&
            rect.top < window.innerHeight &&
            rect.left < window.innerWidth
        );
        
        if (isVisible) {
            launchAnimationId = requestAnimationFrame(animateLaunch);
        } else {
            // El cohete desapareció, reiniciar al centro
            resetRocket();
        }
    }
    
    launchAnimationId = requestAnimationFrame(animateLaunch);
}

function resetRocket() {
    isLaunching = false;
    positionX = 0;
    positionY = 0;
    emoji.style.transform = `rotate(${currentAngle}deg)`;
    emoji.style.opacity = '0';
    
    // Pequeña pausa antes de reaparecer
    setTimeout(() => {
        emoji.style.opacity = '1';
        emoji.style.transform = `rotate(${currentAngle}deg)`;
    }, 500);
}
