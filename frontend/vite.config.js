import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

//ADDING A PROXY CONFIGURATION IN VITE IS NECESSAEY WHEN YOU WANT TO MAKE REQUEST TO AN EXTERNAL SERCER FROM YOUR DEVELOPMENT ENVIRONMENT IT ALLOWS TO AVOID ISSUES RELATED TO CORS BY REDIRECTING REQUEST TO ANOTHER SERVER

// By adding this proxy configuration, you can make requests to http://localhost:3000/api from your frontend code, and Vite will transparently forward those requests to http://localhost:3006, allowing you to avoid CORS issues during development. This is particularly useful when your backend and frontend are served from different ports or domains during development.

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    //get rid of the cors error
    proxy: {
      "/api": {
        target: "http://localhost:3006",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
