import * as Components from '../../components/styled_components/Components.jsx';
import { useState } from 'react';

function Login_Signin() {

    const [signIn, toggle] = useState("true");

    //  Stato form
    const [userStat, setuserStat] = useState({
        nome: "",
        cognome: "",
        username: "",
        password: "",
        email: "",
        nascita: "",
    })

    //  Inserimento dati dall'utente
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setuserStat({
            ...userStat,
            [name]: value,
        })
    }

    //  Submit
    const handleClick = (e) => {
        e.preventDefault();

        let user;
        if (e.target.name == "Log in") {

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


            //   Chiamata di controllo, se non è presente l'utente con tale email e password 
            // fetch("http://localhost:3000/api/users/login", {
            //     method: "POST",
            //     body: JSON.stringify(userStat.email),
            //     headers: {
            //         "Content-type": "application.json; charset=UTF-8",
            //     },
            // }).then((response) => response.json()).then((data) => {

            // })

        } else {
            //  Sign up
            user = {
                nome: userStat.nome,
                cognome: userStat.cognome,
                username: userStat.username,
                password: userStat.password,
                email: userStat.email,
                nascita: userStat.nascita,
            }

            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            const raw = JSON.stringify({
                "email": user.email,
                "password": user.password,
                "username": user.username
            });

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
            };

            fetch("http://localhost:3000/api/users/addUser", requestOptions)
                .then((response) => response.text())
                .then((result) => console.log(result))
                .catch((error) => console.error(error));
        }


    }






    return (
        <Components.MainContainer>
            <Components.Container>

                {/* Sign up */}
                <Components.SignUpContainer signinin={signIn}>
                    <Components.Form>
                        <Components.Title>Crea Account</Components.Title>

                        <Components.Input
                            name="nome"
                            type="text"
                            placeholder="Nome"
                            required
                            value={userStat.nome}
                            onChange={handleInputChange}
                        />
                        <Components.Input
                            name="cognome"
                            type="text"
                            placeholder="Cognome"
                            required
                            value={userStat.cognome}
                            onChange={handleInputChange} />
                        <Components.Input
                            name="username"
                            type="text"
                            placeholder="Username"
                            required
                            value={userStat.username}
                            onChange={handleInputChange} />
                        <Components.Input
                            name="email"
                            type="email"
                            placeholder="Email"
                            required
                            value={userStat.email}
                            onChange={handleInputChange} />
                        <Components.Input
                            name="password"
                            type="password"
                            placeholder="Password"
                            required
                            value={userStat.password}
                            onChange={handleInputChange} />
                        <Components.Input
                            name="nascita"
                            type="date"
                            placeholder="Data di nascita"
                            required
                            value={userStat.nascita}
                            onChange={handleInputChange} />
                        <Components.Button name="Sign Up" onClick={handleClick}>Sign Up</Components.Button>
                    </Components.Form>
                </Components.SignUpContainer>

                {/* Log in */}
                <Components.SignInContainer signinin={signIn}>
                    <Components.Form>
                        <Components.Title name="Sign in">Sign in</Components.Title>
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
                        <Components.Anchor href="#">Password dimenticata?</Components.Anchor>
                        <Components.Button name="Log in" onClick={handleClick}>Log in</Components.Button>
                    </Components.Form>
                </Components.SignInContainer>

                {/* Sovrapposizione */}
                <Components.OverlayContainer signinin={signIn}>
                    <Components.Overlay signinin={signIn}>

                        {/* Sovrapposizione di sinistra */}
                        <Components.LeftOverlayPanel signinin={signIn}>
                            <Components.Title>Benvenuto!</Components.Title>
                            <Components.Paragraph>
                                Registrati per entrare nella community di sciatori con il cazzo più grande di tutta la storia
                            </Components.Paragraph>
                            <Components.GhostButton onClick={() => (toggle("true"), setuserStat({
                                ...userStat,
                                password: "",
                            }))}>
                                Log in
                            </Components.GhostButton>
                        </Components.LeftOverlayPanel>

                        {/* Sovrapposizione di destra */}
                        <Components.RightOverlayPanel signinin={signIn}>
                            <Components.RTitle>Bentornato!</Components.RTitle>
                            <Components.Paragraph>
                                Esegui il login per acquistare le nostre maschere
                            </Components.Paragraph>
                            <Components.Paragraph> Oppure Registrati!</Components.Paragraph>
                            <Components.GhostButton onClick={
                                () => (toggle("false"), setuserStat({
                                    ...userStat,
                                    password: "",
                                }))}>
                                Sign Up
                            </Components.GhostButton>
                        </Components.RightOverlayPanel>

                    </Components.Overlay>
                </Components.OverlayContainer>
            </Components.Container>
        </Components.MainContainer>
    )




}

export default Login_Signin;