import Birthday from "./_components/Birthday";
import Forget from "./_components/Forget";
import Gaathayein from "./_components/Gaathayein";
import Hero from "./_components/Hero";
import MemoryJar from "./_components/MemoryJar";
import Puzzle from "./_components/Puzzle";

export default function Home() {
  return (
    <main>
      <Hero />
      <Birthday />
      <Puzzle />
      <MemoryJar />
      <Forget />
      <Gaathayein />
    </main>
  );
}
