import { Component } from 'preact';

interface KeyboardListenerProps {
  callback: (event: KeyboardEvent) => void;
}

export class KeyboardListener extends Component<KeyboardListenerProps> {
  constructor(props: KeyboardListenerProps) {
    super(props);
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown = (event: KeyboardEvent) => {
    console.log('Key pressed:', event.key);
    this.props.callback(event);
  };

  render() {
    return null;
  }
}

interface ResizeListenerProps {
  callback: (event: Event) => void;
}

export class ResizeListener extends Component<ResizeListenerProps> {
  constructor(props: ResizeListenerProps) {
    super(props);
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  keyCallback = () => {};

  handleResize = (event: Event) => {
    console.log("Resize:", event);
    this.props.callback(event);
  };

  render() {
    return null;
  }
}
