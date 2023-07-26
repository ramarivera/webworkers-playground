import './App.css';
import { AppWrapper } from './core/AppWrapper';
import { TextMeasurer } from './text-measuring/components/TextMeasurer';

function App() {
  return (
    <AppWrapper>
      <TextMeasurer
        initialText="Hello!"
        measurerType="canvas"
        selectedFont="custom"
      ></TextMeasurer>
    </AppWrapper>
  );
}

export default App;
