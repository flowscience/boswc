import React from 'react';
import Form from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';

export default function RJSF(props) {
  const { schema, uiSchema, formData, onChange, onSubmit } = props;
  return (
    <Form
      schema={schema}
      uiSchema={uiSchema}
      formData={formData}
      onChange={onChange}
      onSubmit={onSubmit}
      validate={validator}
    />
  );
}