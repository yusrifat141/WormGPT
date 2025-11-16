{
  "builds": [
    { "src": "api/ai.js", "use": "@vercel/node" }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "/api/ai.js" },
    { "src": "/", "dest": "/public/index.html" }
  ]
}
