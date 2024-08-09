import { useTheme } from "@mui/material/styles"; // or @mui/joy/styles
import useMediaQuery from "@mui/material/useMediaQuery";
import { Breakpoint } from "@mui/system";

export const useWidth = (): Breakpoint => {
  const theme = useTheme();
  const keys = [...theme.breakpoints.keys];
  return (
    keys.reduce((output: BreakpointOrNull, key: Breakpoint) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const matches = useMediaQuery(theme.breakpoints.up(key));

      return matches ? key : output;
    }, null) ?? "xs"
  );
};
