import React, { useEffect } from 'react';
import { useGetAllData, usePatchData } from '../api/apiCalls';
import Button from '../components/Input/Button';
import { useNavigate } from 'react-router-dom';

const DriverDashboard = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem('Role');
  const { data: deliveries = [], isLoading, refetch } = useGetAllData('availableDeliveries', '/api/deliveries/available');
  const acceptDelivery = usePatchData('acceptDelivery');

  useEffect(() => {
    if (role !== 'driver') {
      navigate('/login');
    }
  }, [role, navigate]);

  const handleAccept = (deliveryId) => {
    acceptDelivery.mutate(
      { endPoint: `/api/deliveries/${deliveryId}/accept` },
      {
        onSuccess: () => {
          refetch();
        },
      }
    );
  };

  if (isLoading) return <p>Loading available deliveries...</p>;

  return (
    <div className="container" style={{ paddingTop: '100px', paddingBottom: '2rem' }}>
      <div className="p-5 mb-4 bg-light rounded-3">
        <div className="container-fluid py-5">
          <h1 className="display-5 fw-bold">Driver Dashboard</h1>
          <p className="col-md-8 fs-4">
            Welcome, {JSON.parse(localStorage.getItem('LoggedUser'))?.user?.firstName || 'Driver'}! Ready to hit the road?
          </p>
        </div>
      </div>
      <h2>Available Deliveries</h2>
      {deliveries.length > 0 ? (
        <div className="list-group">
          {deliveries.map((delivery) => (
            <div key={delivery._id} className="list-group-item list-group-item-action flex-column align-items-start mb-3 border rounded">
              <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1">Delivery to {delivery.clientName}</h5>
                <small>{new Date(delivery.requestTimestamp).toLocaleString()}</small>
              </div>
              <p className="mb-1"><strong>From:</strong> {delivery.pickupAddress}</p>
              <p className="mb-1"><strong>To:</strong> {delivery.deliveryAddress}</p>
              <p className="mb-1"><strong>Package:</strong> {delivery.productDetails}</p>
              <Button 
                text="Accept Delivery" 
                onClick={() => handleAccept(delivery._id)}
                disabled={acceptDelivery.isLoading}
                className="btn btn-success mt-2"
              />
            </div>
          ))}
        </div>
      ) : (
        <div style={{ marginTop: '2rem', color: '#888', border: '1px dashed #ccc', padding: '2rem', borderRadius: '8px' }}>
          <em>No available deliveries at the moment.</em>
        </div>
      )}
    </div>
  );
};

export default DriverDashboard; 