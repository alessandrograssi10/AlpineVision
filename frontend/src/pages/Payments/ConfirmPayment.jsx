import React, { useEffect } from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import grazie from '../../assets/Images/grazie.png';
import './ConfirmPayment.css'; // Importa il file CSS

const ConfirmPayment = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
       navigate('/');
     }, 4000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Container>
      <Row className="mt-5">
        <Col className="confirm-payment-container">
          <h2>Grazie per aver acquistato su Alpine Vision! </h2>
          <div className="image-container">
  <img src={grazie} alt="grazie" className="left-img" />
  <img src={grazie} alt="grazie" className="right-img" />
</div>

          
          <h4>Il pagamento è avvenuto con successo.</h4>
        </Col>
      </Row>
    </Container>
  );
};

export default ConfirmPayment;
