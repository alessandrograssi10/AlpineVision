import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import Skier2 from '../../assets/Images/skier2.png';
import Skier3 from '../../assets/Images/skier3.png';
import "./LoginSignupForm.css";

const LoginSignupForm = () => {
  
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [activeTab, setActiveTab] = useState("login");

  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    birthDate: new Date(),
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setsuccessMessage] = useState("");
  const [birthdateTouched, setBirthdateTouched] = useState(false);
  

  const handleLoginSubmit = (event) => {
    event.preventDefault();
    setErrorMessage("");
    setsuccessMessage("");

    if (loginEmail === "" || loginPassword === "") {
      setErrorMessage("Completare tutti i campi.");
      return;
    }

    const user = {
      email: loginEmail,
      password: loginPassword
    };

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(user),
      redirect: "follow"
    };

    fetch("http://localhost:3000/api/users/login", requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Errore durante il login');
        }
        return response.json();
      })
      .then((result) => {
        localStorage.setItem("token", result.token);
        localStorage.setItem("userId", result.userId);
        localStorage.setItem("emailuser", loginEmail);
        window.location.href = "/AreaPersonale";
      })
      .catch((error) => {
        setErrorMessage('Credenziali non valide.');
      });
  };

  const handleSignupSubmit = (event) => {
    event.preventDefault();
    let errors = [];
    setErrorMessage(""); 
    setsuccessMessage(""); 
  
    if (
      userData.firstName === "" ||
      userData.lastName === "" ||
      userData.email === "" ||
      userData.password === "" ||
      userData.confirmPassword === "" ||
      !birthdateTouched
    ) {
      setErrorMessage("Completare tutti i campi.");
      return;
    }
  
    if (userData.password.length < 8) {
      setErrorMessage("La password deve contenere almeno 8 caratteri.");
      return;
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      errors.push("email non valida");
    }
  
    if (userData.password !== userData.confirmPassword) {
      errors.push("le password non coincidono.");
    }
  
    if (errors.length > 0) {
      setErrorMessage(errors.length > 1 ? errors.join(" e ") : errors[0]);
      return;
    }
  
    const user = {
      nome: userData.firstName,
      cognome: userData.lastName,
      dataNascita: userData.birthDate,
      email: userData.email,
      password: userData.password,
      confermaPassword: userData.confirmPassword
    };
  
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
  
    const raw = JSON.stringify(user);
  
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
        localStorage.setItem("token", result.token);
        localStorage.setItem("userId", result.userId);
        localStorage.setItem("emailuser", loginEmail);
        setsuccessMessage('Registrazione avvenuta con successo. Reindirizzamento in corso');
        setTimeout(() => {
          window.location.href = "/AreaPersonale";
        }, 2000); 
      })
      .catch((error) => {
        setErrorMessage('Utente già registrato. Accedi con le tue credenziali.');
      });
  };
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setErrorMessage("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
    if (name === "birthDate") {
      setBirthdateTouched(true);
    }
    setErrorMessage("");
  };

  return (
    <Container fluid className="login-signup-container">
      <Row className="justify-content-md-center">
        <Col xs={12} md={8} className="login-col">
          <Form className={activeTab === "login" ? "login-form" : "signup-form"}>
            <Row>
              {activeTab === "login" ? (
                <>
                  <Col md={6}>
                    <div className="d-flex flex-column justify-content-center align-items-center h-100">
                      <div style={{ marginBottom: '5rem' }}></div>
                      <p className="paragraph-text">Accedi</p>
                      <div style={{ marginBottom: '8rem' }}></div>
                      <Form.Group controlId="loginEmail">
                        <Form.Control
                          type="email"
                          placeholder="Email"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                        />
                      </Form.Group>
                      <Form.Group controlId="loginPassword">
                        <Form.Control
                          type="password"
                          placeholder="Password"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                        />
                      </Form.Group>
                      {errorMessage && (
                        <p className="error-message">{errorMessage}</p>
                      )}
                      <div className="button-container">
                        <Button className='button-black-prod'variant="outline-dark" type="submit" onClick={handleLoginSubmit}>
                          ACCEDI
                        </Button>
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="d-flex flex-column justify-content-center align-items-center h-100">
                      <div style={{ marginBottom: '5rem' }}></div>
                      <p className="paragraph-text">Prima volta su Alpine Vision?!</p>
                      <img src={Skier2} className="img-login" alt="Skier 2" />
                      <div className="button-container">
                        <Button className='button-black-prod 'variant="outline-dark" type="submit" onClick={() => handleTabChange("signup")}>
                          REGISTRATI ORA &#x2192;
                        </Button>
                      </div>
                    </div>
                  </Col>
                </>
              ) : (
                <>
                  <Col md={6}>
                    <div className="d-flex flex-column justify-content-center align-items-center h-100">
                      <div style={{ marginBottom: '5rem' }}></div>
                      <p className="paragraph-text">Benvenuto, Alpine Skier!</p>
                      <img src={Skier3} className="img-signup" alt="Skier 3" />
                      <div className="button-container">
                        <Button className='button-black-prod 'variant="outline-dark" type="submit" onClick={() => handleTabChange("login")}>
                          &#x2190; TORNA INDIETRO
                        </Button>
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="d-flex flex-column justify-content-center align-items-center h-100">
                      <div style={{ marginBottom: '5rem' }}></div>
                      <p className="paragraph-text">Crea un nuovo account</p>
                      <Form.Group controlId="signupFirstName" className="w-75">
                        <Form.Control
                          type="text"
                          name="firstName"
                          placeholder="Nome"
                          value={userData.firstName}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                      <Form.Group controlId="signupLastName" className="w-75">
                        <Form.Control
                          type="text"
                          name="lastName"
                          placeholder="Cognome"
                          value={userData.lastName}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                      <Form.Group controlId="signupBirthDate" className="w-75">
                        <Form.Control
                          type="date"
                          name="birthDate"
                          placeholder="Data di Nascita"
                          value={userData.birthDate}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                      <Form.Group controlId="signupEmail" className="w-75">
                        <Form.Control
                          type="email"
                          name="email"
                          placeholder="Email"
                          value={userData.email}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                      <Form.Group controlId="signupPassword" className="w-75">
                        <Form.Control
                          type="password"
                          name="password"
                          placeholder="Password"
                          value={userData.password}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                      <Form.Group controlId="signupConfirmPassword" className="w-75">
                        <Form.Control
                          type="password"
                          name="confirmPassword"
                          placeholder="Conferma Password"
                          value={userData.confirmPassword}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                      {errorMessage && (
                        <p className="error-message">{errorMessage}</p>
                      )}
                      {successMessage && (
                        <>
                          <p className="success-message">{successMessage}</p>
                        </>
                      )}
                      <div className="button-container">
                        <Button className='button-black-prod 'variant="outline-dark" type="submit" onClick={handleSignupSubmit}>
                          REGISTRATI
                        </Button>
                      </div>
                    </div>
                  </Col>
                </>
              )}
            </Row>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginSignupForm;
