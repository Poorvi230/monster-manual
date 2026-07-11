const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const centerX = canvas.innerWidth / 2;
const centerY = canvas.innerheight / 2;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

//--blueprint classes--
class Player {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();

        ctx.lineWidth = 4;
        ctx.strokeStyle = '#c5832b'
        ctx.stroke();
    }
}
const player = new Player(centerX, centerY, 20, 'white');

function animate() {
requestAnimationFrame(animate);

ctx.fillStyle = 'rgba(5, 5, 16, 1)';
ctx.fillRect(0, 0, canvas.width, canvas,height);
player.draw();
}