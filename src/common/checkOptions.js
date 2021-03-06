import CoreError, { ErrorCodes } from '~/common/error';

const DEFAULT_TYPE = 'string';

const validators = {
  boolean: (value) => {
    return typeof value === 'boolean';
  },
  number: (value) => {
    return typeof value === 'number';
  },
  string: (value) => {
    return typeof value === 'string';
  },
  object: (value) => {
    return typeof value === 'object';
  },
  array: (value) => {
    return Array.isArray(value);
  },
};

// Takes the validator function and wraps it safely around a try/catch block
// before it gets executed
function safelyValidate(validatorFn, value) {
  if (!(typeof validatorFn === 'function')) {
    throw Error('Validation for "checkOptions" has to be of type function');
  }

  try {
    return !!validatorFn(value);
  } catch {
    return false;
  }
}

/**
 * Check for required option fields, validate them and use fallback value when
 * default is given.
 *
 * @access private
 *
 * @param {Object} options - given user options
 * @param {Object} fields - defined option types and default values
 *
 * @return {Object} - cleaned options
 */
export default function checkOptions(options, fields) {
  if (!options || typeof options !== 'object') {
    throw new CoreError('Options missing', ErrorCodes.INVALID_OPTIONS);
  }

  return Object.keys(fields).reduce((acc, key) => {
    const type =
      fields[key] && 'type' in fields[key] ? fields[key].type : DEFAULT_TYPE;

    const validatorFn = typeof type === 'function' ? type : validators[type];

    const defaultValue =
      fields[key] && 'default' in fields[key] ? fields[key].default : null;

    if (defaultValue !== null && !safelyValidate(validatorFn, defaultValue)) {
      throw new CoreError(
        `Field "${key}" has invalid default type`,
        ErrorCodes.INVALID_OPTIONS,
      );
    }

    if (!(key in options) || typeof options[key] === 'undefined') {
      if (defaultValue === null) {
        throw new CoreError(
          `"${key}" is missing in options`,
          ErrorCodes.INVALID_OPTIONS,
        );
      }

      acc[key] = defaultValue;
    } else if (safelyValidate(validatorFn, options[key])) {
      acc[key] = options[key];
    } else {
      throw new CoreError(
        `"${key}" has invalid type`,
        ErrorCodes.INVALID_OPTIONS,
      );
    }

    return acc;
  }, {});
}
