const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const port = Number(process.env.PORT || 4173);

const mimeTypes = {
    ".css": "text/css; charset=utf-8",
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon"
};

function resolveRequest(url) {
    const parsed = new URL(url, `http://localhost:${port}`);
    const decoded = decodeURIComponent(parsed.pathname);
    const normalized = path.normalize(decoded).replace(/^(\.\.[/\\])+/, "");
    let filePath = path.join(root, normalized);

    if (decoded.endsWith("/")) {
        filePath = path.join(filePath, "index.html");
    }

    if (!path.extname(filePath)) {
        filePath = `${filePath}.html`;
    }

    return filePath;
}

const server = http.createServer((request, response) => {
    const filePath = resolveRequest(request.url || "/");

    if (!filePath.startsWith(root)) {
        response.writeHead(403);
        response.end("Forbidden");
        return;
    }

    fs.readFile(filePath, (error, content) => {
        if (error) {
            response.writeHead(error.code === "ENOENT" ? 404 : 500, {
                "Content-Type": "text/plain; charset=utf-8"
            });
            response.end(error.code === "ENOENT" ? "Not found" : "Server error");
            return;
        }

        response.writeHead(200, {
            "Content-Type": mimeTypes[path.extname(filePath)] || "application/octet-stream",
            "Cache-Control": "no-store"
        });
        response.end(content);
    });
});

server.listen(port, () => {
    console.log(`Autocamp Free Star dev server: http://localhost:${port}`);
});
