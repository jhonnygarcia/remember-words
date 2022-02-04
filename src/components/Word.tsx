import { WordDto } from "./../models/word.dto";

interface Props {
  word: WordDto;
  editWord: (word: WordDto) => void;
  deleteWord: (word: WordDto) => void;
}
export default function Word({ word, deleteWord, editWord }: Props) {
  return (
    <>
      <div className="card card-body">
        <h3 className="card-title">{word.name}</h3>
        <p>{word.translate}</p>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button
            onClick={() => editWord(word)}
            className="btn btn-primary btn-sm mr-2"
          >
            Editar
          </button>
          <button
            onClick={() => deleteWord(word)}
            className="btn btn-danger btn-sm"
          >
            Eliminar
          </button>
        </div>
      </div>
    </>
  );
}
