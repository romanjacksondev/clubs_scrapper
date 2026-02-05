import styles from "./page.module.css";



export default async function Home() {
  const name = "roman"
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Welcome to Clubs Scrapper!</h1>
        <p>Mock name from API: <strong>{name}</strong></p>
      </main>
    </div>
  );
}