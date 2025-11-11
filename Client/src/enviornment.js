let IS_PRODUCTION = true;

const server = IS_PRODUCTION
    ? "https://codebuddy-fgyi.onrender.com"
    : "http://localhost:8080";

export default server;
