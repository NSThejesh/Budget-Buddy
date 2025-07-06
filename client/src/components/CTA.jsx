import styles from "../style";
import Button from "./Button";

const CTA = () => (
    <section
        className={`${styles.flexCenter} ${styles.marginY} ${styles.padding} sm:flex-row flex-col 
        rounded-[20px] backdrop-blur-2xl bg-white/20 dark:bg-white/10 border border-white/30 dark:border-white/20 shadow-2xl
        hover:bg-white/30 dark:hover:bg-white/15 transition-all duration-300`}
    >
        <div className="flex-1 flex flex-col">
            <h2 className={styles.heading2}>
                Ready to simplify your finances?
            </h2>
            <p className={`${styles.paragraph} max-w-[470px] mt-5 text-black dark:text-white`}>
                Track expenses, set budgets, and reach your financial goals — all with Budget Buddy. Join thousands managing their money smarter.
            </p>
        </div>

        <div className={`${styles.flexCenter} sm:ml-10 ml-0 sm:mt-0 mt-10`}>
            <Button text="Get Started" />
        </div>
    </section>
);

export default CTA;
