import "bootswatch/dist/materia/bootstrap.min.css";
import { useEffect, useState } from "react";
import { WordDto } from "./models/word.dto";
import WordList from "./components/WordList";
import WordForm from "./components/WordForm";

function App() {
  const KEY_CACHE_WORDS = "words-translate";
  const [words, setWords] = useState<WordDto[]>([]);

  useEffect(() => {
    const cache = localStorage.getItem(KEY_CACHE_WORDS);
    let data: WordDto[];
    try {
      data = JSON.parse(cache || "") as WordDto[];
    } catch (err) {
      data = [];
    }
    data = data.sort((a, b) =>
      a.name > b.name ? 1 : b.name > a.name ? -1 : 0
    );
    setWords(data);
  }, []);

  const getCurrentTimestamp = (): number => new Date().getTime();
  const addNewWord = (word: WordDto) => {
    let value = [
      ...words,
      { ...word, id: getCurrentTimestamp(), complete: false },
    ];
    value = value.sort((a, b) =>
      a.name > b.name ? 1 : b.name > a.name ? -1 : 0
    );
    setWords(value);
    localStorage.setItem(KEY_CACHE_WORDS, JSON.stringify(value));
  };
  const editWord = (word: WordDto) => {
    const newWords = words.map((current) => {
      if (current.id === word.id) {
        current.name = word.name;
        current.translate = word.translate;
        current.complete = word.complete;
      }
      return current;
    });
    setWords(newWords);
  };
  const deleteWord = (word: WordDto) =>
    setWords(words.filter((w) => w.id !== word.id));
  return (
    <main className="container p-4">
      <div className="row">
        <div className="col-md-3">
          <WordForm addNewWord={addNewWord} />
        </div>
        <div className="col-md-9">
          <div className="row">
            <WordList
              words={words}
              editWord={editWord}
              deleteWord={deleteWord}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
