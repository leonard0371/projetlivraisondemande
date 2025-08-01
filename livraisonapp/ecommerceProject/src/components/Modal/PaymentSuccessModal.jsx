import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import "./../../App.css";

const PaymentSuccessModal = ({ showModal, onCloseModal, orderDetails }) => {
  // Fonction pour fermer et supprimer les paramètres URL
  const handleClose = () => {
    // console.log("handleClose exécuté");
    // console.log("Onclose", onCloseModal);
    onCloseModal(); // Fermer le modal d'abord
    setTimeout(() => {
      // console.log("Suppression des paramètres URL");
      const url = new URL(window.location);
      url.searchParams.delete("success");
      url.searchParams.delete("orderId");
      window.history.replaceState({}, "", url);  // Met à jour l'URL sans recharger la page
    }, 100);
  };

  return (
    <Modal
      show={showModal}
      onHide={handleClose}  // Appelle handleClose lors de la fermeture
      centered
      className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center"
    >
      <Modal.Header closeButton>
        <Modal.Title>Paiement Réussi !</Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-white p-5 rounded-lg text-center">
        {orderDetails ? (
          <>
            {/* Message de remerciement */}
            <p>Merci pour votre commande ! Votre paiement a été effectué avec succès.</p>

            {/* Détails de la commande */}
            <p><strong>Email client :</strong> {orderDetails.customer_email}</p>
            <h2><strong>Détails de la commande :</strong></h2>
            <ul>
              {orderDetails.items?.map((item, index) => (
                <li key={index}>
                  {item.name} - {item.quantity} x {item.price?.$numberDecimal}
                </li>
              ))}
            </ul>
            <p><strong>Total :</strong> {orderDetails.total_amount?.$numberDecimal} {orderDetails.currency?.toUpperCase()}</p>

            {/* Message de confirmation pour la facture */}
            <p>Un e-mail avec la facture a été envoyé à {orderDetails.customer_email}.</p>
          </>
        ) : (
          <p>Chargement des détails de la commande...</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Fermer
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PaymentSuccessModal;
