import styled from "styled-components";
import { formatFixed } from "@ethersproject/bignumber";
import { useContext } from "react";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { BsArrowUpRight } from "react-icons/bs";
import HorizontalRule from "../UI/HorizontalRule";
import Row from "../UI/Row";
import theme from "../../styles/theme";
import { JoinExitDataContext } from "../../contexts/JoinExitData";
import Loading from "../UI/Loading";
import formatBigNumberString from "../../utils/formatBigNumberString";
import { Web3Context } from "../../contexts/Web3";
import generateRelativeTimeStatement from "../../utils/generateRelativeTimeStatement";

const JoinsAndExits = () => {
  const {
    loading,
    data,
    selectionChoices,
    setSelected,
    selected,
    limit,
    incrementLimit,
  } = useContext(JoinExitDataContext);
  const { selectedNetworkConfig } = useContext(Web3Context);

  return (
    <Container>
      <Header>
        {selectionChoices.map((selection, index, self) => (
          <Row key={index}>
            <Selection
              onClick={() => setSelected(selection)}
              active={selected === selection}
            >
              {selection} Joins / Exits
            </Selection>
            {index !== self.length - 1 && <Divider />}
          </Row>
        ))}
      </Header>
      <HorizontalRule />
      <Row margin="24px 0 0 0">
        <Cell header flex="1">
          ACTION
        </Cell>
        <Cell header flex="1">
          VALUE
        </Cell>
        <Cell header flex="2">
          ASSETS
        </Cell>
        <Cell header flex="1">
          TIME
        </Cell>
      </Row>
      {loading ? (
        <LoadingRows />
      ) : data.length ? (
        data
          .slice(0, limit)
          .map(({ type, value, tokens, tx, timestamp }, index) => (
            <Row margin="24px 0 0 0" key={index}>
              <Cell flex="1">
                {type === "Join" ? (
                  <>
                    <AiOutlinePlus
                      style={{
                        marginRight: "5px",
                        color: theme.colors.warning,
                      }}
                    />
                    Join
                  </>
                ) : (
                  <>
                    <AiOutlineMinus style={{ marginRight: "5px" }} />
                    Exit
                  </>
                )}
              </Cell>
              <Cell flex="1">
                {value
                  ? "$ " + formatBigNumberString(formatFixed(value, 18), 2, 2)
                  : "-"}
              </Cell>
              <Cell flex="2">
                {tokens
                  ?.map(({ symbol, amount }) => {
                    return `(${symbol}) ${formatBigNumberString(amount, 2)}`;
                  })
                  .join("/ ")}
              </Cell>
              <Cell flex="1">
                <a
                  href={
                    selectedNetworkConfig.blockExplorerUrls + "tx/" + tx || ""
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  <BsArrowUpRight
                    style={{
                      marginRight: "8px",
                      cursor: "pointer",
                      color: theme.colors.white,
                    }}
                  />
                </a>
                {generateRelativeTimeStatement(timestamp)}
              </Cell>
            </Row>
          ))
      ) : (
        <Row margin="25.5px 0 0 0">
          No {selected === "All" ? "" : "user "} joins or exits
        </Row>
      )}
      {limit < data.length && (
        <LoadMoreButton onClick={incrementLimit}>Load more</LoadMoreButton>
      )}
    </Container>
  );
};

export default JoinsAndExits;

const LoadingRows = () => {
  return (
    <>
      <Row margin="24px 0 0 0">
        <Loading height="24px" width="100%" />
      </Row>
      <Row margin="24px 0 0 0">
        <Loading height="24px" width="100%" />
      </Row>
      <Row margin="24px 0 0 0">
        <Loading height="24px" width="100%" />
      </Row>
    </>
  );
};

const Container = styled.div`
  background: ${({ theme }) => theme.colors.highlightDark};
  border-radius: 12px;
  padding: 28px;
`;

const Header = styled.div`
  display: flex;
  position: relative;
  margin-bottom: 28px;
`;

const Divider = styled.div`
  background: ${({ theme }) => theme.colors.highlight};
  min-height: 100%;
  margin: 0 12px;
  width: 1px;
`;

const Selection = styled.h5<{ active?: boolean }>`
  color: ${({ active, theme }) =>
    active ? theme.colors.white : theme.colors.highlight};
  cursor: pointer;
  margin: 0;
  transition: all 0.2s ease-in-out;

  &:hover {
    color: ${({ theme, active }) =>
      active ? theme.colors.white : theme.colors.highlightLight};
  }
`;

const Cell = styled.div<{ flex?: string | number; header?: boolean }>`
  align-items: center;
  display: flex;
  flex: ${({ flex }) => (flex ? flex : "")};
  font-weight: ${({ header }) => (header ? 900 : "")};
`;

const LoadMoreButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.white};
  cursor: pointer;

  margin-top: 12px;
  outline: none;
  padding: 12px;
  transition: all 0.2s ease-in-out;
  width: 100%;

  &:hover {
    background: ${({ theme }) => theme.colors.highlight};
  }
`;
