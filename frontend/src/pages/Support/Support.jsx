import React from 'react';
import { Container, Row, Col, ListGroup } from 'react-bootstrap';

export const Support = () => {
  return (
    <Container>
      <Row className="my-5">
        <Col>
          <h1>Supporto Clienti</h1>
          <p>Qui puoi trovare tutte le informazioni necessarie per contattarci, i metodi di spedizione, le tempistiche e le politiche di sostituzione.</p>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <h2>Contatti</h2>
          <ListGroup>
            <ListGroup.Item>Email: supporto@esempio.com</ListGroup.Item>
            <ListGroup.Item>Telefono: +39 012 3456789</ListGroup.Item>
            <ListGroup.Item>Chat dal vivo sul nostro sito</ListGroup.Item>
          </ListGroup>
        </Col>

        <Col md={6}>
          <h2>Metodi di Spedizione e Tempistiche</h2>
          <ListGroup>
            <ListGroup.Item>Standard: 3-5 giorni lavorativi</ListGroup.Item>
            <ListGroup.Item>Espresso: 1-2 giorni lavorativi</ListGroup.Item>
            <ListGroup.Item>Internazionale: 5-10 giorni lavorativi a seconda della destinazione</ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>

      <Row className="my-5">
        <Col>
          <h2>Sostituzione Articoli e Tempistiche</h2>
          <p>Se hai bisogno di sostituire un articolo, puoi inviarcelo indietro entro 30 giorni dalla ricezione. La sostituzione verrà elaborata entro 5 giorni lavorativi dalla ricezione dell'articolo restituito.</p>
          <p>Per avviare il processo di sostituzione, contatta il nostro servizio clienti tramite email o telefono.</p>
        </Col>
      </Row>
    </Container>
  );
};
