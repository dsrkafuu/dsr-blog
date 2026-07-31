'use client';

import { useEffect, useState } from 'react';

interface SakanaShowButtonProps {
  onClick: () => void;
}

export const SakanaShowButton = ({ onClick }: SakanaShowButtonProps) => {
  return (
    <button type='button' className='sakanawbtn' onClick={onClick}>
      显示小组件
    </button>
  );
};

const SakanaBtn = () => {
  const [showBtn, setShowBtn] = useState(false);

  useEffect(() => {
    window._changeSakanaState = (state: string) => {
      setShowBtn(state === 'hide');
    };
    return () => {
      window._changeSakanaState = null;
    };
  }, []);

  const handleClick = () => {
    if (window._sakana?.show) {
      window._sakana.show();
    }
    setShowBtn(false);
  };

  if (!showBtn) {
    return null;
  }
  return <SakanaShowButton onClick={handleClick} />;
};

export default SakanaBtn;
