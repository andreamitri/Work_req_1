import { useEffect, useState } from "react";
import "./App.css";

interface FunFact {
  text: string;
}

interface FunFactsData {
  funFacts: FunFact[];
}

const YOUR_NAME = "Andrea";
const ROTATE_INTERVAL_MS = 2000;

function App() {
  const [funFacts, setFunFacts] = useState<FunFact[]>([]);
  const [currentFact, setCurrentFact] = useState<string>(
    "Loading fun facts...",
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/funfacts.json")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to load funfacts.json (${res.status})`);
        }
        return res.json() as Promise<FunFactsData>;
      })
      .then((data) => {
        setFunFacts(data.funFacts);
        if (data.funFacts.length > 0) {
          const random =
            data.funFacts[Math.floor(Math.random() * data.funFacts.length)];
          setCurrentFact(random.text);
        }
      })
      .catch((err: unknown) => {
        setError(
          err instanceof Error
            ? err.message
            : "Unknown error loading fun facts",
        );
      });
  }, []);

  useEffect(() => {
    if (funFacts.length === 0) return;

    const intervalId = setInterval(() => {
      const random = funFacts[Math.floor(Math.random() * funFacts.length)];
      setCurrentFact(random.text);
    }, ROTATE_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [funFacts]);

  return (
    <main className="app">
      <h1>Hi, I'm {YOUR_NAME} 👋</h1>
      <p className="subtitle">Here's a random fun fact about me:</p>

      <div className="fact-card">
        <p className="fact-text">{currentFact}</p>
      </div>
    </main>
  );
}

export default App;
