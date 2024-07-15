import styles from './SelectBar.module.css'

const SelectBar = () => {
    return (
        <div className={styles.header}>
            <div className={styles.bar}>
                <ul className={styles.menuList}>
                    <li className={styles.menuItem}>팔로워</li>
                    <li className={styles.menuItem}>팔로잉</li>
                </ul>
            </div>
        </div>
    );
};

export default SelectBar;