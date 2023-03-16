import styled from "styled-components";
import { BiChevronDown } from "react-icons/bi";
import useDisappearing from "../../hooks/useDisappearing";
import { useState } from "react";

// TODO - use real filter values
const FILTER_VALUES = ["HIGHEST VOLUME", "POOL TYPE", "SOME OTHER FILTER"];

const PoolFilter = () => {
  const [selected, setSelected] = useState<number | null>(null);

  const {
    open: filterOpen,
    visible: filterVisible,
    disappear: filterDisappear,
    toggle: filterToggle,
  } = useDisappearing();

  return (
    <Container onMouseLeave={filterDisappear}>
      <FilterButton open={filterOpen} onClick={filterToggle}>
        <ChevronContainer open={filterOpen}>
          <BiChevronDown fontSize={"22px"} />
        </ChevronContainer>
        <p style={{ marginRight: "10px" }}>Filter</p>
      </FilterButton>
      {filterOpen && (
        <>
          <FilterArea />
          <FilterOptionsContainer visible={filterVisible}>
            {FILTER_VALUES.map((value, index) => (
              <FilterOption
                key={index}
                active={index === selected}
                onClick={() => setSelected(index)}
              >
                {value}
              </FilterOption>
            ))}
          </FilterOptionsContainer>
        </>
      )}
    </Container>
  );
};

export default PoolFilter;

const Container = styled.div`
  position: relative;
`;

const FilterButton = styled.div<{ open: boolean }>`
  align-items: center;
  background: ${({ open, theme }) =>
    open ? theme.colors.highlight : theme.colors.dark};
  border: 1px solid ${({ theme }) => theme.colors.highlight};
  border-radius: 8px;
  cursor: pointer;
  height: 44px;
  display: flex;
  justify-content: center;
  position: relative;
  transition: all 0.2s ease-in-out;
  width: 97px;
  z-index: 2;

  &:hover {
    background: ${({ theme, open }) =>
      open ? theme.colors.highlight : theme.colors.highlightDark};
  }
`;

const ChevronContainer = styled.div<{ open: boolean }>`
  display: flex;
  margin-right: 6px;
  transform: rotate(${({ open }) => (open ? "-180deg" : "0")});
  transition: all 0.2s ease-in-out;
`;

const FilterArea = styled.div`
  height: 500px;
  position: absolute;
  right: -50px;
  top: -50px;
  width: 400px;
`;

const FilterOptionsContainer = styled.div<{ visible: boolean }>`
  background: ${({ theme }) => theme.colors.highlight};
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  opacity: ${({ visible }) => (visible ? "1" : "0")};
  padding: 8px;
  position: absolute;
  right: 0;
  top: 60px;
  transition: all 0.2s ease-in-out;
`;

const FilterOption = styled.div<{ active?: boolean }>`
  align-items: center;
  background: ${({ theme, active }) =>
    active ? theme.colors.highlightLight : theme.colors.highlight};
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  height: 48px;
  padding-left: 15px;
  min-width: 256px;
  transition: all 0.2s ease-in-out;

  &:hover {
    background: ${({ theme }) => theme.colors.highlightLight};
  }
`;
