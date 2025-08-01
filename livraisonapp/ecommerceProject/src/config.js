// const config = {
//     API_URL: process.env.VITE_APP_API_URL || "http://localhost:443",
//   };
  
//   console.log("Config API_URL:", config.API_URL);

//   export default config;
  
const config = {
  API_URL: import.meta.env.VITE_APP_API_URL || "http://localhost:443",
};


export default config;
