import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import Brightness2Icon from "@mui/icons-material/Brightness2";
import { memo, useContext } from "react";
import { DarkModeContext } from "../DarkModeContext";
import { useContextSelector } from "use-context-selector";
import "./index.css";

function DarkModeSwitcher() {
  const mode = useContextSelector(DarkModeContext, (context) => context.mode);
  const setMode = useContextSelector(
    DarkModeContext,
    (context) => context.setMode
  );

  return (
    <div className="theme-switcher">
      <ToggleButtonGroup
        size="small"
        value={mode}
        exclusive
        onChange={(_e, value) => setMode(value)}
        aria-label="text alignment"
      >
        <ToggleButton value="light">
          <WbSunnyIcon />
        </ToggleButton>
        <ToggleButton value="dark">
          <Brightness2Icon />
        </ToggleButton>
      </ToggleButtonGroup>
    </div>
  );
}

export default memo(DarkModeSwitcher);
