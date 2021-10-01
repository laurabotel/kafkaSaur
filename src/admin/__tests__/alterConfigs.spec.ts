import createAdmin from '../index'
import  KafkaJSProtocolError  from '../../errors'
import { createErrorFromCode } from '../../protocol/error'

import { secureRandom, createCluster, newLogger, createTopic } from 'testHelpers'
import RESOURCE_TYPES from '../../protocol/resourceTypes'
import CONFIG_RESOURCE_TYPES from '../../protocol/configResourceTypes'
const NOT_CONTROLLER = 41

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Admin', () => {
  let topicName: any, admin: any

  const getConfigEntries = (response: any) => response.resources.find((r: any) => r.resourceType === RESOURCE_TYPES.TOPIC).configEntries

  const getConfigValue = (configEntries: any, name: any) =>
    configEntries.find((c: any) => c.configName === name).configValue

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(() => {
    topicName = `test-topic-${secureRandom()}`
  })

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'afterEach'.
  afterEach(async () => {
    admin && (await admin.disconnect())
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('alterConfigs', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('throws an error if the resources array is invalid', async () => {
      admin = createAdmin({ cluster: createCluster(), logger: newLogger() })
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(admin.alterConfigs({ resources: null })).rejects.toHaveProperty(
        'message',
        'Invalid resources array null'
      )

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(
        admin.describeConfigs({ resources: 'this-is-not-an-array' })
      ).rejects.toHaveProperty('message', 'Invalid resources array this-is-not-an-array')
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('throws an error if the resources array is empty', async () => {
      admin = createAdmin({ cluster: createCluster(), logger: newLogger() })
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(admin.alterConfigs({ resources: [] })).rejects.toHaveProperty(
        'message',
        'Resources array cannot be empty'
      )
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('throws an error if there are invalid resource types', async () => {
      admin = createAdmin({ cluster: createCluster(), logger: newLogger() })
      const resources = [{ type: RESOURCE_TYPES.TOPIC }, { type: 1999 }]
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(admin.alterConfigs({ resources })).rejects.toHaveProperty(
        'message',
        'Invalid resource type 1999: {"type":1999}'
      )
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('throws an error if there are blank resource names', async () => {
      admin = createAdmin({ cluster: createCluster(), logger: newLogger() })
      const resources = [
        { type: RESOURCE_TYPES.TOPIC, name: 'abc' },
        { type: RESOURCE_TYPES.TOPIC, name: null },
      ]
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(admin.alterConfigs({ resources })).rejects.toHaveProperty(
        'message',
        'Invalid resource name null: {"type":2,"name":null}'
      )
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('throws an error if there are invalid resource names', async () => {
      admin = createAdmin({ cluster: createCluster(), logger: newLogger() })
      const resources = [
        { type: RESOURCE_TYPES.TOPIC, name: 'abc' },
        { type: RESOURCE_TYPES.TOPIC, name: 123 },
      ]
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(admin.alterConfigs({ resources })).rejects.toHaveProperty(
        'message',
        'Invalid resource name 123: {"type":2,"name":123}'
      )
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('throws an error if there are invalid resource configEntries', async () => {
      admin = createAdmin({ cluster: createCluster(), logger: newLogger() })
      const resources = [
        { type: RESOURCE_TYPES.TOPIC, name: 'abc', configEntries: [] },
        { type: RESOURCE_TYPES.TOPIC, name: 'def', configEntries: 123 },
      ]
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(admin.alterConfigs({ resources })).rejects.toHaveProperty(
        'message',
        'Invalid resource configEntries 123: {"type":2,"name":"def","configEntries":123}'
      )
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('throws an error if there are invalid resource configEntry values', async () => {
      admin = createAdmin({ cluster: createCluster(), logger: newLogger() })
      const resources = [
        {
          type: RESOURCE_TYPES.TOPIC,
          name: 'abc',
          configEntries: [{ name: 'cleanup.policy', value: 'compact' }],
        },
        { type: RESOURCE_TYPES.TOPIC, name: 'def', configEntries: [{}] },
      ]
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(admin.alterConfigs({ resources })).rejects.toHaveProperty(
        'message',
        'Invalid resource config value: {"type":2,"name":"def","configEntries":[{}]}'
      )
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('alter configs', async () => {
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
      await createTopic({ topic: topicName })
      admin = createAdmin({ cluster: createCluster(), logger: newLogger() })

      await admin.connect()

      let describeResponse = await admin.describeConfigs({
        resources: [
          {
            type: RESOURCE_TYPES.TOPIC,
            name: topicName,
            configNames: ['cleanup.policy'],
          },
        ],
      })

      let cleanupPolicy = getConfigValue(getConfigEntries(describeResponse), 'cleanup.policy')
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(cleanupPolicy).toEqual('delete')

      await admin.alterConfigs({
        resources: [
          {
            type: RESOURCE_TYPES.TOPIC,
            name: topicName,
            configEntries: [{ name: 'cleanup.policy', value: 'compact' }],
          },
        ],
      })

      describeResponse = await admin.describeConfigs({
        resources: [
          {
            type: RESOURCE_TYPES.TOPIC,
            name: topicName,
            configNames: ['cleanup.policy'],
          },
        ],
      })

      cleanupPolicy = getConfigValue(getConfigEntries(describeResponse), 'cleanup.policy')
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(cleanupPolicy).toEqual('compact')
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('does not alter configs with validateOnly=true', async () => {
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
      await createTopic({ topic: topicName })
      admin = createAdmin({ cluster: createCluster(), logger: newLogger() })

      await admin.connect()

      let describeResponse = await admin.describeConfigs({
        resources: [
          {
            type: RESOURCE_TYPES.TOPIC,
            name: topicName,
            configNames: ['cleanup.policy'],
          },
        ],
      })

      let cleanupPolicy = getConfigValue(getConfigEntries(describeResponse), 'cleanup.policy')
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(cleanupPolicy).toEqual('delete')

      await admin.alterConfigs({
        validateOnly: true,
        resources: [
          {
            type: RESOURCE_TYPES.TOPIC,
            name: topicName,
            configEntries: [{ name: 'cleanup.policy', value: 'compact' }],
          },
        ],
      })

      describeResponse = await admin.describeConfigs({
        resources: [
          {
            type: RESOURCE_TYPES.TOPIC,
            name: topicName,
            configNames: ['cleanup.policy'],
          },
        ],
      })

      cleanupPolicy = getConfigValue(getConfigEntries(describeResponse), 'cleanup.policy')
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(cleanupPolicy).toEqual('delete')
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('retries if the controller has moved', async () => {
      const cluster = createCluster()
      const brokerResponse = { resources: [true] }
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      const broker = { alterConfigs: jest.fn(() => brokerResponse) }

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      cluster.refreshMetadata = jest.fn()
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      cluster.findControllerBroker = jest
        .fn()
        .mockImplementationOnce(() => {
          throw new KafkaJSProtocolError(createErrorFromCode(NOT_CONTROLLER))
        })
        .mockImplementationOnce(() => broker)

      admin = createAdmin({ cluster, logger: newLogger() })
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(
        admin.alterConfigs({
          resources: [
            {
              type: RESOURCE_TYPES.TOPIC,
              name: topicName,
              configEntries: [{ name: 'cleanup.policy', value: 'compact' }],
            },
          ],
        })
      ).resolves.toEqual(brokerResponse)

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(cluster.refreshMetadata).toHaveBeenCalledTimes(2)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(cluster.findControllerBroker).toHaveBeenCalledTimes(2)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(broker.alterConfigs).toHaveBeenCalledTimes(1)
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('alter broker configs', async () => {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    await createTopic({ topic: topicName })

    const cluster = createCluster()
    admin = createAdmin({ cluster, logger: newLogger() })
    await admin.connect()

    const metadata = await cluster.brokerPool.seedBroker.metadata()
    const brokers = metadata.brokers
    const brokerToAlterConfig = brokers[1].nodeId.toString()

    const resources = [
      {
        type: CONFIG_RESOURCE_TYPES.TOPIC,
        name: topicName,
        configEntries: [{ name: 'cleanup.policy', value: 'compact' }],
      },
      {
        type: CONFIG_RESOURCE_TYPES.BROKER,
        name: brokerToAlterConfig,
        configEntries: [{ name: 'cleanup.policy', value: 'delete' }],
      },
    ]

    const response = await admin.alterConfigs({ resources })
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(response.resources.length).toEqual(2)
  })
})