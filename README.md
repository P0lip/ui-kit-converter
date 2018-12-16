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

The only purpose of this converter is to convert 'legacy' components to UI-Kit.
It makes use of both inline styles and external stylesheets (if provided).

The converter does its best to transform as many components as possible, yet it supports limited set of cases.
Although, the code styling is preserved, you may still need to make code-style changes (i.e. sort imports etc.)

Styled components should be isolated, so if you have styles with declarations that rely on presence of given node or style siblings, you must adjust them.

Unsafe changes are not applied in most cases, but this does not mean the converter won't break your code.


```typescript jsx
import * as React from 'react';
import cn from 'classnames';

export const MyComponent: React.FunctionComponent<IMyComponent> = ({ onClick, ...props }) => {
  return (
    <div {...props} className="pin-l relative" style={{ display: 'block', backgroundColor: 'blue', userSelect: 'none' }}>
      <a style={{ fontSize: '20px' }} href="www.example.com">example.com</a>
      <span className="flex" style={{ alignItems: 'center' }}>I am aligned!</span>
      <button className={cn('cursor-move absolute pin-l border-b')}>I support classnames too!</button>
    </div>
  );
};
```

is transformed to

```typescript jsx
/* @jsx jsx */
import { jsx } from "@emotion/core";

import { Box, Link, Flex, Button } from "@stoplight/ui-kit";
import * as React from 'react';
import cn from 'classnames';

export const MyComponent: React.FunctionComponent<IMyComponent> = ({ onClick, ...props }) => {
  return (
    <Box
      position="relative"
      left={0}
      backgroundColor="blue"
      display="block"
      {...props}
      className="pin-l relative"
      style={{
        userSelect: 'none'
      }}>
      <Link fontSize="20px" href="www.example.com">example.com</Link>
      <Flex as="span" alignItems="center" className="flex">I am aligned!</Flex>
      <Button
        borderBottomWidth="1px"
        cursor="move"
        position="absolute"
        left={0}
        className={cn('cursor-move absolute pin-l border-b')}>I support classnames too!</Button>
    </Box>
  );
};
```

Pretty neat, huh?

For more examples go to tests/fixtures.

## Requirements

* Node >= 10

## Usage

```sh
to-ui-kit src/
```

or if you want to include styles from external stylesheet(s)

```sh
to-ui-kit --stylesheet https://cdn.jsdelivr.net/npm/tailwindcss/dist/tailwind.min.css -- src/
```

You can also provide custom plugins to the parser to handle non-standard syntax.
To do so, just pass `--parser.plugins typescript asyncGenerators`.

A full list of available plugins is [here](https://babeljs.io/docs/en/babel-parser#plugins)

## LICENSE

[MIT](https://github.com/P0lip/ui-kit-converter/blob/master/LICENSE)
