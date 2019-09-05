const queueList = {
  420: 'Ranked',
  430: 'Normal',
  440: 'Flex',
};

export function getMapFromQueueId(queueId: number | undefined): string | undefined {
  if (!queueId) {
    return undefined;
  }
  if (queueList[queueId]) {
    return queueList[queueId];
  } else {
    return undefined;
  }
}