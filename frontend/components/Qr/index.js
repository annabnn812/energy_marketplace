// Qr.js

import styles from "../../styles/style.module.scss";
import QRCode from "qrcode.react";

function Qr({ value, invalidAddress, amount, network }) {
    const url = `ethereum:${value}?value=${amount}&gas=20000&gasPrice=1000000000&currency=${network}`;

    return (
        <a href={url} target="_blank" rel="noreferrer">
            <QRCode
                className={styles.Qr}
                value={url}
                bgColor={"#ffffff"} // The QR Background Color
                fgColor={invalidAddress ? "#EF233C" :"#000000" } // The Qr Color
                level={"Q"} // Levels Can be L,M,Q,H Default is L
                includeMargin={false}
                renderAs={"svg"}
            />
        </a>
    );
}

export default Qr;
