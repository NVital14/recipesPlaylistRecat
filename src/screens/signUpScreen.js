import React, { useState } from 'react';

import '../firebaseConfig';
import '../App.css';
import '../components/signUp';


import SignUp from '../components/signUp';


const SignUpScreen = () => {
    const [email, setEmail] = useState('');
    const [passord, setPassword] = useState('');
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100vw', height: '100vh' }} >
            
                <SignUp email={email} setEmail={setEmail} passord={passord} setPassword={setPassword}></SignUp>
           
        </div>
    );

};

export default SignUpScreen;
