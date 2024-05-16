import Form from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';
import React, { useState } from 'react';
import ReactDOM from 'react-dom';

class HyperfilesComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }); // Attach shadow DOM for encapsulation
  }

  connectedCallback() {
    this.render();
  }

  disconnectedCallback() {
    ReactDOM.unmountComponentAtNode(this.shadowRoot);
  }

  render() {
    const schema = JSON.parse(this.getAttribute('schema') || '{}');

    const App = () => {
      const [formData, setFormData] = useState({});

      return (
        <Form
          schema={schema}
          formData={formData}
          onChange={(e) => setFormData(e.formData)}
          validator={validator}
        />
      );
    };

    ReactDOM.render(<App />, this.shadowRoot);
  }
}

customElements.define('hyperfiles-component', HyperfilesComponent);
