module.exports = {
  apps: [
    {
      name: "kreator-wymowek",
      script: "npm",
      args: "start -- -p 3000",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
