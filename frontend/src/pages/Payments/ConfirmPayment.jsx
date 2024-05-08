import React, { useEffect } from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const ConfirmPayment = () => {
    const navigate = useNavigate();

    useEffect(() => {
      const timer = setTimeout(() => {
        navigate('/');
      }, 2000);
  
      return () => clearTimeout(timer);
    }, [navigate]);
  
    const handleReturnHome = () => {
      navigate('/');
    };
  

  return (
    <Container>
      <Row className="mt-5">
        <Col>
          <h2>Pagamento andato a buon fine</h2>
          <p>Il pagamento è stato confermato con successo.</p>
          <Button variant="primary" onClick={handleReturnHome}>
            Torna alla Home
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default ConfirmPayment;
