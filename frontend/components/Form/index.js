// Form.js

import styles from "../../styles/style.module.scss";

function Form({ address, changeAddress, network, changeNetwork, invalidAddress, amount, changeAmount }) {
    return (
        <div className={styles.Form}>
            <h5>Pay your bill with crypto</h5>
            <form>
                <select value={network} onChange={changeNetwork}>
                    <option hidden>Select Crypto Network</option>
                    <option value="btc">Avalanche (avax)</option>
                    <option value="eth">Ethereum (ETH)</option>
                    <option value="xrp">Chainlink (link)</option>
                    <option value="xrp">Polygon zkEVM (ETH)</option>
                </select>
                <input
                    type="text"
                    value={address}
                    onChange={changeAddress}
                    className={invalidAddress ? styles.dangerous : null}
                />
                <input
                    type="number"
                    placeholder="Amount in USD"
                    value={amount}  // Ensure the input value is controlled by the state
                    onChange={changeAmount}  // Add an onChange handler for the amount
                />
            </form>
        </div>
    );
}

export default Form;
