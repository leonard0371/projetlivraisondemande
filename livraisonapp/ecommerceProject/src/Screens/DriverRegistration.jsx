import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useAddData } from '../api/apiCalls';
import { endPoints } from '../api/api';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Input/Button';
import InputField from '../components/Input/Input';

const DriverRegistration = () => {
  const methods = useForm();
  const navigate = useNavigate();
  const saveOrUpdateUser = useAddData('saveOrUpdateUser');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');
    data.role = 'driver';
    try {
      const response = await saveOrUpdateUser.mutateAsync({
        sendData: data,
        endPoint: endPoints.saveOrUpdateUser,
      });
      if (response?.status === 200) {
        navigate('/login');
        alert('Driver registered successfully! You can now log in.');
      } else {
        setError(response?.response?.data?.error || 'Registration failed. Please try again.');
      }
    } catch (e) {
      setError('An unexpected error occurred. Please try again.');
      console.error(e);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex justify-center items-center" style={{ background: '#f5f5f5' }}>
      <div className="bg-white rounded-2xl p-8 w-[500px] shadow-lg">
        <h2 className="text-2xl font-normal mb-8">Driver Registration</h2>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
            <InputField name="firstName" placeholder="Full Name" required className="w-full" />
            <InputField name="email" type="email" placeholder="Email" required className="w-full" />
            <InputField name="password" type="password" placeholder="Password" required className="w-full" />
            <InputField name="contactNumber" placeholder="Phone Number" required className="w-full" />
            <InputField name="address" placeholder="Address" required className="w-full" />
            <InputField name="carMake" placeholder="Car Make" required className="w-full" />
            <InputField name="carModel" placeholder="Car Model" required className="w-full" />
            <InputField name="carYear" placeholder="Car Year" required className="w-full" />
            <InputField name="licensePlate" placeholder="License Plate" required className="w-full" />
            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
            <Button text={isLoading ? 'Registering...' : 'Register'} type="submit" isLoading={isLoading} />
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default DriverRegistration; 