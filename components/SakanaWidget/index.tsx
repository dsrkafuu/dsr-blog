'use client';

import 'sakana-widget/lib/index.css';
import './index.scss';
import { useEffect } from 'react';
import SakanaWidget from 'sakana-widget';

const Widget = () => {
  useEffect(() => {
    let inst: SakanaWidget | null = null;
    const el = document.querySelector('#sakana-widget');
    if (el && !el.classList.length) {
      inst = new SakanaWidget().mount('#sakana-widget');
    }
    return () => {
      if (inst) {
        inst.unmount();
      }
    };
  }, []);

  return <div id='sakana-widget' />;
};

export default Widget;
