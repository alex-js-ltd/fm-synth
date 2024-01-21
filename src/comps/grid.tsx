import Note from './note';
import { PadListUL } from 'comps/lib';
import { notStrictEqual } from 'assert';

const notes = [44, 8, 54, 65, 22, 10, 52, 5];

const Grid = () => (
  <PadListUL>
    {notes.map((note) => (
      <li key={note}>
        <Note frequency={note} />
      </li>
    ))}
  </PadListUL>
);

export default Grid;
