   const scoreEl = document.getElementById('scoreEl');
   let score = 0;

   const healthEl = document.getElementById('healthEl');
   const gameOverUI = document.getElementById('gameOverUI');
   let health = 100;
   
   const canvas = document.getElementById('gameCanvas');
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
            this.x += Math.cos(angle) * 0.5;
            this.y += Math.sin(angle) * 0.5;
        }
    }
    function spawnEnemies() {
        setInterval(() => {
            let x, y;

            if (Math.random() < 0.5) {
                x = Math.random() < 0.5 ? -50 : canvas.width + 50;
                y = Math.random() * canvas.height;
            } else {
                x = Math.random() * canvas.width;
                y = Math.random() < 0.5 ? -50 : canvas.height + 50;
            }
            enemies.push(new Enemy(x, y));
        }, 900);
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
    window.addEventListener('click', (e) => {
        const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
       
        const velocity = {
            x: Math.cos(angle) * 8, // itsspeed
            y: Math.sin(angle) * 8
        };
        projectiles.push(new Projectile(centerX, centerY, velocity));
    });

    // -- game loop -
    function animate() {
       let animationId = requestAnimationFrame(animate);

        ctx.fillStyle = 'rgba(249, 115, 22, 0.4)';
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
               }
            });
            const distToTree = Math.hypot(centerX - enemy.x, centerY - enemy.y);
            if (distToTree < 100) {
                enemies.splice(enemyIndex, 1);
                    health -= 20;
                    healthEl.innerHTML = `Tree Health: ${health}%`;

                    if (health <= 0) {
                        healthEl.innerHTML = `Tree's API Credits: 0%`;
                        document.getElementById('finalScore').innerText = `Monster Cooked: ${score}`;
                        gameOverUI.classList.remove('hidden');

                        cancelAnimationFrame(animationId);
                    }
            }
        });
    }
     spawnEnemies();
    animate();