import * as Components from '../../components/styled_components/Components.jsx';
import { Container, Card, Row, Col, Button } from 'react-bootstrap';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Skier2 from '../../assets/Images/skier2.png';
import Skier3 from '../../assets/Images/skier3.png';

function Login_Signin() {

    const [signIn, toggle] = useState("true");
    const [nameErrors, setNameErrors] = useState({ nome: false, cognome: false });
    const [touchedFields, setTouchedFields] = useState({ nome: false, cognome: false });

    const today = new Date().toISOString().split('T')[0]; 
    const invertedtoday = today.split('-').reverse().join('-');
    const [isValidDate, setIsValidDate] = useState(true);

     

    const [isEmailValid, setIsEmailValid] = useState(true);
    const [emailError, setEmailError] = useState('');

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    const [passwordMatchError, setPasswordMatchError] = useState(false);

    const [error, setError] = useState('');
    const [Signupfirstaccess, setSignupfirstaccess] = useState(false);

    
    const [userStat, setuserStat] = useState({
        nome: "",
        cognome: "",
        dataNascita: new Date(), 
        email: "",
        password: "",
        confermapassword: "",
    })

    const isUserStatEmpty = () => {
        for (const key in userStat) {
            if (userStat.hasOwnProperty(key) && (typeof userStat[key] !== 'object' ||
             (typeof userStat[key] === 'object' && typeof userStat[key].toISOString === 'function'))
              && typeof userStat[key].trim === 'function' && userStat[key].trim() !== '') {
                return false;
            }
        }
        return true;
    };
    

    const handleReset = () => {
        setuserStat({
            nome: "",
            cognome: "",
            dataNascita: new Date(),
            email: "",
            password: "",
            confermapassword: "",
        });
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setuserStat({
            ...userStat,
            [name]: value,
        });

        if (name === 'email') {
            setIsEmailValid(isValidEmail(value) || value === '');
        }
        
        setNameErrors({
            ...nameErrors,
            [name]: touchedFields[name] && !value.trim(),
        });
    }

    const handleBlur = (e) => {
        const { name, value } = e.target;
        if (name === 'email') {
            if (value === '') {
                setEmailError('Inserisci un email valida');
            } else if (!isValidEmail(value)) {
                setEmailError('Email non valida');
            } else {
                setEmailError('');
            }
        }
         else if (name === 'nome' || name === 'cognome') {
            
            setNameErrors({
                ...nameErrors,
                [name]: !value.trim(),
            });
        }
    };
    


    const handleDateChange = (value) => {
        const selectedDate = new Date(value);
    
        if (isNaN(selectedDate.getTime())) {
            setuserStat({ ...userStat, dataNascita: new Date() });
            setIsValidDate(false);
        } else if (selectedDate > new Date()) {
            setuserStat({ ...userStat, dataNascita: new Date() });
            setIsValidDate(false);
        } else {
            setuserStat({ ...userStat, dataNascita: selectedDate });
            setIsValidDate(true);
        }
    };
    
    
    
    //SUBMIT CON GESTIONE REGISTRAZIONE O ACCESSO
    const handleClick = (e) => {
        e.preventDefault();
        setError('');

        let user;
        if (e.target.name === "Log in") {
            user = {
                email: userStat.email,
                password: userStat.password
            }

            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            const raw = JSON.stringify({
                "email": userStat.email,
                "password": userStat.password,
            });

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
            };


            fetch("http://localhost:3000/api/users/login", requestOptions)
                .then((response) => response.text())
                .then((result) => console.log(result))
                .catch((error) => console.error(error));
        } else {
            console.log("Sign up");

            //RICONTROLLO TUTTI I CAMPI AL MOMENTO DEL SUBMIT

            if (isUserStatEmpty()) {
                return;
            }

            if ((touchedFields.nome || touchedFields.cognome) && (nameErrors.nome || nameErrors.cognome)) {
                return;
            }
            if (userStat.nome.trim() === '' || userStat.cognome.trim() === '') {
                setNameErrors({ nome: true, cognome: true });
                return;
            }
    

            if (userStat.password !== userStat.confermapassword || userStat.password === '' || userStat.confermapassword === '') {
                setPasswordMatchError(true);
                return; 
            }
            else {
                setPasswordMatchError(false);
            }


            if (!isValidEmail(userStat.email)) {
                setEmailError('Email non valida');
                return;
            }

            user = {
                nome: userStat.nome,
                cognome: userStat.cognome,
                dataNascita: userStat.dataNascita,
                email: userStat.email,
                password: userStat.password,
                confermapassword: userStat.confermapassword
            }

            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            const raw = JSON.stringify({
                "nome": user.nome,
                "cognome": user.cognome,
                "dataNascita": user.dataNascita.toISOString(),
                "email": user.email,
                "password": user.password,
                "confermapassword": user.confermapassword
            });

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
            };

            fetch("http://localhost:3000/api/users/addUser", requestOptions)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Errore durante la registrazione');
                }
                return response.json();
            })
            .then((result) => {
                setSignupfirstaccess(true);
            })
            .catch((error) => {
                    setError('Account già esistente con questa email. Accedi o registrati con un\'altra email.');
            });
        }
    }

    return (
        <Container>
            <Components.Container>
                {/*CREAZIONE ACCOUNT*/}
                <Components.SignUpContainer signinin={signIn}>
                    <Components.Form>
                        <Components.Title style={{ lineHeight: '2' }}>Crea Account</Components.Title>

                        <Components.Input
                            name="nome"
                            type="text"
                            placeholder="Nome"
                            value={userStat.nome}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                        />
                        {nameErrors.nome && <p style={{ color: 'red' }}>Nome non valido</p>}

                        <Components.Input
                            name="cognome"
                            type="text"
                            placeholder="Cognome"
                            value={userStat.cognome}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            />
                            
                        {nameErrors.cognome && <p style={{ color: 'red' }}>Cognome non valido</p>}
                        
                        <Components.Input
                            name="nascita"
                            type="date"
                            placeholder="Data di nascita"
                            required
                            value={userStat.dataNascita.toISOString().split('T')[0]} 
                            onChange={(event) => handleDateChange(event.target.value)}
                        />
                        {!isValidDate && <p>Seleziona una data precedente o uguale al {invertedtoday}</p>}

                        <Components.Input
                        name="email"
                        type="email"
                        placeholder="Email"
                        required
                        value={userStat.email}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        style={{ borderColor: emailError ? 'red' : 'initial' }}/>
                        {emailError && <p style={{ color: 'red' }}>{emailError}</p>}

                        <Components.Input
                            name="password"
                            type="password"
                            placeholder="Password"
                            required
                            value={userStat.password}
                            onChange={handleInputChange} />
                        
                        <Components.Input
                        name="confermapassword"
                        type="password"
                        placeholder="Conferma Password"
                        required
                        value={userStat.confermapassword}
                         onChange={handleInputChange}/>
                         {passwordMatchError && <p style={{ color: 'red' }}>Le password non coincidono</p>}

                         <Components.Button name="Sign Up" onClick={handleClick}>Registrati</Components.Button>
                         {isUserStatEmpty() && <p style={{ color: 'red', marginTop: '70px' }}>Nessun campo inserito</p>}
                         {error && <p style={{ color: 'red', marginTop:'70px' }}>{error}</p>}
                         {Signupfirstaccess && (<div style={{ color: 'green', marginTop: '70px' }}>
                        <p>Registrazione avvenuta con successo!</p>
                        <Link to="/AreaPersonale">Accedi all'area personale</Link>
                         </div>
                        )}


                    </Components.Form>
                   

                </Components.SignUpContainer>

                {/*ACCESSO*/}
                <Components.SignInContainer signinin={signIn}>
                    <Components.Form>
                        <Components.Title name="Sign in" style={{ lineHeight: '9', marginTop:'-200px' }}>Accedi</Components.Title>
                        <Components.Input
                            name="email"
                            type="email"
                            placeholder="Email"
                            required
                            value={userStat.email}
                            onChange={handleInputChange}
                        />
                        <Components.Input
                            name="password"
                            type="password"
                            placeholder="Password"
                            required
                            value={userStat.password}
                            onChange={handleInputChange} />
                        {/*<Components.Anchor href="#">Password dimenticata?</Components.Anchor>*/}
                        <Link to="/AreaPersonale"> <Components.Button name="Log in">Accedi</Components.Button> </Link>
                    </Components.Form>
                </Components.SignInContainer>

                {}
                <Components.OverlayContainer signinin={signIn}>
                    <Components.Overlay signinin={signIn}>

                        {/* BENVENUTO */}
                        <Components.LeftOverlayPanel signinin={signIn}>
                            <Components.Title style={{  whiteSpace: 'nowrap', fontSize:'3vw'}}>Benvenuto, Alpine Skier!</Components.Title>
                            <img src={Skier3}  style={{ width: '380px', height: 'auto' }} />
                            <Components.GhostButton onClick={() => {toggle("true");handleReset();setError('');}}>
                            &#9664;   Torna indietro
                            </Components.GhostButton>
                        </Components.LeftOverlayPanel>

                        {/* PRIMA VOLTA SU ALPINE VISION? */}
                        <Components.RightOverlayPanel signinin={signIn}>
                            <Components.Title style={{ lineHeight: '0.5', fontSize: '32px', whiteSpace: 'nowrap' }}>Prima volta su Alpine Vision?!</Components.Title>
                            <img src={Skier2}  style={{ width: '300px', height: 'auto' }} />
                            <Components.GhostButton onClick={() => {toggle("false");handleReset();setError('')}}>
                                Registrati &#9654;
                            </Components.GhostButton>
                        </Components.RightOverlayPanel>

                    </Components.Overlay>
                </Components.OverlayContainer>
            </Components.Container>
        </Container>
    )
}

export default Login_Signin;
