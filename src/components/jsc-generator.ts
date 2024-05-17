import { JSONSchema6 } from "json-schema";
import { z } from "zod";
import { compile } from "json-schema-to-typescript";
import { createElement, Fragment } from "react";
import ReactDOM from "react-dom";

class HyperfilesComponent extends HTMLElement {
    schema: JSONSchema6;
    data: any;
    onChange: (data: any) => void;
  
    static get observedAttributes() {
      return ['schema', 'data'];
    }
  
    attributeChangedCallback(name: string, oldValue: any, newValue: any) {
      if (oldValue !== newValue) {
        this.render();
      }
    }
  
    connectedCallback() {
      this.render();
    }
  
    render() {
      const schema = JSON.parse(this.getAttribute('schema') || '{}') as JSONSchema6;
      const data = JSON.parse(this.getAttribute('data') || '{}');
  
      const form = this.generateFormFromSchema(schema, data);
      ReactDOM.render(createElement(form), this);
    }
  
    generateFormFromSchema(schema: JSONSchema6, data: any) {
      const schemaValidator = z.object(schema);
      return (props: any) => (
        <form onSubmit={(e) => this.handleSubmit(e, schemaValidator)}>
          {Object.entries(schema.properties!).map(([key, value]) => (
            <Fragment key={key}>
              <label htmlFor={key}>{key}</label>
              <input
                type="text"
                id={key}
                name={key}
                value={data[key] || ''}
                onChange={(e) => this.handleInputChange(e, key)}
                required={schema.required!.includes(key)}
              />
            </Fragment>
          ))}
          <button type="submit">Submit</button>
        </form>
      );
    }
  
    handleInputChange(e: Event, key: string) {
      const target = e.target as HTMLInputElement;
      const newData = { ...this.data, [key]: target.value };
      this.data = newData;
      if (this.onChange) {
        this.onChange(newData);
      }
    }
  
    handleSubmit(e: Event, schemaValidator: any) {
      e.preventDefault();
      const form = e.target as HTMLFormElement;
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