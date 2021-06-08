import styled from "styled-components";

const StyledButton = styled.button`
  font-size: 1rem;
  padding: 0.5rem;
  color: ${(props) => props.theme.colors.primary};
  cursor: pointer;

  border: 1px solid ${(props) => props.theme.colors.primary};
  border-radius: 0.3rem;
  background-color: ${(props) => props.theme.colors.background};
  transition: background-color 250ms ease;

  &:hover {
    background-color: ${(props) => props.theme.colors.secondary};
  }
`;

export default StyledButton;
