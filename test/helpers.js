/**
 * Asserts that the error message is invalid opcode
 * @param {Error} err
 */
const assertInvalidOpCode = (err) => {
  assert.equal(err.message, "VM Exception while processing transaction: invalid opcode");
}

exports.assertInvalidOpCode = assertInvalidOpCode;
