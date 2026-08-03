const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");

const files = [
    "index.html",
    "galerie.html",
    "gdpr.html",
    "kalendar.html",
    "ubytovaci-rad.html",
    "planek-kempu.html",
    "assets/css/styles.css",
    "assets/js/main.js",
    ".htaccess",
    "sitemap.xml",
    "robots.txt"
];

const directories = [
    "assets/img"
];

fs.rmSync(dist, { recursive: true, force: true });

for (const file of files) {
    const source = path.join(root, file);
    const target = path.join(dist, file);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(source, target);
}

for (const directory of directories) {
    const source = path.join(root, directory);
    const target = path.join(dist, directory);
    if (fs.existsSync(source)) {
        fs.cpSync(source, target, { recursive: true });
    }
}

console.log(`Production files prepared in ${dist}`);
