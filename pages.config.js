export default {
  build: {
    command: "npm run build",
    output: "dist",
  },
  routes: [
    { src: "/api/.*", function: "api" },
    { src: "/(.*)", dest: "/index.html" }
  ],
  functions: {
    "api": {
      runtime: "@cloudflare/workers-runtime",
      memory: 1024,
      maxDuration: 30
    }
  }
}
