import { EMOTION_SOURCE_NAME, PRAGMA_VALUE } from '../../consts';
import { findImport } from '../utils';

export default body => {
  const importNode = findImport(body, EMOTION_SOURCE_NAME);

  importNode.comments = [
    {
      type: 'CommentBlock',
      value: ` @jsx ${PRAGMA_VALUE} `,
    },
  ];
};
