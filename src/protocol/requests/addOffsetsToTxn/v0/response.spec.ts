// // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'decode'.
// import { decode, parse } from './response'
// // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'unsupporte... Remove this comment to see the full error message
// import { unsupportedVersionResponseWithTimeout } from 'testHelpers'

// // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
// describe('Protocol > Requests > AddPartitionsToTxn > v0', () => {
//   // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
//   test('response', async () => {
//     // @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'Buffer'. Did you mean 'buffer'?
//     const data = await decode(Buffer.from(require('../fixtures/v0_response.json')))
//     // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
//     expect(data).toEqual({
//       throttleTime: 0,
//       errorCode: 0,
//     })

//     // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
//     await expect(parse(data)).resolves.toBeTruthy()
//   })

//   // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
//   test('throws KafkaJSProtocolError if the api is not supported', async () => {
//     // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
//     await expect(decode(unsupportedVersionResponseWithTimeout())).rejects.toThrow(
//       /The version of API is not supported/
//     )
//   })
// })