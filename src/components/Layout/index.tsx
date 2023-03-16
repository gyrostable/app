import { ReactNode } from "react";
import styled from "styled-components";
import Modal from "../UI/Modal";
import Footer from "./components/Footer";
import NavBar from "./components/NavBar";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <Container>
      <NavBar />
      <Modal />
      <Body>{children}</Body>
      <Footer />
    </Container>
  );
};

const Container = styled.div`
  min-height: 100vh;
  margin: auto;
  position: relative;
  width: min(1440px, 100vw);
`;

const Body = styled.div`
  min-height: calc(100vh - 527px);
`;

export default Layout;
