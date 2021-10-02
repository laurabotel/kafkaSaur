/** @format */

import { parse, decode as decodeV1 } from '../v1/response.ts';

/**
 * In version 2 on quota violation, brokers send out responses before throttling.
 * @see https://cwiki.apache.org/confluence/display/KAFKA/KIP-219+-+Improve+quota+communication
 *
 * Heartbeat Response (Version: 2) => throttle_time_ms error_code
 *   throttle_time_ms => INT32
 *   error_code => INT16
 */
const decode = async (rawData: any) => {
  const decoded = await decodeV1(rawData);

  return {
    ...decoded,
    throttleTime: 0,
    clientSideThrottleTime: decoded.throttleTime,
  };
};

export default {
  decode,
  parse,
};
