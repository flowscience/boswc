import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { JSONSchema6 } from "json-schema";
import { z } from "zod";
import { createElement, Fragment } from "react";
import ReactDOM from "react-dom";

class NearSocialViewerElement extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = `<slot></slot>`;
        this.selectorPromise = new Promise(resolve => this.selectorPromiseResolve = resolve);
        this.reactRoot = null;
    }

    set selector(selector) {
        this.selectorPromiseResolve(selector);
    }

    connectedCallback() {
        const container = document.createElement('div');
        this.appendChild(container);

        this.reactRoot = createRoot(container);
        this.renderRoot();
    }

    static get observedAttributes() {
        return ['src', 'code', 'initialprops', 'rpc'];
    }

    renderRoot() {
        const src = this.getAttribute('src');
        const code = this.getAttribute('code');
        const initialProps = this.getAttribute('initialprops');
        const rpc = this.getAttribute('rpc');

        this.reactRoot.render(<App src={src} code={code} initialProps={JSON.parse(initialProps)} rpc={rpc} selectorPromise={this.selectorPromise} />);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.renderRoot();
        }
    }
}

customElements.define('near-social-viewer', NearSocialViewerElement);

class HyperfilesComponent extends HTMLElement {
    connectedCallback() {
        this.render();
    }

    async render() {
        const schema = {
            title: "Example Schema",
            type: "object",
            properties: {
                firstName: { type: "string" },
                age: { type: "integer" }
            },
            required: ["firstName"]
        };

        const form = this.generateFormFromSchema(schema);
        ReactDOM.render(createElement(form), this);
    }

    generateFormFromSchema(schema) {
        const schemaValidator = z.object(schema);
        return (props) => (
            <form onSubmit={(e) => this.handleSubmit(e, schemaValidator)}>
                {Object.entries(schema.properties).map(([key, value]) => (
                    <Fragment key={key}>
                        <label htmlFor={key}>{key}</label>
                        <input type="text" id={key} name={key} required={schema.required.includes(key)} />
                    </Fragment>
                ))}
                <button type="submit">Submit</button>
            </form>
        );
    }

    handleSubmit(e, schemaValidator) {
        e.preventDefault();
        const form = e.target;
        const data = Object.fromEntries(new FormData(form).entries());
        const result = schemaValidator.safeParse(data);
        if (result.success) {
            console.log("Validation succeeded:", result.data);
        } else {
            console.log("Validation failed:", result.error);
        }
    }
}

customElements.define('hyperfiles-component', HyperfilesComponent);