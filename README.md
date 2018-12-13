# ui-kit-converter

## Install

```sh
yarn global add ui-kit-converter
```

or if npm is your package manager

```sh
npm install --global ui-kit-converter
```

## Description

Well, it's quite simple. It just converts legacy components with inline styles into UI-Kit.

```typescript jsx
import * as React from 'react';

export const MyComponent: React.FunctionComponent<IMyComponent> = ({ onClick, ...props }) => {
  return (
    <div {...props} style={{display: 'block', fontSize: '12px'}}>
      <span style={{border: '0 px', whiteSpace: 'nowrap'}}>my component</span>
    </div>
  );
};
```

is transformed to

```typescript jsx
import { Box } from "@stoplight/ui-kit";
import * as React from 'react';

export const MyComponent: React.FunctionComponent<IMyComponent> = ({ onClick, ...props }) => {
  return (
    <Box fontSize="12px" display="block" {...props}>
      <Box
        as="span"
        border="0 px"
        style={{
          whiteSpace: 'nowrap'
        }}>my component</Box>
    </Box>
  );
};
```

For more examples go to tests/fixtures.

## Usage

```sh
to-ui-kit src/
```

## LICENSE

[MIT](https://github.com/P0lip/ui-kit-converter/blob/master/LICENSE)
