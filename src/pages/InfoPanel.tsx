import { useEffect, useRef } from 'react';
import styles from './InfoPanel.module.scss';

interface Props {
  onClick: () => void;
  targetClassName: string;
}

function InfoPanel({ onClick, targetClassName }: Props) {
  const infoPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleEscapeKey(e: KeyboardEvent) {
      if (e.code === 'Escape') {
        onClick();
      }
    }
    window.addEventListener('keyup', handleEscapeKey);
    const targetRect = document.querySelector(`.${targetClassName}`)?.getBoundingClientRect();
    if (targetRect && infoPanelRef.current) {
      const infoPanelRect = infoPanelRef.current.getBoundingClientRect();
      infoPanelRef.current.style.top = `${targetRect.top}px`;
      infoPanelRef.current.style.left = `${targetRect.left - infoPanelRect.width}px`;
    }
    return () => {
      window.removeEventListener('keyup', handleEscapeKey);
    };
  }, [onClick, targetClassName]);

  return (
    <div>
      <section className={styles.overlay} onClick={onClick}></section>
      <section className={styles.infoPanel} ref={infoPanelRef}>
        <h3 style={{ margin: 0 }}>
          <b>Examples:</b>
        </h3>
        <p className={styles.smallLabel}>to search by model and size enter:</p>
        <p className={styles.label}>miura 45</p>
        <p className={styles.smallLabel}>or</p>
        <p className={styles.label}>scarpa vapor 41.5</p>
        <p className={styles.smallLabel}>to search just by size enter:</p>
        <p className={styles.label}>38</p>
        <p className={styles.smallLabel}>
          or to search <b>EVERYTHING</b> leave text empty
        </p>
      </section>
    </div>
  );
}

export default InfoPanel;
