import React, { useContext, useEffect, useState } from 'react';
import '../App.css';
import { Card, Button, Input } from '@ui5/webcomponents-react';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import rpImg from '../images/recipesPlaylist.png';
import { useNavigate } from 'react-router-dom'
import { AuthContext, ROUTES } from '../App';



const LogIn = ({ email, setEmail, passord, setPassword }) => {
    const user = useContext(AuthContext);
    const navigate = useNavigate();
    const [width, setWidth] = useState(window.innerWidth);
    const [height, setHeight] = useState(window.innerHeight);


    useEffect(() => {
        setEmail('admin@gmail.com');
        setPassword('admin1');
        window.addEventListener('resize', () => { setWidth(window.innerWidth) });
        window.addEventListener('resize', () => { setHeight(window.innerHeight) });

        return () => {
            window.removeEventListener('resize', () => { setWidth(window.innerWidth) });
            window.removeEventListener('resize', () => { setHeight(window.innerHeight) });

        };
    }, []);


    const doLogIn = async (e) => {
        e.preventDefault();
        // navigate(ROUTES.RECEITAS);
        try {
             await signInWithEmailAndPassword(auth, email, passord);
            const curUser = auth.currentUser.uid;
            user.setUser(structuredClone(curUser));

            console.log(auth.currentUser.uid);
            console.log(user.user);
            navigate(ROUTES.INICIO);
        } catch (error) {
            alert('ERRO' + error);
        }
    }

    return (
        <Card
            style={{

                width: width <= 500 ? '100%' : width <= 800 ? '90%' : width <= 1400 ? '50%' : '30%',
                height: height <= 850 ? '55%' : '45%',
            }}>
            <center>
                <img src={rpImg} style={{ marginTop: '20px' }} />
            </center>
            <p className='recipe-title'> Log In</p>

            <div>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', margin: '12px' }} >
                    <span className='labelText'> Email </span>
                    <Input
                        type='Email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{
                            width: '70%',
                            height: '50px'
                        }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', margin: '12px' }} >
                    <span className='labelText'> Palavra-passe </span>
                    <Input
                        type='Password'
                        value={passord}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{
                            width: '70%',
                            height: '50px'
                        }} />
                </div>

                <center>
                    <Button
                        className='btnOthers'
                        onClick={doLogIn}

                    > Entrar</Button>

                    <Button
                        className='btnOthers'
                        onClick={() => { navigate(ROUTES.SIGN_UP) }}

                    > Criar Conta</Button>
                </center>
            </div>
        </Card>
    );
};

export default LogIn;
