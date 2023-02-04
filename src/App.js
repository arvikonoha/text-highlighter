import TextCard from './components/TextCard/TextCard';
import { lyricsTable } from './data/lyrics';

function App() {
  return (
    <TextCard textContent={lyricsTable.eminem.dontFront} />
  );
}

export default App;
