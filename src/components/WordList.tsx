import { WordDto } from "../models/word.dto";
import Word from "./Word";

interface Props {
  words: WordDto[];
  editWord: (word: WordDto) => void;
  deleteWord: (word: WordDto) => void;
}
export default function WordList({ words, editWord, deleteWord }: Props) {
  return (
    <>
      {words.map((word) => (
        <div key={word.id} className="col-md-4 mt-2">
          <Word word={word} editWord={editWord} deleteWord={deleteWord} />
        </div>
      ))}
    </>
  );
}
