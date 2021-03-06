import { useContext } from "react";
import styled from "styled-components";
import produce from "immer";
import { SettingsContext, ModeType } from "../context";

const length = {
  timed: ["15", "30", "60", "120"],
  words: ["10", "25", "50", "100"],
  quote: ["short", "medium", "long", "any"],
  // lyrics: ["short", "medium", "long", "any"],
  // books: ["short", "medium", "long", "any"],
  // code: ["short", "medium", "long", "any"],
};

const settingsList = {
  text: ["punctuation", "numbers"],
  mode: ["timed", "words", "quote"], //"lyrics", "books", "code"],
};

type SettingsType = "text" | "mode" | "length";
type TextType = "punctuation" | "numbers";

const modeToTitle = (mode: ModeType) => {
  if (mode === "timed") {
    return "seconds";
  }
  if (mode === "words") {
    return "words";
  }
  return "length";
};

const SettingsDropdown = ({
  open,
  mobileLayout,
}: {
  open: boolean;
  mobileLayout: boolean;
}) => {
  const { settings } = useContext(SettingsContext);

  return (
    <>
      {mobileLayout ? (
        <BackgroundMobile visible={open}>
          <SettingsContainer>
            {Object.entries(settingsList).map((setting, settingIdx) => (
              <SettingColumn
                key={settingIdx}
                id={settingIdx}
                setting={setting[0] as SettingsType}
                values={setting[1]}
                visible={open}
              />
            ))}
            <SettingColumn
              key={2}
              id={2}
              setting="length"
              values={length[settings.mode]}
              visible={open}
            />
          </SettingsContainer>
        </BackgroundMobile>
      ) : (
        <Background visible={open}>
          <SettingsContainer>
            {Object.entries(settingsList).map((setting, settingIdx) => (
              <SettingColumn
                key={settingIdx}
                id={settingIdx}
                setting={setting[0] as SettingsType}
                values={setting[1]}
                visible={open}
              />
            ))}
            <SettingColumn
              key={2}
              id={2}
              setting="length"
              values={length[settings.mode]}
              visible={open}
            />
          </SettingsContainer>
        </Background>
      )}
    </>
  );
};

export default SettingsDropdown;

const Background = styled.div<{ visible: boolean }>`
  display: flex;
  align-items: center;
  position: relative;
  top: 0.5rem;
  right: 1rem;

  // rounded rectangle
  background-color: ${(props) => props.theme.colors.secondary};
  border-radius: 0.5rem;
  height: 8rem;
  padding-left: ${(props) => (props.visible ? "0.5rem" : 0)};
  padding-bottom: ${(props) => (props.visible ? "0.2rem" : 0)};

  // wait for triangle to expand before expanding rectangle
  // wait for text to fade out before collapsing rectangle
  width: ${(props) => (props.visible ? "22rem" : 0)};
  transition: width 225ms ease, padding-left 0ms ease, padding-bottom 0ms ease;
  transition-delay: ${(props) => (props.visible ? "25ms" : "100ms")};
  z-index: 15;

  // triangle
  &:after {
    content: "";
    width: 0;
    height: 0;

    border-top: ${(props) => (props.visible ? "0.5rem" : 0)} solid transparent;
    border-left: ${(props) => (props.visible ? "1.1rem" : 0)} solid
      ${(props) => props.theme.colors.secondary};
    border-bottom: ${(props) => (props.visible ? "0.5rem" : 0)} solid
      transparent;

    position: absolute;
    top: ${(props) => (props.visible ? "1rem" : "1.5rem")};
    right: -1rem;

    // wait for rectangle to collapse before collapsing triangle
    transition: border-top 25ms linear, border-left 25ms linear,
      border-bottom 25ms linear, top 25ms linear;
    transition-delay: ${(props) => (props.visible ? 0 : "325ms")};
  }
`;

