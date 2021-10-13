import { Kafka,logLevel } from '../index.ts';
import prettyConsolelogger2 from './prettyConsoleLogger2.ts'

//declare host name
const host = 'localhost'

//intialize broker
const kafka = new Kafka({
  logLevel: logLevel.DEMO,
  logCreator: prettyConsolelogger2,
  brokers: [`${host}:9092`],
  clientId: 'example-consumer',
})

//declare topic name
const topic = 'topic-test'
//initialize producer and group ID
const consumer = kafka.consumer({ groupId: 'test-group' })

//main function to be run
const run = async () => {
  //connect
  await consumer.connect()
  //subscribe to topic
  await consumer.subscribe({ topic, fromBeginning: true })
  //run a console.log on eachMessage
  // await consumer.run({
  //   //deno-lint-ignore require-await
  //   eachMessage: async ({ message }: any) => {
  //     console.log(message.key.toString(), message.value.toString())
  //   },
  // })
  await consumer.run({
    // eachBatch: async ({ batch }) => {
    //   console.log(batch)
    // },
    //deno-lint-ignore require-await
    eachMessage: async ({ topic, partition, message }: any) => {
      //msgNumber++
      kafka.logger().info('Message processed', {
        topic,
        partition,
        offset: message.offset,
        timestamp: message.timestamp,
        headers: Object.keys(message.headers).reduce(
          (headers, key) => ({
            ...headers,
            [key]: message.headers[key].toString(),
          }),
          {}
        ),
        key: message.key.toString(),
        value: message.value.toString(),
        //msgNumber,
      })
    },
  })
}

run().catch((e)=>console.log(e))