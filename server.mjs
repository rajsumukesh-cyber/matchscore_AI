import { preview } from "vite";

const port = parseInt(process.env.PORT || "3000", 10);

console.log(`[production-server] Starting preview server on 0.0.0.0:${port}...`);

try {
  const previewServer = await preview({
    preview: {
      port,
      host: "0.0.0.0",
      strictPort: false,
    },
  });

  previewServer.printUrls();
  console.log(`[production-server] Successfully listening on port ${port}`);
} catch (err) {
  console.error("[production-server] Failed to start server:", err);
  process.exit(1);
}
