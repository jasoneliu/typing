import styled from "styled-components";

const Footer = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  height: 4rem;
  font-size: 1rem;
  color: ${(props) => props.theme.colors.secondary};
`;

export default Footer;
