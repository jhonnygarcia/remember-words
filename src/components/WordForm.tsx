import { ChangeEvent, FormEvent, useState } from "react";
import { WordDto } from "../models/word.dto";
type HandleInputChange = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
interface Props {
  addNewWord: (word: WordDto) => void;
}
export default function WordForm({ addNewWord }: Props) {
  const initialState = {
    name: "",
    translate: "",
  };
  let nameInput: HTMLInputElement | null;
  const [word, setWord] = useState(initialState);

  const handleInputChange = (e: HandleInputChange) => {
    setWord({
      ...word,
      [e.target.name]: e.target.value,
    });
  };
  const handleNewTask = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let { name, translate } = word;
    name = (name || "").trim();
    translate = (translate || "").trim();
    if (name === "" || translate === "") {
      alert("Name and Translate is required");
      return;
    }

    addNewWord(word);
    setWord(initialState);
    nameInput?.focus();
  };
  return (
    <div className="card card-body bg-secondary rounded-0">
      <form onSubmit={handleNewTask}>
        <h2 className="card-title">Add Word</h2>
        <input
          ref={(input) => {
            nameInput = input;
          }}
          type="text"
          className="form-control mb-3 rounded-0 shadow-none border-0"
          placeholder="Word name"
          onChange={handleInputChange}
          name="name"
          value={word.name}
        />
        <textarea
          name="translate"
          cols={30}
          rows={3}
          placeholder="Translate"
          value={word.translate}
          onChange={handleInputChange}
        ></textarea>
        <p>
          <button type="submit" className="btn btn-primary btn-sm">
            Guadar
          </button>
        </p>
      </form>
    </div>
  );
}
