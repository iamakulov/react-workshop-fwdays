import { Avatar, AvatarGroup } from "@mui/material";
import { memo } from "react";
import { useSelector } from "react-redux";
import avatar1 from "./avatar1.jpg";
import avatar2 from "./avatar2.jpg";
import avatar3 from "./avatar3.jpg";

function ActiveAuthors() {
  const activeThisMonthCount = useSelector(
    (state) =>
      state.users.filter((i) => i.lastActiveDate.includes("2022-05")).length
  );
  const activeThisMonthNames = useSelector((state) =>
    state.users
      .filter((i) => i.lastActiveDate.includes("2022-05"))
      .map((i) => i.name)
      .join(", ")
  );

  return (
    <div className="primary-pane__authors">
      <div className="primary-pane__authors-last-active">
        {activeThisMonthCount} users active this month: {activeThisMonthNames}
      </div>
      <AvatarGroup max={2}>
        <Avatar src={avatar1} />
        <Avatar src={avatar2} />
        <Avatar src={avatar3} />
      </AvatarGroup>
    </div>
  );
}

export default memo(ActiveAuthors);
