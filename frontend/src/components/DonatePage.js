import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './DonatePage.css';

const DonatePage = () => {
  const { charityId } = useParams();
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [charity, setCharity] = useState(null);

  useEffect(() => {
    // Fetch charity details based on charityId
    const fetchCharity = async () => {
      try {
        const response = await fetch(`/charities/${charityId}`);
        if (response.ok) {
          const data = await response.json();
          setCharity(data);
        } else {
          console.error('Error fetching charity details');
        }
      } catch (error) {
        console.error('Error fetching charity details:', error);
      }
    };

    fetchCharity();
  }, [charityId]);

  const handleDonate = (e) => {
    e.preventDefault();
    if (paymentMethod === 'paypal') {
      window.location.href = `https://www.paypal.com/donate?business=Aluubinaluu@gmail.com&amount=${amount}`;
    } else if (paymentMethod === 'stripe') {
      console.log('Stripe payment processing...');
    }
  };

  return (
    <div className='donate-page'>
      {charity ? (
        <>
          <h2>Donate to {charity.name}</h2>
          <form onSubmit={handleDonate}>
            <div className='form-group'>
              <label htmlFor='amount'>Donation Amount</label>
              <input
                type='number'
                id='amount'
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <div className='form-group'>
              <label htmlFor='paymentMethod'>Payment Method</label>
              <select
                id='paymentMethod'
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                required
              >
                <option value=''>Select a payment method</option>
                <option value='paypal'>PayPal</option>
                <option value='stripe'>Stripe</option>
              </select>
            </div>
            <button type='submit'>Donate</button>
          </form>
        </>
      ) : (
        <p>Loading charity details...</p>
      )}
    </div>
  );
};

export default DonatePage;
