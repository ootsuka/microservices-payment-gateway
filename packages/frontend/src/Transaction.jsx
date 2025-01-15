import React from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51Qh3JyAxd8KJKZKwfUxn5iRjZHWxJr7kglvMfFdmokUI3UR3gbsPa9ehJwLHGpMyRgXEMxKJ5zRVsLUKwiaBqNb700yrt2yQ2x'); // Replace with your test public key

const Transaction = () => {
    const token = localStorage.getItem('authToken')
    const handleCheckout = async () => {
        try {
            const stripe = await stripePromise;

            // Make a request to your backend to create a Stripe Checkout session
            const response = await fetch('/api/transactions/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    userId: 1,
                    amount: 1,
                    type: 'credit',
                    currency: 'rmb',
                }),
            });

            const session = await response.json();

            // Redirect to Stripe Checkout
            const result = await stripe.redirectToCheckout({
                sessionId: session.sessionId,
            });

            if (result.error) {
                console.error(result.error.message);
            }
        } catch (error) {
            console.error('Error during checkout:', error);
        }
    };

    return (
        <section>
            <div className="product">
                <img
                    src="https://i.imgur.com/EHyR2nP.png"
                    alt="The cover of Stubborn Attachments"
                />
                <div className="description">
                    <h3>Stubborn Attachments</h3>
                    <h5>$20.00</h5>
                </div>
            </div>
            <button id="checkout-button" onClick={handleCheckout}>
                Pay
            </button>
        </section>
    );
};

export default Transaction;
