import { useEffect, useState } from 'react';
import styles from "../styles/style.module.scss";

const MyButton = () => {
  const [isSent, setIsSent] = useState(false);

  useEffect(() => {
    if (isSent) {
      let planePath = document.querySelector(`.${styles.circle}`);
      let planeIcon = document.querySelector(`.${styles.plane_icon}`);

      planePath.classList.add(styles.rotateCircle);
      planeIcon.classList.remove(styles.hide);

      setTimeout(() => {
        planeIcon.classList.add(styles.hide);
        planePath.classList.remove(styles.rotateCircle);
      }, 2750);
    }
  }, [isSent]);

  const handleClick = () => {
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
    }, 3000);
  };

  return (
    <>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" integrity="sha512-9usAa10IRO0HhonpyAIVpjrylPvoDwiPUiKdWk5t3PyolY1cOd4DSE0Ga+ri4AuTroPR5aQvXU9xC6qOPnzFeg==" crossorigin="anonymous" referrerpolicy="no-referrer" />
      <button className={`${styles.send_btn} ${isSent ? styles.send_btn.checked  : ''}`} onClick={handleClick}>
        <div className={styles.circle}>
          <i className={` ${styles.plane_icon} ${isSent ? '' : styles.hide}`}></i>
        </div>
        {isSent ? 'Sent' : 'Send QR via @'}
      </button>
    </>
  );
};

export default MyButton;
