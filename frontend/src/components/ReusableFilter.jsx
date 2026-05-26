import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';

export default function ReusableFilter({ config, onApply, onClear, extraButtons }) {
  const buildInitial = () => {
    const init = {};
    config.forEach((field) => { init[field.key] = field.defaultValue ?? ''; });
    return init;
  };

  const [values, setValues] = useState(buildInitial);

  const handleChange = (key, value) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    const output = {};
    config.forEach((field) => {
      const val = values[field.key];
      if (val !== '' && val !== null && val !== undefined) {
        output[field.key] = val;
      }
    });
    onApply(output);
  };

  const handleClear = () => {
    setValues(buildInitial());
    onClear();
  };

  const renderField = (field) => {
    if (field.type === 'text') {
      return (
        <InputText
          value={values[field.key]}
          onChange={(e) => handleChange(field.key, e.target.value)}
          placeholder={field.placeholder || field.label}
          style={{ width: '100%' }}
        />
      );
    }

    if (field.type === 'dropdown') {
      return (
        <Dropdown
          value={values[field.key]}
          options={field.options}
          onChange={(e) => handleChange(field.key, e.value)}
          placeholder={`Select ${field.label}`}
          optionLabel="label"
          optionValue="value"
          showClear
          style={{ width: '100%' }}
        />
      );
    }

    if (field.type === 'date') {
      return (
        <Calendar
          value={values[field.key]}
          onChange={(e) => handleChange(field.key, e.value)}
          placeholder={field.placeholder || field.label}
          dateFormat="yy-mm-dd"
          showIcon
          style={{ width: '100%' }}
        />
      );
    }

    return null;
  };

  return (
    <div className="filter-card">
      <div className="filter-fields-row">
        {config.map((field) => (
          <div key={field.key} className="filter-field" style={{ flex: `1 1 ${field.width || 180}px`, maxWidth: field.maxWidth || 280 }}>
            <label>{field.label}</label>
            {renderField(field)}
          </div>
        ))}
      </div>
      <div className="filter-actions-row">
        <div className="filter-extra">{extraButtons}</div>
        <div className="filter-buttons">
          <Button label="Clear" icon="pi pi-times" outlined severity="secondary" onClick={handleClear} />
          <Button label="Apply Filters" icon="pi pi-search" onClick={handleApply} />
        </div>
      </div>
    </div>
  );
}
