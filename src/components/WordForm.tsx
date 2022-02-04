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
      alert("El Texto y Traducción son requeridos");
      return;
    }

    addNewWord(word);
    setWord(initialState);
    nameInput?.focus();
  };
  return (
    <div className="card card-body bg-secondary rounded-0">
      <form onSubmit={handleNewTask}>
        <h3 className="card-title">Añadir Texto</h3>
        <input
          ref={(input) => {
            nameInput = input;
          }}
          type="text"
          className="form-control mb-3 rounded-0 shadow-none border-0"
          placeholder="Texto"
          onChange={handleInputChange}
          name="name"
          value={word.name}
        />
        <textarea
          name="translate"
          cols={30}
          rows={3}
          placeholder="Traducción"
          value={word.translate}
          onChange={handleInputChange}
        ></textarea>
        <p>
          <button type="submit" className="btn btn-primary btn-sm">
            Guardar
          </button>
        </p>
      </form>
    </div>
  );
}
