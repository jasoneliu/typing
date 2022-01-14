import React from "react";
import styled, { css } from "styled-components";

interface IIcon {
  src: string;
  rotated?: boolean;
  href?: string;
  userIcon?: boolean;
  username?: string;
  onClick?: () => void;
}

// href and ref are necessary to wrap the icon in next/link
// https://nextjs.org/docs/api-reference/next/link#if-the-child-is-a-function-component
const Icon = React.forwardRef(
  (
    { src, rotated, href, userIcon, username, onClick }: IIcon,
    ref: React.Ref<HTMLAnchorElement>
  ) => {
    return userIcon ? (
      <UserContainer href={href} onClick={onClick} ref={ref}>
        <IconContainer>
          <StyledIcon src={src} rotated={undefined} />
        </IconContainer>
        <Username>{username}</Username>
      </UserContainer>
    ) : (
      <IconContainer href={href} onClick={onClick} ref={ref}>
        <StyledIcon src={src} rotated={rotated} />
      </IconContainer>
    );
  }
);

export default Icon;

const StyledIcon = styled.div<{
  src: string;
  rotated: boolean | undefined;
}>`
  height: 3rem;
  width: 3rem;
  mask: ${(props) => `url(${props.src})`} no-repeat 50% 50%;
  z-index: 20;

  background-color: ${(props) => props.theme.colors.secondary};
  transition: background-color 250ms ease;

  // rotate icon
  ${(props) =>
    props.rotated !== undefined &&
    css`
      transform: ${props.rotated ? "rotate(-120deg)" : "rotate(0deg)"};
      transition: background-color 250ms ease, transform 250ms linear;
      // wait for text to fade out before rotating back
      transition-delay: ${props.rotated ? 0 : "100ms"};
    `}
`;

const IconContainer = styled.a<{
  ref?: React.Ref<HTMLAnchorElement>;
}>`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 4rem;
  width: 4rem;
  z-index: 20;
  cursor: pointer;

  // change icon color on hover
  &:hover {
    ${StyledIcon} {
      background-color: ${(props) => props.theme.colors.primary};
    }
  }
`;

const Username = styled.div`
  position: absolute;
  padding: 0.25rem;
  top: 3.75rem;

  color: ${(props) => props.theme.colors.secondary};
  transition: color 250ms ease;
`;

const UserContainer = styled.a<{ ref: React.Ref<HTMLAnchorElement> }>`
  display: flex;
  justify-content: center;
  flex-flow: row nowrap;
  position: relative;
  z-index: 20;
  cursor: pointer;

  // change icon and username color on hover
  &:hover {
    ${StyledIcon} {
      background-color: ${(props) => props.theme.colors.primary};
    }
    ${Username} {
      color: ${(props) => props.theme.colors.primary};
    }
  }
`;
