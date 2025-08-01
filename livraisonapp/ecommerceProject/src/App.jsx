import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
// import "react-image-gallery/styles/scss/image-gallery.scss";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider, useSelector } from "react-redux";
import { store } from "./redux/store";
import 'rsuite/dist/rsuite-no-reset.min.css';
import Layout from "./components/layout/Layout";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";
// import { roles } from "./Enums";

// console.log(roles,"5f4adddd68awf4wa6f4a")
const queryClient = new QueryClient();


// ✅ Composant simple pour la page de maintenance
const MaintenancePage = () => (
  <div style={{ textAlign: "center", marginTop: "20%" }}>
    <h1>🛠️ Site en maintenance</h1>
    <p>Nous revenons très vite !</p>
    <p style={{ fontSize: "0.9rem", color: "#888" }}>
      Ajoutez <code>?dev=true</code> dans l’URL si vous êtes développeur.
    </p>
  </div>
);


function App() {
  const [loading, setLoading] = useState(true);
  const [isMaintenance, setIsMaintenance] = useState(false);

  useEffect(() => {
    const checkMaintenance = async () => {
      try {
        const baseUrl = import.meta.env.VITE_APP_API_URL;
        const url = `${baseUrl}/api/maintenance${window.location.search}`;
        const res = await axios.get(url);
        console.log("url :", url, "response", res);
        setIsMaintenance(res.data.maintenance);
      } catch (err) {
        console.error("Erreur vérification maintenance :", err);
        setIsMaintenance(false); // Si erreur, on affiche le site
      } finally {
        setLoading(false);
      }
    };

    checkMaintenance();
  }, []);

  if (loading) return <p>Chargement...</p>;

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            {isMaintenance ? (
              // ✅ Toute route affichera la page maintenance
              <Route path="*" element={<MaintenancePage />} />
            ) : (
              // ✅ Sinon, on affiche le layout principal
              <Route path="*" element={<Layout />} />
            )}
          </Routes>
        </Router>
        {/* <ReactQueryDevtools initialIsOpen={false} client={queryClient} /> */}
      </QueryClientProvider>
    </Provider>
  );
}

export default App;