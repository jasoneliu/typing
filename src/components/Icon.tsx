import React from "react";
import styled, { css } from "styled-components";

interface IIcon {
  src: string;
  rotated?: boolean;
  onClick?: () => void;
  href?: string;
}

// href and ref are necessary to wrap the icon in next/link
// https://nextjs.org/docs/api-reference/next/link#if-the-child-is-a-function-component
const Icon = React.forwardRef(
  (
    { src, onClick, rotated, href }: IIcon,
    ref: React.Ref<HTMLAnchorElement>
  ) => {
    return (
      <IconContainer href={href} onClick={onClick} ref={ref}>
        <StyledIcon src={src} rotated={rotated} />
      </IconContainer>
    );
  }
);

export default Icon;

const StyledIcon = styled.div<{ src: string; rotated: boolean | undefined }>`
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
      transform: ${props.rotated ? `rotate(-120deg)` : `rotate(0deg)`};
      transition: background-color 250ms ease, transform 250ms linear;
      // wait for text to fade out before rotating back
      transition-delay: ${props.rotated ? 0 : `100ms`};
    `}
`;

const IconContainer = styled.a<{ ref: React.Ref<HTMLAnchorElement> }>`
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

interface IUserIcon {
  src: string;
  username: string;
  onClick?: () => void;
  href?: string;
}

export const UserIcon = React.forwardRef(
  (
    { src, username, onClick, href }: IUserIcon,
    ref: React.Ref<HTMLAnchorElement>
  ) => {
    return (
      <UserContainer href={href} onClick={onClick} ref={ref}>
        <UserIconContainer>
          <StyledIcon src={src} rotated={undefined} />
        </UserIconContainer>
        <Username>{username}</Username>
      </UserContainer>
    );
  }
);

const UserIconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 4rem;
  width: 4rem;
`;

const Username = styled.div`
  position: absolute;
  padding: 0.25rem;
  top: 3.75rem;

  color: ${(props) => props.theme.colors.secondary};
  transition: color 250ms ease;
`;

const UserContainer = styled.a<{ ref: React.Ref<HTMLAnchorElement> }>`
  position: relative;
  z-index: 20;
  cursor: pointer;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;

  &:hover {
    ${StyledIcon} {
      background-color: ${(props) => props.theme.colors.primary};
    }
    ${Username} {
      color: ${(props) => props.theme.colors.primary};
    }
  }
`;
