import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_51Qh3JyAxd8KJKZKwfUxn5iRjZHWxJr7kglvMfFdmokUI3UR3gbsPa9ehJwLHGpMyRgXEMxKJ5zRVsLUKwiaBqNb700yrt2yQ2x');  // 使用你的 Stripe 公钥

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [clientSecret, setClientSecret] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    // 获取 clientSecret
    useEffect(() => {
        const fetchClientSecret = async () => {
            try {
                const response = await fetch('/create-payment-intent', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ amount: 5000, currency: 'usd' }),  // 传入支付金额和货币
                });

                const data = await response.json();
                if (data.clientSecret) {
                    setClientSecret(data.clientSecret);
                } else {
                    console.error('No client secret returned');
                }
            } catch (error) {
                console.error('Error fetching client secret:', error);
            }
        };

        fetchClientSecret();
    }, []);  // 组件挂载时获取 clientSecret

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements || !clientSecret) return;  // 如果 Stripe 没有加载完成或者 clientSecret 为空

        setIsProcessing(true);

        // 获取 CardElement 的实例
        const cardElement = elements.getElement(CardElement);

        // 使用 PaymentIntent 的 client_secret 和 CardElement 完成支付
        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement,
                billing_details: {
                    name: 'John Doe', // 这里可以获取用户姓名等信息
                },
            },
        });

        if (error) {
            console.error('Error:', error);
            setIsProcessing(false);
            alert('Payment failed: ' + error.message);
        } else if (paymentIntent.status === 'succeeded') {
            setPaymentSuccess(true);
            setIsProcessing(false);
            alert('Payment successful!');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <CardElement />
            <button type="submit" disabled={isProcessing || paymentSuccess || !clientSecret}>
                {isProcessing ? 'Processing...' : 'Pay Now'}
            </button>
            {!clientSecret && <div>Loading...</div>}  {/* clientSecret 未加载时显示 Loading */}
        </form>
    );
};

const PaymentPage = () => {
    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm />
        </Elements>
    );
};

export default PaymentPage;
