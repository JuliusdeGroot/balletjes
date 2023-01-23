const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

canvas.width = canvas.clientWidth
canvas.height = canvas.clientHeight


let mouse = {
    x: undefined, y: undefined, radius: (canvas.height / 70) * (canvas.width / 70)
}

window.addEventListener('mousemove', (e) => { mouse.x = e.x; mouse.y = e.y })

const ease = t => t + (1 - t) * (1 - Math.cos(t * frequency * 2 * Math.PI))

let particlesArray;

class Particle {
    constructor(x, y, size, color) {
        this.x = x
        this.y = y
        this.size = size
        this.color = color
        this.homeX = x
        this.homeY = y
        this.destination;
        this.time = 0
    }

    draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color
        ctx.globalAlpha = 0.8
        ctx.fill()
    }

    update() {
        let distance = getDistance(this.homeX, this.homeY, mouse.x, mouse.y)
        this.time = 1

        if (distance < mouse.radius) {
            this.destination = closestPointOnCircleEdge({ x: mouse.x, y: mouse.y }, { x: this.homeX, y: this.homeY }, mouse.radius)

            if (this.x <= this.destination.x) {
                this.x += this.time
            }
            if (this.x > this.destination.x) {
                this.x -= this.time
            }
            if (this.y <= this.destination.y) {
                this.y += this.time
            }
            if (this.y > this.destination.y) {
                this.y -= this.time
            }
        }
        else {
            this.time = 1
            if (this.x <= this.homeX) {
                this.x += this.time
            }
            if (this.x > this.homeX) {
                this.x -= this.time
            }
            if (this.y <= this.homeY) {
                this.y += this.time
            }
            if (this.y > this.homeY) {
                this.y -= this.time
            }
        }

        if (this.x !== this.homeX || this.y !== this.homeY) {
            this.color = 'green'
        }
        else{
            this.color = 'green'
        }

        this.draw()
    }
}

function closestPointOnCircleEdge(A, B, r) {
    const a1 = B.x - A.x;
    const b1 = (B.x - A.x) ** 2 + (B.y - A.y) ** 2;

    let x = A.x + r * (a1 / Math.sqrt(b1));

    const a2 = B.y - A.y;
    const b2 = (B.x - A.x) ** 2 + (B.y - A.y) ** 2;

    let y = A.y + r * (a2 / Math.sqrt(b2));

    const C = { x, y };

    return C;
}

function getDistance(x1, y1, x2, y2) {
    let y = x2 - x1;
    let x = y2 - y1;

    return Math.sqrt(x * x + y * y);
}

function animate() {
    requestAnimationFrame(animate)
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update()
    }
}

function init() {
    particlesArray = []
    let size = 3
    let margin = 6
    let color = '#72cc50'

    for (let x = 0; x < (canvas.width / size); x++) {
        for (let y = 0; y < canvas.height / size; y++) {
            let xpos = x * (size) + x * margin
            let ypos = y * (size) + y * margin
            particlesArray.push(new Particle(xpos, ypos, size, color))
        }
    }

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].draw()
    }
}

window.addEventListener('mouseout', () => {
    mouse.x = undefined
    mouse.y = undefined
})

init()
animate()