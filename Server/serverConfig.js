let IS_PRODUCTION = true;

const server = IS_PRODUCTION
    ? "https://codebuddy-zzlu.onrender.com"
    : "http://localhost:5173";

export default server;
