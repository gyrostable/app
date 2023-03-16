import { createGlobalStyle } from "styled-components";
import theme from "./theme";

const GlobalStyle = createGlobalStyle`
    body {
        background: ${theme.colors.dark};
        box-sizing: border-box;
        color: ${theme.colors.white};
        font-family: 'noigrotesk', Arial, sans-serif;
        letter-spacing: 0em; /* adjust letter spacing depending on font size */
        margin: 0;
        padding: 0;
        word-spacing: 0em; /* adjust word spacing depending on font size */
        -webkit-font-smoothing: antialiased; /* looks better */
        -moz-osx-font-smoothing: grayscale; /* looks better */
    }
    h1 {
        font-style: normal;
        font-weight: 400;
        font-size: 88px;
        line-height: 97px;
    }
    h2 {
        font-style: normal;
        font-weight: 400;
        font-size: 56px;
        line-height: 70px;
    }
    h3 {
        font-style: normal;
        font-weight: 400;
        font-size: 38px;
        line-height: 48px;
    }
    h4 {
        font-style: normal;
        font-weight: 400;
        font-size: 21px;
        line-height: 21px;
        letter-spacing: 0.03em;
        text-transform: uppercase;
    }
    h5 {
        font-style: normal;
        font-weight: 400;
        font-size: 24px;
        line-height: 34px;
    }
    h6 {
        font-style: normal;
        font-weight: 400;
        font-size: 19px;
        line-height: 27px;
    }
    p {
        font-size: 16px;
    }
    a {
        color: ${theme.colors.dark};
        text-decoration: none;
    }
    button {
        font-family: 'noigrotesk', Arial, sans-serif;
        font-size: 16px;
    }
   

    // Tablet Styling
    @media screen and (max-width: ${theme.breakpoints.tablet}) {
        h1 {
            font-style: normal;
            font-weight: 400;
            font-size: 66px;
            line-height: 73px;
        }
        h2 {
            font-style: normal;
            font-weight: 400;
            font-size: 42px;
            line-height: 52px;
        }
        h3 {
            font-style: normal;
            font-weight: 400;
            font-size: 32px;
            line-height: 40px;
        }
        h4 {
            font-style: normal;
            font-weight: 400;
            font-size: 19px;
            line-height: 19px;
            letter-spacing: 0.03em;
            text-transform: uppercase;
        }
        h5 {
            font-style: normal;
            font-weight: 400;
            font-size: 21px;
            line-height: 29px;
        }
        h6 {
            font-style: normal;
            font-weight: 400;
            font-size: 17px;
            line-height: 24px;
        }
      }
    // Mobile Styling
    @media screen and (max-width: ${theme.breakpoints.mobile}) {
        h1 {
            font-style: normal;
            font-weight: 400;
            font-size: 44px;
            line-height: 48px;
        }
        h2 {
            font-style: normal;
            font-weight: 400;
            font-size: 36px;
            line-height: 45px;
        }
        h3 {
            font-style: normal;
            font-weight: 400;
            font-size: 26px;
            line-height: 32px;
        }
        h4 {
            font-style: normal;
            font-weight: 400;
            font-size: 17px;
            line-height: 17px;
            letter-spacing: 0.03em;
            text-transform: uppercase;
        }
        h5 {
            font-style: normal;
            font-weight: 400;
            font-size: 18px;
            line-height: 25px;
        }
        h6 {
            font-style: normal;
            font-weight: 400;
            font-size: 16px;
            line-height: 22px;
        }
      }      

      input {
        border:none
      }
      
      /* Chrome, Safari, Edge, Opera */
      input::-webkit-outer-spin-button,
      input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
    
      /* Firefox */
      input[type="number"] {
        -moz-appearance: textfield;
      }


    /* Hide scrollbar for Chrome, Safari and Opera */
    body::-webkit-scrollbar {
        display: none;
    }
    
    /* Hide scrollbar for IE, Edge and Firefox */
    body {
        -ms-overflow-style: none;  /* IE and Edge */
        scrollbar-width: none;  /* Firefox */
    }

`;

export default GlobalStyle;