const BackgroundMobile = styled.div<{ visible: boolean }>`
  display: flex;
  align-items: center;
  position: relative;
  top: 0.5rem;
  right: 1rem;

  // rounded rectangle
  background-color: ${(props) => props.theme.colors.secondary};
  border-radius: 0.5rem;
  width: 22rem;
  padding-left: ${(props) => (props.visible ? "0.5rem" : 0)};
  padding-bottom: ${(props) => (props.visible ? "0.2rem" : 0)};

  // wait for triangle to expand before expanding rectangle
  // wait for text to fade out before collapsing rectangle
  height: ${(props) => (props.visible ? "8rem" : 0)};
  transition: height 225ms ease, padding-left 0ms ease, padding-bottom 0ms ease;
  transition-delay: ${(props) => (props.visible ? "25ms" : "100ms")};
  z-index: 15;

  // triangle
  &:after {
    content: "";
    width: 0;
    height: 0;

    border-left: ${(props) => (props.visible ? "0.5rem" : 0)} solid transparent;
    border-bottom: ${(props) => (props.visible ? "1.1rem" : 0)} solid
      ${(props) => props.theme.colors.secondary};
    border-right: ${(props) => (props.visible ? "0.5rem" : 0)} solid transparent;

    position: absolute;
    top: -1rem;
    right: ${(props) => (props.visible ? "20rem" : "20.5rem")};

    // wait for rectangle to collapse before collapsing triangle
    transition: border-left 25ms linear, border-bottom 25ms linear,
      border-right 25ms linear, right 25ms linear;
    transition-delay: ${(props) => (props.visible ? 0 : "325ms")};
  }
`;

const SettingsContainer = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-around;
  width: 100%;

  font-size: 1rem;
  color: ${(props) => props.theme.colors.primary};
`;

interface ISettingColumn {
  id: number;
  setting: SettingsType;
  values: string[];
  visible: boolean;
}

const SettingColumn = ({ id, setting, values, visible }: ISettingColumn) => {
  const { settings, setSettings } = useContext(SettingsContext);

  return (
    <StyledSettingColumn visible={visible}>
      <SettingTitle>
        {setting === "length" ? modeToTitle(settings.mode) : setting}
      </SettingTitle>
      {values.map((value, valueIdx) => (
        <SettingOption
          key={`${id}-${valueIdx}`}
          onClick={
            setting === "text"
              ? () => {
                  // toggles whether the button is active
                  setSettings((currSettings) => {
                    return produce(currSettings, (nextSettings) => {
                      nextSettings[setting][value as TextType] =
                        !currSettings[setting][value as TextType];
                    });
                  });
                }
              : () => {
                  // sets current button to active, all others to inactive
                  setSettings((currSettings) => {
                    return produce(currSettings, (nextSettings) => {
                      if (setting === "length") {
                        nextSettings.length[settings.mode] = value;
                      } else {
                        nextSettings[setting] = value as ModeType;
                      }
                    });
                  });
                }
          }
        >
          {setting === "text" ? (
            <SquareButton active={settings[setting][value as TextType]} />
          ) : (
            <RoundButton
              active={
                setting === "length"
                  ? settings.length[settings.mode] === value
                  : settings[setting] === value
              }
            />
          )}
          {value}
        </SettingOption>
      ))}
    </StyledSettingColumn>
  );
};

const StyledSettingColumn = styled.div<{ visible: boolean }>`
  display: flex;
  flex-flow: column nowrap;
  flex: 0 0 79.6px;
  gap: 0.02rem;

  // fade in/out column
  visibility: ${(props) => (props.visible ? "visible" : "hidden")};
  opacity: ${(props) => (props.visible ? 1 : 0)};
  transition: opacity 100ms ease;
  transition-delay: ${(props) => (props.visible ? `250ms` : 0)};
`;

// Title and buttons for each setting option

const SettingOption = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
`;

const SettingTitle = styled.div`
  font-size: 1rem;
  text-decoration: underline;
`;

const RoundButton = styled.div<{ active: boolean }>`
  position: relative;
  height: 0.8rem;
  width: 0.8rem;
  border-radius: 50%;
  border: 0.05rem solid ${(props) => props.theme.colors.accent};
  background-color: ${(props) => props.theme.colors.primary};

  // button selected
  &:after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    height: 0.5rem;
    width: 0.5rem;
    border-radius: 50%;
    background-color: ${(props) => props.theme.colors.accent};
    opacity: ${(props) => (props.active ? 1 : 0)};
    transition: opacity 100ms ease;
  }
`;

const SquareButton = styled(RoundButton)`
  border-radius: 25%;

  &:after {
    border-radius: 25%;
  }
`;
