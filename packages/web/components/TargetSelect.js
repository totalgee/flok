import React from "react";
import PropTypes from "prop-types";

const TargetSelect = ({ value, options, onChange }) => (
  <div className="select target-select">
    <select onChange={onChange} value={value}>
      {options.map((option, i) => (
        <option key={i}>{option}</option>
      ))}
    </select>
  </div>
);

TargetSelect.propTypes = {
  value: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func
};

TargetSelect.defaultProps = {
  value: "",
  options: [],
  onChange: () => {}
};

export default TargetSelect;
