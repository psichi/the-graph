import { configure } from '@kadira/storybook';
// import '../src/index.css';
import 'font-awesome-webpack';
import '../themes/the-graph-dark.css';
import '../src/stories/awesome.css';

function loadStories() {
  require('../src/stories');
}

configure(loadStories, module);
