import { Box } from "@stoplight/ui-kit";
import * as React from 'react';

export default ({ handleClick, ...rest }) => {
  return (
    <Box fontSize="12px" display="block" onClick={handleClick}>
      <Box
        as="span"
        border="0 px"
        style={{
          'white-space': 'nowrap'
        }}>test</Box>
    </Box>
  );
}
