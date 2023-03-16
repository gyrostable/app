import { useState } from "react";
import styled from "styled-components";
import Row from "../../../UI/Row";

const CHART_VALUES = ["Volume", "TVL", "Fees"];
const POOL_VALUE = 3806921711;

const Chart = () => {
  const [activeChart, setActiveChart] = useState("Volume");

  return (
    <Container>
      <Row justifyContent="space-between" alignItems="flex-start">
        <Row>
          {CHART_VALUES.map((value, index) => (
            <Button
              key={index}
              active={activeChart === value}
              onClick={() => setActiveChart(value)}
            >
              {value}
            </Button>
          ))}
        </Row>

        <CurrentValueContainer>
          <h3>${POOL_VALUE.toLocaleString()}</h3>
          <p>90 days volume</p>
        </CurrentValueContainer>
      </Row>
      <ChartArea />
    </Container>
  );
};

export default Chart;

const Container = styled.div`
  background: ${({ theme }) => theme.colors.highlightDark};
  border-radius: 12px;
  padding: 40px;
  margin-bottom: 24px;
`;

const Button = styled.div<{ active?: boolean }>`
  background: ${({ theme, active }) =>
    active ? theme.colors.white : theme.colors.highlight};
  border-radius: 4px;
  color: ${({ theme, active }) =>
    active ? theme.colors.dark : theme.colors.white};
  cursor: pointer;
  margin-right: 12px;
  padding: 8px 12px;
  transition: all 0.2s ease-in-out;

  &:hover {
    background: ${({ theme, active }) =>
      active ? theme.colors.white : theme.colors.highlightLight};
  }
`;

const CurrentValueContainer = styled.div`
  text-align: right;

  h3,
  p {
    margin: 0;
    font-weight: 300;
  }
`;

const ChartArea = styled.div`
  height: 400px;
  width: 100%;
`;
