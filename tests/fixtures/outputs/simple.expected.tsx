/* @jsx jsx */
import { jsx } from "@emotion/core";

import { Box } from "@stoplight/ui-kit";
import * as React from 'react';

export const Simple: React.FunctionComponent<any> = (props: Partial<{ className: string }>) => {
  const onClick: React.ReactEventHandler<HTMLElement> = (e) => {
    (e.currentTarget as HTMLDivElement).textContent = 'foo';
  };

  return (
    <Box fontSize="12px" display="block" onClick={onClick}>
      <Box
        as="span"
        border="0 px"
        style={{
          whiteSpace: 'nowrap'
        }}>test</Box>
    </Box>
  );
};
