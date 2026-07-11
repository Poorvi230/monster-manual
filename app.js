   const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const projectiles = [];
    const treeImg = new Image();
    treeImg.src = 'tree.jpg';

    const playerImg = new Image();
    playerImg.src = 'dmg.webp';

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

           ctx.drawImage(playerImg, -45, -45, 90, 90);

            ctx.restore();
        }
    }

    const player = new Player(centerX, centerY);

    class Enemy {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = 80;
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
        }, 2500);
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
        requestAnimationFrame(animate);

        ctx.fillStyle = 'rgba(249, 115, 22, 0.4)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(treeImg, centerX -250, centerY -250, 500, 500);

        player.draw();

        projectiles.forEach((proj, index) => {
            proj.update();

            if(proj.x < 0 || proj.x > canvas.width || proj.y < 0 || proj.y > canvas.height) {
                projectiles.splice(index, 1);
            }
        });
        enemies.forEach(enemy => {
            enemy.update();
        });
    }
     spawnEnemies();
    animate();