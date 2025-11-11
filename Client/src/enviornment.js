let IS_PRODUCTION = false;

const server = IS_PRODUCTION
    ? "https://codebuddy-fgyi.onrender.com"
    : "http://localhost:8080";

export default server;
