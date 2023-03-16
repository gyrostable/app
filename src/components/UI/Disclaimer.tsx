import styled from "styled-components";
import { useEffect, useState } from "react";
import { AiOutlineWarning } from "react-icons/ai";
import Column from "./Column";

interface DisclaimerInput {
  type: string;
  content: string;
  links?: {
    url: string;
    range: number[];
  }[];
}

const Disclaimer = ({
  input,
  noClose,
}: {
  input: DisclaimerInput;
  noClose?: boolean;
}) => {
  const [disclaimerUnderstood, setDisclaimerUnderstood] = useState(true);

  useEffect(() => {
    setDisclaimerUnderstood(
      Boolean(localStorage.getItem(`${input.type}-disclaimer-understood`))
    );
  }, []);

  function onUnderstood() {
    if (typeof window !== "undefined") {
      localStorage?.setItem(`${input.type}-disclaimer-understood`, "true");
    }
    setDisclaimerUnderstood(true);
  }

  return !noClose && disclaimerUnderstood ? (
    <Spacer />
  ) : (
    <DisclaimerBox>
      <IconBox>
        <AiOutlineWarning
          size="27px"
          style={{ marginRight: "10px", fontSize: "28px" }}
        />
      </IconBox>

      <ContentContainer>
        {renderContent(input)}
        {!noClose && (
          <UnderstoodText onClick={onUnderstood}>Understood</UnderstoodText>
        )}
      </ContentContainer>
    </DisclaimerBox>
  );
};

const DisclaimerBox = styled.div`
  align-items: center;
  background: ${({ theme }) => theme.colors.warning};
  border-radius: 8px;
  color: black;
  display: flex;
  justify-content: center;
  margin: 50px auto;
  padding: 20px;

  a {
    text-decoration: underline;
  }
`;

const IconBox = styled.div`
  min-width: 50px;
`;

const UnderstoodText = styled.p`
  cursor: pointer;
  margin: 10px;
  margin-top: 5px;
  text-align: center;
`;

const Spacer = styled.div`
  height: 30px;
`;

const ContentContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export default Disclaimer;

function renderContent(input: DisclaimerInput) {
  if (!input.links) return <p>{input.content}</p>;

  const linkIntervals = input.links.map(({ range }) => range);
  const allIntervals = linkIntervals.reduce(
    (acc, el, index) => {
      if (index === linkIntervals.length - 1) {
        return [...acc, el, [el[1], input.content.length]];
      }
      return [...acc, el, [el[1], linkIntervals[index + 1][0]]];
    },
    [[0, linkIntervals[0][0]]]
  );

  return (
    <p>
      {allIntervals.map(([start, end], index) => {
        const contentChunk = input.content.slice(start, end);
        if (index % 2 === 0) {
          return <span key={index}>{contentChunk}</span>;
        }
        return (
          <a
            key={index}
            href={
              (
                input.links as {
                  url: string;
                  range: number[];
                }[]
              )[(index - 1) / 2].url
            }
            target="_blank"
            rel="noreferrer"
          >
            {contentChunk}
          </a>
        );
      })}
    </p>
  );
}
