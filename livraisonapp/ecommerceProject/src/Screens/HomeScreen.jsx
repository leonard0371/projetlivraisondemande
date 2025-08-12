// import potteryImg from "../../public/potteryartisanmontreal.png";
// import heroImg from "../../public/heroimg.webp";
import React from 'react';
import potteryImg from "../assets/potteryartisanmontreal.jpg";
// import heroImg from "../../public/heroimg.webp";
import heroImg from "../assets/heroimg.webp";

import { useNavigate } from 'react-router-dom';


const HomeScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="text-center py-20 px-4 bg-gray-50 relative">
        <div className="absolute inset-0 bg-cover bg-center pointer-events-none" style={{ backgroundImage: `url(${heroImg})`, opacity: 0.3 }}/>  
        <h1 className="text-5xl font-bold mb-4 relative z-10">Montreal Livraison Express</h1>
        <p className="text-xl text-gray-600 mb-8 relative z-10">Découvrir des produits dans le Grand Montréal.</p>
        <button className="bg-blue-900 text-white px-8 py-3 rounded-lg hover:bg-blue-500 transition relative z-10" onClick={() => navigate('/Products')}>
          REJOINDRE NOTRE MARKETPLACE
        </button>
      </div>

      {/* Info Section test */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold mb-8">C'EST QUOI MONTREAL LIVRAISON EXPRESS?</h2>
            <div>
              <h3 className="text-2xl font-semibold mb-4">Comment ça fonctionne?</h3>
              <ol className="space-y-4 list-decimal list-inside text-gray-700">
                <li>Explorer - Explorer des produits uniquement Montréalais</li>
                {/* <li>Connect - Find unique items made right here in our city</li> */}
                <li>Supporter l'achat local</li>
                <li>Recevez vos articles instantanément dû à nos livreurs stratégiquement positionnés pour diminuer le délai de livraison en ayant un stcok de produit prédictif et prédéterminé par nos analyses de la demande</li>
              </ol>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <img src={potteryImg} alt="Montreal artisans at work" className="rounded-lg shadow-lg" />
          </div>
        </div>

        {/* Exclusivity Section */}
        <div className="max-w-5xl mx-auto px-6 py-12 bg-blue-50 rounded-lg shadow-md mt-8">
          <h2 className="text-3xl font-bold text-center mb-4">Exclusivement oprationnel dans le Grand Montréal</h2>
          <p className="text-lg text-gray-700 text-center">
          Ce focus nous permet d'être d'opérer efficacement en minimisant l'impact environnemental et faciliter la rapidité à laquelle vous recevez vos articles.
          {/* <br/>
          We appreciate your support in helping us keep this a truly local experience!
          <br/><br/>
          We also welcome partnerships with Montreal-based businesses—whether in delivery logistics, marketing, or other areas. 
          <br/>
          At Montreal Haven, we’re always open to collaboration and mutual growth. */}
          </p>
        </div>

        <div className="mt-16">
          <h3 className="text-3xl font-bold mb-8 text-center">À Montreal, pour tout le monde</h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
            <li className="flex items-start space-x-2">
              <svg className="w-6 h-6 text-blue-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Découvrir des produits Montréalais authentique</span>
            </li>
            <li className="flex items-start space-x-2">
              <svg className="w-6 h-6 text-blue-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Se connecter avec des artisans locaux</span>
            </li>
            {/* <li className="flex items-start space-x-2">
              <svg className="w-6 h-6 text-blue-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Support sustainable, local production</span>
            </li>
            <li className="flex items-start space-x-2">
              <svg className="w-6 h-6 text-blue-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Experience the unique craftsmanship of Montreal</span>
            </li> */}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;