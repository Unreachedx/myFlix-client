import React from 'react';
import { createRoot } from 'react-dom/client';
import { MainView } from "./components/main-view/main-view";
import Container from "react-bootstrap/Container";
import './index.scss';
import { BrowserRouter } from 'react-router-dom';

const MyFlixApplication = () => {
  return (
    <BrowserRouter>
      <Container>
      <MainView />
      </Container>
    </BrowserRouter>
  );
};

const container = document.querySelector("#root");
const root = createRoot(container);

root.render(<MyFlixApplication />);