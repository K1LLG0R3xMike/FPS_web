import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Error caught in Error Boundary:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Algo salió mal. Intenta recargar la página.</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
