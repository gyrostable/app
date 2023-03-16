import styled from "styled-components";
import Image from "../../UI/Image";

import logoWhite from "../../../../public/logos/logo-white.png";

const Footer = () => {
  return (
    <Container>
      <Line />
      <Row mobileOnly>
        <LogoContainer>
          <a href="https://gyro.finance/" target="_blank" rel="noreferrer">
            <div style={{ cursor: "pointer" }}>
              <Image src={logoWhite} alt="Gyroscope" unoptimized={true} />
            </div>
          </a>
        </LogoContainer>
      </Row>
      <Row>
        <Column flex={4} notMobile>
          <LogoContainer>
            <a href="https://gyro.finance/" target="_blank" rel="noreferrer">
              <div style={{ cursor: "pointer" }}>
                <Image src={logoWhite} alt="Gyroscope" unoptimized={true} />
              </div>
            </a>
          </LogoContainer>
        </Column>
        <Column flex={1} right>
          <h6>Home</h6>
          <Underline>
            <Spacer />
            <a
              href="https://www.gyro.finance/vision"
              target="_blank"
              rel="noreferrer"
            >
              <p style={{ cursor: "pointer" }}>Vision</p>
            </a>
          </Underline>
          <Underline>
            <Spacer />
            <a
              href="https://test.gyro.finance/"
              target="_blank"
              rel="noreferrer"
            >
              <p>Game</p>
            </a>
          </Underline>
        </Column>
        <Column flex={1} right>
          <h6>Community</h6>
          <Underline>
            <Spacer />
            <a
              href="https://twitter.com/gyrostable/"
              target="_blank"
              rel="noreferrer"
            >
              <p>Twitter</p>
            </a>
          </Underline>
          <Underline>
            <Spacer />
            <a
              href="https://discord.com/invite/2vnqnS7wE6"
              target="_blank"
              rel="noreferrer"
            >
              <p>Discord</p>
            </a>
          </Underline>
          <Underline>
            <Spacer />
            <a
              href="https://gov.gyro.finance/"
              target="_blank"
              rel="noreferrer"
            >
              <p>Forum</p>
            </a>
          </Underline>
        </Column>
        <Column flex={1} right>
          <h6>Resources</h6>
          <Underline>
            <Spacer />
            <a
              href="https://docs.gyro.finance/overview/introduction"
              target="_blank"
              rel="noreferrer"
            >
              <p>Docs</p>
            </a>
          </Underline>
          {/* <Underline>
            <Spacer />
            <a
              href="https://gyro.finance/pdfs/Gyroscope_Lite_Paper.pdf"
              target="_blank"
              rel="noreferrer"
            >
              <p>Whitepaper</p>
            </a>
          </Underline> */}
          <Underline>
            <Spacer />
            <a
              href="https://github.com/gyrostable"
              target="_blank"
              rel="noreferrer"
            >
              <p>GitHub</p>
            </a>
          </Underline>
        </Column>
      </Row>
      <Row
        style={{
          marginTop: "30px",
          padding: "0 20px",
          justifyContent: "space-between",
        }}
      >
        <p>©2023 FTL Labs</p>
        <Underline justifyContent="center">
          <a
            href="mailto:security@gyro.finance"
            target="_blank"
            rel="noreferrer"
          >
            <p style={{ cursor: "pointer" }}>Report bug</p>
          </a>
        </Underline>
        <Underline justifyContent="center">
          <a
            href="https://www.gyro.finance/terms-of-service"
            target="_blank"
            rel="noreferrer"
          >
            <p style={{ cursor: "pointer" }}>Terms of Service</p>
          </a>
        </Underline>
        <Underline>
          <Spacer />
          <a
            href="https://www.gyro.finance/privacy-policy"
            target="_blank"
            rel="noreferrer"
          >
            <p style={{ cursor: "pointer" }}>Privacy Policy</p>
          </a>
        </Underline>
      </Row>
      <Line />
      <Row>
        {/* <LegalText>
          Legal disclaimer lorem ipsum dolor sit amet, consectetur adipiscing
          elit. Donec luctus convallis augue. Mauris sed cursus nunc. Sed orci
          felis, luctus vel facilisis et, venenatis ornare enim. Sed porta elit
          diam, et sollicitudin mi consequat sed. Donec vehicula aliquam cursus.
          Praesent condimentum finibus elementum.
        </LegalText> */}
      </Row>
    </Container>
  );
};

const Container = styled.div`
  color: ${({ theme }) => theme.colors.white};
  margin: auto;
  padding: 50px 0;
  position: relative;
  max-width: 1440px;

  // Mobile Styling
  @media screen and (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 50px 20px;
  }
`;

const Line = styled.div`
  background: ${({ theme }) => theme.colors.highlight};
  height: 1px;
  width: 100%;
`;

const Row = styled.div<{ mobileOnly?: boolean; justifyContent?: string }>`
  display: flex;
  position: ${({ mobileOnly }) => (mobileOnly ? "absolute" : "static")};
  visibility: ${({ mobileOnly }) => (mobileOnly ? "hidden" : "visible")};

  // Mobile Styling
  @media screen and (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    position: ${({ mobileOnly }) => (mobileOnly ? "static" : "")};
    visibility: ${({ mobileOnly }) => (mobileOnly ? "visible" : "")};
  }
`;

const Column = styled.div<{
  flex: number;
  center?: boolean;
  right?: boolean;
  notMobile?: boolean;
}>`
  display: flex;
  flex: ${({ flex }) => flex};
  flex-direction: column;
  margin: 10px 20px;
  text-align: ${({ center, right }) =>
    center ? "center" : right ? "right" : ""};

  h6 {
    margin: 20px 0;
  }

  p {
    margin: 8px 0;
    position: relative;
  }

  // Tablet Styling
  @media screen and (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding-left: 10px;
    position: ${({ notMobile }) => (notMobile ? "absolute" : "")};
    text-align: left;
    visibility: ${({ notMobile }) => (notMobile ? "hidden" : "")};
    margin: 20px 0px;
  }
`;

const LogoContainer = styled.div`
  height: 16px;
  margin-top: 20px;
  width: 120px;

  // Mobile Styling
  @media screen and (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding-left: 10px;
  }
`;

const Underline = styled.div<{ justifyContent?: string }>`
  display: flex;
  justify-content: ${({ justifyContent }) =>
    justifyContent ? justifyContent : ""};
  a {
    color: ${({ theme }) => theme.colors.white};
  }

  p {
    position: relative;

    &:after {
      background-color: ${({ theme }) => theme.colors.white};
      bottom: -7px;
      content: "";
      height: 1px;
      left: 0;
      position: absolute;
      transform: scaleX(0);
      transform-origin: bottom right;
      transition: transform 0.25s ease-out;
      width: 100%;
    }

    &:hover:after {
      transform: scaleX(1);
      transform-origin: bottom left;
    }
  }

  // Tablet Styling
  @media screen and (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    justify-content: flex-start;
  }
`;

const Spacer = styled.div`
  flex: 1;

  // Mobile Styling
  @media screen and (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    position: absolute;
  }
`;

export default Footer;
