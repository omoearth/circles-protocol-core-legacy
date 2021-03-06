import checkOptions from '~/common/checkOptions';

/**
 * Convenience wrapper function around checkOptions to check
 * for a valid web3 account.
 *
 * @access private
 *
 * @param {Web3} web3 - Web3 instance
 * @param {Object} account - web3 account instance
 *
 * @return {Object} - cleaned options
 */
export default function checkAccount(web3, account) {
  return checkOptions(account, {
    address: web3.utils.checkAddressChecksum,
    privateKey: web3.utils.isHexStrict,
  });
}
