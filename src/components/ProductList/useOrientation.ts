import { debounce } from 'lodash-es';
import { useEffect, useState } from 'react';
import { Orientation } from '../../types';

export function useOrientation(): Orientation {
  const [orientation, setOrientation] = useState<Orientation>(() => {
    if (window.matchMedia('(orientation: landscape)').matches) {
      return 'landscape';
    }
    return 'portrait';
  });

  useEffect(() => {
    const debouncedHandleResize = debounce(function handleResize() {
      if (window.matchMedia('(orientation: landscape)').matches) {
        setOrientation('landscape');
      } else {
        setOrientation('portrait');
      }
    }, 500);

    window.addEventListener('resize', debouncedHandleResize);
    return () => {
      window.removeEventListener('resize', debouncedHandleResize);
    };
  });

  return orientation;
}
