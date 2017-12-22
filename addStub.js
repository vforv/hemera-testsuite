'use strict'

const Joi = require('joi')
const sinon = require('sinon');

/**
 *
 *
 * @class AddStub
 */
class AddStub {



  /**
   *
   *
   * @static
   * @param {any} hemera
   * @param {any} pattern
   * @param {any} request
   * @param {any} cb
   * @returns
   *
   * @memberOf AddStub
   */
  static run(hemera, pattern, request, cb, done) {
    const payload = hemera.router.lookup(pattern)
    const PreValidationError = hemera.createError('PreValidationError');

    if (payload) {

      if (Object.keys(payload.schema).length === 0) {
        payload.action.call(hemera, request, cb);
        return payload
      }

      let joiSchema = payload.schema

      if (payload.schema.joi$) {
        if (payload.schema.joi$.pre) {
          joiSchema = payload.schema.joi$.pre
        } else {
          joiSchema = payload.schema.joi$
        }
      }

      Joi.validate(
        request,
        joiSchema,
        {
          allowUnknown: true
        },
        (err, value) => {

          if (err) {
            let newErr = new PreValidationError({
              message: err.message,
              details: err.details
            });

            cb = cb.bind(null, newErr, null)
            cb();

            return payload

          } else {
            payload.action.call(hemera, request, cb);
            return payload
          }
        }
      )
    } else {
      throw new Error('Pattern not found. Please check that you added your server method before you run it.')
    }

  }
}

module.exports = AddStub

