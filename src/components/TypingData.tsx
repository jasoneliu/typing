import styled from "styled-components";

// Typing test data template
const TypingData = styled.div<{ visible: boolean }>`
  font-size: 8rem;
  color: ${(props) => props.theme.colors.secondary};
  z-index: 1;

  // make data appear during typing test
  opacity: ${(props) => (props.visible ? 0.5 : 0)};
  transition: opacity 75ms ease;
`;
interface ITypingData {
  data: number;
  visible: boolean;
}

// Data
export const WPM = ({ data, visible }: ITypingData) => {
  return <TypingData visible={visible}>{data}</TypingData>;
};

export const Accuracy = ({ data, visible }: ITypingData) => {
  return <TypingData visible={visible}>{data}%</TypingData>;
};

export const Timer = ({ data, visible }: ITypingData) => {
  return <TypingData visible={visible}>{data}</TypingData>;
};

interface IWordCount {
  data: number[];
  visible: boolean;
}
export const WordCount = ({ data, visible }: IWordCount) => {
  return (
    <TypingData visible={visible}>
      {data[0]}/{data[1]}
    </TypingData>
  );
};
