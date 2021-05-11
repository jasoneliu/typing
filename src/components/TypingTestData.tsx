import styled from "styled-components";

// Typing test data template
const TypingTestData = styled.div<{ visible: boolean }>`
  font-size: 8rem;
  color: ${(props) => props.theme.colors.secondary};

  // make data appear during typing test
  opacity: ${(props) => (props.visible ? 0.5 : 0)};
  transition: opacity 250ms ease;
`;
interface ITypingTestData {
  data: number;
  visible: boolean;
}

// Data
export const WPM = ({ data, visible }: ITypingTestData) => {
  return <TypingTestData visible={visible}>{data}</TypingTestData>;
};

export const Accuracy = ({ data, visible }: ITypingTestData) => {
  return <TypingTestData visible={visible}>{data}%</TypingTestData>;
};

export const Timer = ({ data, visible }: ITypingTestData) => {
  return <TypingTestData visible={visible}>{data}</TypingTestData>;
};

interface IWordCount {
  data: number[];
  visible: boolean;
}
export const WordCount = ({ data, visible }: IWordCount) => {
  return (
    <TypingTestData visible={visible}>
      {data[0]}/{data[1]}
    </TypingTestData>
  );
};
