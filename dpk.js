const crypto = require('crypto')

const TRIVIAL_PARTITION_KEY = '0'
const MAX_PARTITION_KEY_LENGTH = 256

function generateHex(data) {
  return crypto.createHash('sha3-512').update(data).digest('hex')
}

exports.deterministicPartitionKey = event => {
  const existingPartitionKey = event?.partitionKey
  if (existingPartitionKey) {
    if (typeof existingPartitionKey === 'string') {
      return existingPartitionKey.length > MAX_PARTITION_KEY_LENGTH
        ? generateHex(existingPartitionKey)
        : existingPartitionKey
    }
    return JSON.stringify(existingPartitionKey)
  }

  return event ? generateHex(JSON.stringify(event)) : TRIVIAL_PARTITION_KEY
}

exports.TRIVIAL_PARTITION_KEY = TRIVIAL_PARTITION_KEY
exports.MAX_PARTITION_KEY_LENGTH = MAX_PARTITION_KEY_LENGTH
