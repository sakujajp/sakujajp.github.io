document.addEventListener('DOMContentLoaded', () => {
    const spinButton = document.getElementById('spinButton');
    const digits = [
        document.getElementById('digit1'),
        document.getElementById('digit2'),
        document.getElementById('digit3'),
        document.getElementById('digit4')
    ];

    // Audio elements
    const spinSound = document.getElementById('spinSound');
    const winSound = document.getElementById('winSound');
    const tickSound = document.getElementById('tickSound');

    // Điều chỉnh âm lượng
    spinSound.volume = 0.5;
    winSound.volume = 0.6;
    tickSound.volume = 0.3;

    // Particle system
    function createParticle() {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = '20px';
        particle.style.height = '20px';
        particle.style.backgroundImage = 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'%23FFD700\'%3E%3Ccircle cx=\'12\' cy=\'12\' r=\'10\'/%3E%3C/svg%3E")';
        particle.style.backgroundSize = 'contain';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = -20 + 'px';
        particle.style.animation = `float ${3 + Math.random() * 2}s linear infinite`;
        document.querySelector('.particles').appendChild(particle);

        setTimeout(() => {
            particle.remove();
        }, 5000);
    }

    // Create particles periodically
    setInterval(createParticle, 1000);

    function createFirework(startX, startY, endX, endY) {
        const colors = ['#FFD700', '#FF69B4', '#00FF00', '#4169E1', '#FF4500'];
        const firework = document.createElement('div');
        firework.className = 'firework';
        firework.style.left = startX + 'px';
        firework.style.top = startY + 'px';
        firework.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        document.body.appendChild(firework);

        // Animation để di chuyển pháo hoa từ điểm bắt đầu đến điểm nổ
        const duration = 500;
        const startTime = performance.now();

        function animateFirework(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const currentX = startX + (endX - startX) * progress;
            const currentY = startY + (endY - startY) * progress;

            firework.style.left = currentX + 'px';
            firework.style.top = currentY + 'px';

            if (progress < 1) {
                requestAnimationFrame(animateFirework);
            } else {
                // Tạo hiệu ứng nổ
                createExplosion(endX, endY);
                firework.remove();
            }
        }

        requestAnimationFrame(animateFirework);
    }

    function createExplosion(x, y) {
        const colors = ['#FFD700', '#FF69B4', '#00FF00', '#4169E1', '#FF4500'];
        const particleCount = 20;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'firework-particle';
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

            // Random hướng bay
            const angle = (i * (360 / particleCount)) + Math.random() * 20;
            const distance = 100 + Math.random() * 100;
            const tx = Math.cos(angle * Math.PI / 180) * distance;
            const ty = Math.sin(angle * Math.PI / 180) * distance;

            particle.style.setProperty('--tx', `${tx}px`);
            particle.style.setProperty('--ty', `${ty}px`);

            document.body.appendChild(particle);

            // Xóa particle sau khi animation kết thúc
            setTimeout(() => particle.remove(), 1000);
        }
    }

    function createFireworks() {
        const containerRect = document.querySelector('.container').getBoundingClientRect();
        const centerY = containerRect.top + containerRect.height / 2;
        const centerX = containerRect.left + containerRect.width / 2;

        // Tạo 3 đợt pháo hoa
        for(let wave = 0; wave < 3; wave++) {
            const baseDelay = wave * 1500; // Mỗi đợt cách nhau 1.5 giây
            
            // Mỗi đợt có nhiều pháo hoa với thời gian delay khác nhau
            const fireworks = [
                { startX: 0, startY: window.innerHeight, endX: centerX - 200, endY: centerY, delay: baseDelay + 0 },
                { startX: window.innerWidth, startY: window.innerHeight, endX: centerX + 200, endY: centerY, delay: baseDelay + 200 },
                { startX: 0, startY: window.innerHeight, endX: centerX - 100, endY: centerY - 100, delay: baseDelay + 400 },
                { startX: window.innerWidth, startY: window.innerHeight, endX: centerX + 100, endY: centerY - 100, delay: baseDelay + 600 },
                // Thêm pháo hoa ở giữa cho mỗi đợt
                { startX: window.innerWidth / 2, startY: window.innerHeight, endX: centerX, endY: centerY - 150, delay: baseDelay + 300 }
            ];

            fireworks.forEach(fw => {
                setTimeout(() => {
                    createFirework(fw.startX, fw.startY, fw.endX, fw.endY);
                }, fw.delay);
            });
        }
    }

    function generateRandomNumber() {
        // Random từ 1 đến 3000
        const result = Math.min(Math.floor(Math.random() * 3000) + 1, 3000);
        // Log để kiểm tra kết quả
        console.log('Số random được tạo:', result);
        // Chuyển số thành chuỗi và thêm số 0 ở đầu nếu cần
        return result.toString().padStart(4, '0');
    }

    function getDigitAtPosition(number, position) {
        // Đảm bảo số luôn có 4 chữ số bằng cách thêm 0 vào đầu
        const paddedNumber = number.padStart(4, '0');
        // Lấy chữ số từ trái sang phải theo vị trí
        return paddedNumber.charAt(position);
    }

    function animateNumber(element, finalNumber) {
        let current = 0;
        const duration = 3500; // 3.5 giây
        const steps = 35;
        const interval = duration / steps;
        let stepCount = 0;

        const animation = setInterval(() => {
            stepCount++;
            current = Math.floor(Math.random() * 10).toString();
            element.textContent = current;

            // Phát âm thanh tick với tần suất thấp hơn để tránh quá ồn
            if (stepCount % 3 === 0) {
                tickSound.currentTime = 0;
                tickSound.volume = 0.3; // Giảm âm lượng
                tickSound.play();
            }

            // Khi gần kết thúc, tăng khả năng hiện số cuối cùng
            if (stepCount > steps * 0.8 && Math.random() < 0.3) {
                current = finalNumber;
            }

            if (stepCount >= steps) {
                clearInterval(animation);
                element.textContent = finalNumber;
            }
        }, interval);
    }

    function spin() {
        spinButton.disabled = true;
        spinButton.textContent = 'ĐANG QUAY...';

        // Phát âm thanh bắt đầu quay
        spinSound.currentTime = 0;
        spinSound.play();

        // Generate one random number between 1-3000
        const finalNumber = generateRandomNumber();

        // Animate all digits simultaneously
        digits.forEach((digit, index) => {
            animateNumber(digit, getDigitAtPosition(finalNumber, index));
        });

        // Enable button after animation
        setTimeout(() => {
            spinButton.disabled = false;
            spinButton.textContent = 'QUAY SỐ';
            
            // Phát âm thanh chiến thắng
            winSound.currentTime = 0;
            winSound.play();

            // Create celebration particles
            for (let i = 0; i < 20; i++) {
                setTimeout(createParticle, i * 100);
            }

            // Bắn pháo hoa
            createFireworks();

            // Log kết quả
            console.log('Số trúng thưởng:', parseInt(finalNumber));
        }, 6500); // Tăng thời gian chờ tổng thể
    }

    spinButton.addEventListener('click', spin);
});
