import React, { useState } from 'react';
import firebase from './firebase';

const PhoneAuth: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [verificationId, setVerificationId] = useState('');
  const [verificationCode, setVerificationCode] = useState('');

  const handleSendOtp = () => {
    console.log(`==>handleSendOtp`)
    const appVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
    console.log(`==>handleSendOtp1`)
    firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
      .then((confirmationResult) => {
        console.log(`==>`, confirmationResult);
        setVerificationId(confirmationResult.verificationId);
        setOtpSent(true);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleSignIn = () => {
    console.log(`11=>`, verificationCode);
    console.log(`11=>`, verificationId);
    const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, verificationCode);
    console.log(`==>`, credential);
    firebase.auth().signInWithCredential(credential)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(`==>user`, user)
        // Handle successful sign-in
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />

      {otpSent ? (
        <div>
          <input type="text" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} />
          <button onClick={handleSignIn}>Sign In</button>
        </div>
      ) : (
        <button onClick={handleSendOtp}>Send OTP</button>
      )}

      <div id="recaptcha-container"></div>
    </div>
  );
};

export default PhoneAuth;
