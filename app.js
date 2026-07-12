   const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

   setTimeout(() => {
    document.getElementById('zeusToast').style.opacity = '0';
   }, 4000);

   function playPew() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'square';
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.frequency.setValueAtTime(800, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);
   }

   function playBoom() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const bufferSize = audioCtx.sampleRate * 0.2;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, audioCtx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.2);

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);

    noise.connect(filter).connect(gain).connect(audioCtx.destination);
    noise.start();
   }

   function playThunder() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const bufferSize = audioCtx.sampleRate * 1.5;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, audioCtx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 1.5);

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.8, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.5);

    noise.connect(filter).connect(gain).connect(audioCtx.destination);
    noise.start();
   }
   
   const scoreEl = document.getElementById('scoreEl');
   let score = 0;

   const waveEl = document.getElementById('waveEl');
   let wave = 1;
   let requiredScoreForNextWave = 5;
   let spawnRate = 2500;
   let monsterSpeed = 0.5;
   let spawnerInterval;

   const healthEl = document.getElementById('healthEl');
   const gameOverUI = document.getElementById('gameOverUI');
   let health = 100;
   
   const canvas = document.getElementById('gameCanvas');

   const lightningEl = document.getElementById('lightningEl');
   let lightningReady = true;
   let flashAlpha = 0;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const projectiles = [];
    const treeImg = new Image();
    treeImg.src = 'tree.png';

    const playerImg = new Image();
    playerImg.src = 'dmg.png';

     const monsterImg = new Image();
     monsterImg.src = 'monster.png';

    const enemies = [];

    // --- demigod/ player view--
    class Player {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.angle = 0;
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);

           ctx.drawImage(playerImg, -50, -60, 120, 120);

            ctx.restore();
        }
    }

    const player = new Player(centerX, centerY);

    class Enemy {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = 120;
        }
        update() {
            ctx.drawImage(monsterImg, this.x - this.size/2, this.y - this.size/2, this.size, this.size);

            const angle = Math.atan2(centerY -  this.y, centerX - this.x);
            this.x += Math.cos(angle) * monsterSpeed;
            this.y += Math.sin(angle) * monsterSpeed;
        }
    }
    function checkWave() {
    
            while (score >= requiredScoreForNextWave) {
                wave += 1;
               
                if (wave === 7) {
                    const memePopup = document.getElementById('memePopup');
                    const memeAudio = document.getElementById('memeAudio');

                    memePopup.classList.remove('hidden');
                    memeAudio.currentTime = 0;
                    memeAudio.play();

                    setTimeout(() => {
                        memePopup.classList.add('hidden');
                        memeAudio.pause();
                    }, 3500);
                } 
                if (wave === 18) {
                    const wave18Audio = document.getElementById('wave18Audio');
                    wave18Audio.currentTime = 0;
                    wave18Audio.play();

                    setTimeout(() => {
                    wave18Audio.pause();
                    }, 4000);
                }
                if (wave === 26) {
                    const wave25Audio = document.getElementById('wave25Audio');
                    wave25Audio.currentTime = 0;
                    wave25Audio.play();
                }

                if (wave < 6) {
                    requiredScoreForNextWave += 5;
                } else {
                    requiredScoreForNextWave += 10;
                }

                monsterSpeed += 0.2;
                if (spawnRate > 600) spawnRate -= 400;

                waveEl.innerHTML = `WAVE: ${wave}`;
                spawnEnemies();
            }
        }

    function spawnEnemies() {
         clearInterval(spawnerInterval);
         spawnerInterval = setInterval(() => {
            let x, y;

            if (Math.random() < 0.5) {
                    x = Math.random() < 0.5 ? -50 : canvas.width + 50;
                    y = Math.random() * canvas.height;
                } else {
                    x = Math.random() * canvas.width;
                    y = Math.random() < 0.5 ? -50 : canvas.height + 50;
                }
                enemies.push(new Enemy(x, y));

            }, spawnRate); 
        }

    // --daggersssssss-----
    class Projectile {
        constructor(x, y, velocity) {
            this.x = x;
            this.y = y;
            this.velocity = velocity;
            this.radius = 5;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            ctx.fillStyle = '#ffd700';
            ctx.fill();
        }
        update() {
            this.draw();
            this.x += this.velocity.x;
            this.y += this.velocity.y;
        }
    }

    // -controls--
    window.addEventListener('mousemove', (e) => {

        const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
        player.angle = angle;
    });

    // dagger shootinh 
    let shootInterval;

    function fireDagger() {
        const velocity = {
            x: Math.cos(player.angle) * 8,
            y: Math.sin(player.angle) * 8
        };
        projectiles.push(new Projectile(centerX, centerY, velocity));
        playPew();
    }
    window.addEventListener('mousedown', () => {
        fireDagger();

        shootInterval = setInterval(() => {
            fireDagger();
        }, 80);
    });
    window.addEventListener('mouseup', () => {
              clearInterval(shootInterval);
    })

    const cooldownBar = document.getElementById('cooldownBar');

    window.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && lightningReady) {
             
            lightningReady = false;
            score += enemies.length;
            scoreEl.innerHTML = `Monsters Cooked: ${score}`;
            checkWave();
            enemies.length = 0;
            flashAlpha = 1;
            playThunder();

            cooldownBar.style.transition = 'none';
            cooldownBar.style.width = '0%'

            setTimeout(() => {
                cooldownBar.style.transition = 'width 10s linear';
                cooldownBar.style.width = '100%';
            }, 50);

            setTimeout(() => {
                lightningReady = true;

                const toast = document.getElementById('zeusToast');
                toast.style.opacity = '1';

                setTimeout(() => {
                    toast.style.opacity = '0';
                }, 4000);
            }, 10000);
        }
    });

    // -- game loop -
    function animate() {
       let animationId = requestAnimationFrame(animate);

        ctx.fillStyle = 'rgba(202, 102, 31, 0.4)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgba(34, 197, 94, 0.4)';

        for (let x = 0; x < canvas.width; x += 40) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
        }
        for (let y = 0; y < canvas.height; y += 40) {
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
        }
        ctx.stroke();

        if (flashAlpha > 0) {
            ctx.fillStyle = `rgba(255, 255, 255, ${flashAlpha})`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            flashAlpha -= 0.05;
        }

        ctx.drawImage(treeImg, centerX -250, centerY -250, 500, 500);

        player.draw();

        projectiles.forEach((proj, index) => {
            proj.update();

            if(proj.x < 0 || proj.x > canvas.width || proj.y < 0 || proj.y > canvas.height) {
                projectiles.splice(index, 1);
            }
        });
        enemies.forEach((enemy, enemyIndex) => {
            enemy.update();
            projectiles.forEach((proj, projIndex) => {
               const dist = Math.hypot(proj.x - enemy.x, proj.y - enemy.y);

               if (dist - enemy.size / 2 - proj.radius < 1) {
                 projectiles.splice(projIndex, 1);
                 enemies.splice(enemyIndex, 1);

                 score += 1;
                 scoreEl.innerHTML = `Monsters Cooked: ${score}`;
                 playBoom();
                 checkWave();
               }
            });
            const distToTree = Math.hypot(centerX - enemy.x, centerY - enemy.y);
            if (distToTree < 100) {
                enemies.splice(enemyIndex, 1);
                    health -= 20;
                    healthEl.innerHTML = `Tree Health: ${health}%`;
            }
        }); if (health <= 0) {
            healthEl.innerHTML = `Tree's API Credits: 0%`;
            document.getElementById('finalScore').innerText = `Monsters Cooked: ${score}`;
            gameOverUI.classList.remove('hidden');

            cancelAnimationFrame(animationId);

            const gameOverAudio = document.getElementById('gameOverAudio');
            gameOverAudio.currentTime = 0;
            gameOverAudio.play();
            
            setTimeout(() => {
                 gameOverAudio.pause();
            }, 3500);
        }
    }
     spawnEnemies();
    animate();