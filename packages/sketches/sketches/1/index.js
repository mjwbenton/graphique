"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sketch = void 0;
const seed_random_1 = __importDefault(require("seed-random"));
const simplex_noise_1 = __importDefault(require("simplex-noise"));
const LARGEST_RADIUS = 1000;
const CIRCLE_POINTS = 720;
const SMALLEST_RADIUS = 400;
function linearScale(value, [currmin, currmax], [newmin, newmax]) {
    const percent = (value - currmin) / (currmax - currmin);
    return (newmax - newmin) * percent + newmin;
}
const A = 200;
const SCALING_MAX = 180 ** 2 * A;
const SCALING_MIN = 0;
function noiseScale(degrees) {
    const degFromZero = degrees <= 180 ? degrees : 360 - degrees;
    return Math.min(1, linearScale(degFromZero ** 2 * A, [SCALING_MIN, SCALING_MAX], [0, A]));
}
function sketch({ canvas, seed, }) {
    const ctx = canvas.getContext("2d");
    const random = seed_random_1.default(seed);
    const noise = new simplex_noise_1.default(random);
    function scaledRandom(min, max) {
        return linearScale(random(), [0, 1], [min, max]);
    }
    const numberOfCircles = Math.floor(scaledRandom(5, 30));
    const distanceBetweenCircles = (LARGEST_RADIUS - SMALLEST_RADIUS) / numberOfCircles;
    const maxNoiseOffset = scaledRandom(distanceBetweenCircles / 5, distanceBetweenCircles / 0.5);
    const minNoiseOffset = maxNoiseOffset * -1;
    function pointsForCircle(radius, [centerx, centery]) {
        return [...Array(CIRCLE_POINTS).keys()].map((point) => {
            const deg = linearScale(point, [0, CIRCLE_POINTS], [0, 360]);
            const noiseIndexDegs = (deg + radius) % 360;
            const radians = deg * (Math.PI / 180);
            const noisyRadius = radius +
                linearScale(noise.noise2D(noiseIndexDegs * 0.06, radius), [-1, 1], [minNoiseOffset, maxNoiseOffset]) *
                    noiseScale(noiseIndexDegs);
            const x = Math.sin(radians) * noisyRadius + centerx;
            const y = Math.cos(radians) * noisyRadius + centery;
            return [x, y];
        });
    }
    // Off-white background
    ctx.fillStyle = `hsl(${scaledRandom(0, 360)}, 30%, 95%)`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Rings
    const baseColor = scaledRandom(0, 360);
    const saturation = scaledRandom(30, 90);
    [...Array(numberOfCircles).keys()].forEach((i) => {
        const radius = LARGEST_RADIUS - i * distanceBetweenCircles;
        ctx.fillStyle = `hsl(${baseColor}, ${saturation}%, ${linearScale(radius, [SMALLEST_RADIUS, LARGEST_RADIUS], [40, 90])}%)`;
        ctx.beginPath();
        pointsForCircle(radius, [canvas.width / 2, canvas.height / 2]).forEach(([x, y]) => {
            ctx.lineTo(x, y);
        });
        ctx.closePath();
        ctx.fill();
    });
    // Sign
    const sign = `mattb / 1 / ${seed}`;
    ctx.font = "40px Fira Code";
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    const { width } = ctx.measureText(sign);
    ctx.fillText(sign, canvas.width - (50 + width), canvas.height - 50);
}
exports.sketch = sketch;
//# sourceMappingURL=index.js.map