import React, { useState } from 'react';

import '../firebaseConfig';
import '../App.css';
import '../components/signUp';


import LogIn from '../components/logIn';


const LogInScreen = () => {
    const [email, setEmail] = useState('');
    const [passord, setPassword] = useState('');
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100vw', height: '100vh' }}>
                <LogIn email={email} setEmail={setEmail} passord={passord} setPassword={setPassword}></LogIn>
        </div>
    );

};

export default LogInScreen;
