const crypto = require('crypto')
const {
  deterministicPartitionKey,
  MAX_PARTITION_KEY_LENGTH,
  TRIVIAL_PARTITION_KEY,
} = require('./dpk')

describe('deterministicPartitionKey', () => {
  it(`Returns the literal ${TRIVIAL_PARTITION_KEY} when given no input`, () => {
    const trivialKey = deterministicPartitionKey()
    expect(trivialKey).toBe(TRIVIAL_PARTITION_KEY)
  })

  it(`Returns the string partitionKey when given input event with partitionKey as string`, () => {
    const event = {
      partitionKey: 'testKey',
    }
    const trivialKey = deterministicPartitionKey(event)
    expect(trivialKey).toBe(event.partitionKey)
  })

  it(`Returns the string partitionKey when given input event with partitionKey as non string`, () => {
    const event = {
      partitionKey: {
        keyData: 'test',
      },
    }
    const trivialKey = deterministicPartitionKey(event)
    expect(trivialKey).toBe(JSON.stringify(event.partitionKey))
  })

  it('Returns the calculated key based on input event data when given input event without partitionKey', () => {
    const event = {
      data: {
        test: {
          test1: 'another data',
        },
      },
    }
    const trivialKey = deterministicPartitionKey(event)
    const expectedOutput = crypto.createHash('sha3-512').update(JSON.stringify(event)).digest('hex')
    expect(trivialKey).toBe(expectedOutput)
  })

  it(`Returns the calculated key based on input partitionKey when given input event with partitionKey having length more than ${MAX_PARTITION_KEY_LENGTH}`, () => {
    const partitionKey =
      '0a2c27e9907067e1aa4daa6261131b06743e38d8185a38241271ade20ab78c3bde7b57e256e5fc4d9128c9d499c045c5cc1682cb1eef084ab1e59f77ee98f27a0a2c27e9907067e1aa4daa6261131b06743e38d8185a38241271ade20ab78c3bde7b57e256e5fc4d9128c9d499c045c5cc1682cb1eef084ab1e59f77ee98f27a0a2c27e9907067e1aa4daa6261131b06743e38d8185a38241271ade20ab78c3bde7b57e256e5fc4d9128c9d499c045c5cc1682cb1eef084ab1e59f77ee98f27a0a2c27e9907067e1aa4daa6261131b06743e38d8185a38241271ade20ab78c3bde7b57e256e5fc4d9128c9d499c045c5cc1682cb1eef084ab1e59f77ee98f27a0a2c27e9907067e1aa4daa6261131b06743e38d8185a38241271ade20ab78c3bde7b57e256e5fc4d9128c9d499c045c5cc1682cb1eef084ab1e59f77ee98f27a0a2c27e9907067e1aa4daa6261131b06743e38d8185a38241271ade20ab78c3bde7b57e256e5fc4d9128c9d499c045c5cc1682cb1eef084ab1e59f77ee98f27a'
    const event = {
      data: {
        test: {
          test1: 'another data',
        },
      },
      partitionKey,
    }
    const trivialKey = deterministicPartitionKey(event)
    const expectedOutput = crypto.createHash('sha3-512').update(partitionKey).digest('hex')
    expect(trivialKey).toBe(expectedOutput)
  })
})
