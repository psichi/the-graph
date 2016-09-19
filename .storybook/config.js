import { configure } from '@kadira/storybook';
import 'font-awesome-webpack';
import '../themes/the-graph-dark.css';
import '../themes/the-graph-light.css';
import '../src/stories/index.css';

function loadStories() {
  require('../src/stories');
}

configure(loadStories, module);
