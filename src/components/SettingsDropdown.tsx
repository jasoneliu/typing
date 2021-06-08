import { useContext } from "react";
import styled from "styled-components";
import produce from "immer";
import { SettingsContext } from "../context";

const length = {
  timed: ["15", "30", "60", "120"],
  words: ["10", "25", "50", "100"],
  quotes: ["short", "medium", "long", "any"],
  // lyrics: ["short", "medium", "long", "any"],
  // books: ["short", "medium", "long", "any"],
  // code: ["short", "medium", "long", "any"],
};

const settingsList = {
  text: ["punctuation", "numbers"],
  mode: ["timed", "words", "quotes"], //"lyrics", "books", "code"],
};

type settingsType = "text" | "mode" | "length";
type textType = "punctuation" | "numbers";
type modeType = "timed" | "words" | "quotes"; //| "lyrics" | "books" | "code";

const modeToTitle = (mode: modeType) => {
  if (mode === "timed") {
    return "seconds";
  }
  if (mode === "words") {
    return "words";
  }
  return "length";
};

const SettingsDropdown = ({ open }: { open: boolean }) => {
  const { settings } = useContext(SettingsContext);

  return (
    <Background visible={open}>
      <SettingsContainer>
        {Object.entries(settingsList).map((setting, settingIdx) => (
          <SettingColumn
            key={settingIdx}
            id={settingIdx}
            setting={setting[0] as settingsType}
            values={setting[1]}
            visible={open}
          />
        ))}
        <SettingColumn
          key={2}
          id={2}
          setting="length"
          values={length[settings.mode as modeType]}
          visible={open}
        />
      </SettingsContainer>
    </Background>
  );
};

export default SettingsDropdown;

const Background = styled.div<{ visible: boolean }>`
  display: flex;
  align-items: center;
  position: relative;
  top: 0.5rem;
  right: 0.5rem;

  // rounded rectangle
  background-color: ${(props) => props.theme.colors.secondary};
  border-radius: 0.5rem;
  height: 8rem;
  padding-left: ${(props) => (props.visible ? `0.5rem` : 0)};
  padding-bottom: ${(props) => (props.visible ? `0.2rem` : 0)};

  // wait for triangle to expand before expanding rectangle
  // wait for text to fade out before collapsing rectangle
  width: ${(props) => (props.visible ? `22rem` : 0)};
  transition: width 225ms ease, padding-left 0ms ease, padding-bottom 0ms ease;
  transition-delay: ${(props) => (props.visible ? `25ms` : `100ms`)};
  z-index: 15;

  // triangle
  &:after {
    content: "";
    width: 0;
    height: 0;

    border-top: ${(props) => (props.visible ? `0.5rem` : 0)} solid transparent;
    border-left: ${(props) => (props.visible ? `1rem` : 0)} solid
      ${(props) => props.theme.colors.secondary};
    border-bottom: ${(props) => (props.visible ? `0.5rem` : 0)} solid
      transparent;

    position: absolute;
    top: ${(props) => (props.visible ? `1rem` : `1.5rem`)};
    right: -1rem;

    // wait for rectangle to collapse before collapsing triangle
    transition: border-left 25ms linear, border-top 25ms linear,
      border-bottom 25ms linear, top 25ms linear;
    transition-delay: ${(props) => (props.visible ? 0 : `325ms`)};
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
  setting: settingsType;
  values: string[];
  visible: boolean;
}

const SettingColumn = ({ id, setting, values, visible }: ISettingColumn) => {
  const { settings, setSettings } = useContext(SettingsContext);

  return (
    <StyledSettingColumn visible={visible}>
      <SettingTitle>
        {setting === "length"
          ? modeToTitle(settings.mode as modeType)
          : setting}
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
                      nextSettings[setting][value as textType] =
                        !currSettings[setting][value as textType];
                    });
                  });
                }
              : () => {
                  // sets current button to active, all others to inactive
                  setSettings((currSettings) => {
                    return produce(currSettings, (nextSettings) => {
                      if (setting === "length") {
                        nextSettings.length[settings.mode as modeType] = value;
                      } else {
                        nextSettings[setting] = value;
                      }
                    });
                  });
                }
          }
        >
          {setting === "text" ? (
            <SquareButton active={settings[setting][value as textType]} />
          ) : (
            <RoundButton
              active={
                setting === "length"
                  ? settings.length[settings.mode as modeType] === value
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
