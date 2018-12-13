import * as React from 'react';

export default ({ handleClick, ...rest }) => {
  return (
    <div onClick={handleClick} style={{display: 'block', fontSize: '12px'}}>
      <span style={{border: '0 px', 'white-space': 'nowrap'}}>test</span>
    </div>
  );
}
