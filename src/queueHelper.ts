const queueList = {
  420: 'Ranked',
  430: 'Normal',
  440: 'Flex',
};

export function getMapFromQueueId(queueId: number): string {
  if (queueList[queueId]) {
    return queueList[queueId];
  } else {
    throw new Error(`queueId: ${queueId} is not supported`);
  }
}