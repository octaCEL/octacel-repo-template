import { greeting } from "../src/greeting";

export default function Home() {
  return (
    <main>
      <h1>{greeting("octaCEL")}</h1>
      <p>This page is built by the Next.js template fixture.</p>
    </main>
  );
}
