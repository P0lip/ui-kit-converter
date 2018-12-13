import * as React from 'react';

export const Simple: React.FunctionComponent<any> = (props: Partial<{ className: string }>) => {
  const onClick: React.ReactEventHandler<HTMLElement> = (e) => {
    (e.currentTarget as HTMLDivElement).textContent = 'foo';
  };

  return (
    <div onClick={onClick} style={{display: 'block', fontSize: '12px'}}>
      <span style={{border: '0 px', whiteSpace: 'nowrap'}}>test</span>
    </div>
  );
};
