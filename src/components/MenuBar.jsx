import styles from './MenuBar.module.css'

const MenuBar = () => {
    return (
        <div className={styles.bar}>
            <ul className={styles.menuList}>
                <li className={styles.menuItem}>팔로잉</li>
                <li className={styles.menuItem}>탐색</li>
                <li className={styles.menuItem}>만들기</li>
            </ul>
        </div>
    );
};

export default MenuBar;