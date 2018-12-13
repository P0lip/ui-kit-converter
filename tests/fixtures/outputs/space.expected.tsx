import { Box } from "@stoplight/ui-kit";
import * as React from 'react';

export default () => {
  return (
    <Box m="0" fontSize="12px" display="block">
      <Box
        as="span"
        border="0 px"
        style={{
          whiteSpace: 'nowrap'
        }}>test</Box>
    </Box>
  );
}
