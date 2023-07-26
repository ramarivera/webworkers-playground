import './App.css';
import { AppWrapper } from './core/AppWrapper';
import { TextMeasurerPage } from './text-measuring/components/TextMeasurerPage';

function App() {
  return (
    <AppWrapper>
      <TextMeasurerPage
        initialText="Hello!"
        measurerType="webworker"
      ></TextMeasurerPage>
    </AppWrapper>
  );
}

export default App;
