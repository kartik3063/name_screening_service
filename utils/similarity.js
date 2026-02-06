function similarity(a, b) {
  const longer = a.length >= b.length ? a : b;
  const shorter = a.length < b.length ? a : b;

  if (longer.length === 0) return 1;

  const costs = Array(shorter.length + 1).fill(0);

  for (let i = 0; i <= longer.length; i++) {
    let lastValue = i;

    for (let j = 0; j <= shorter.length; j++) {
      if (i === 0) {
        costs[j] = j;
      } else if (j > 0) {
        let newValue = costs[j - 1];

        if (longer[i - 1] !== shorter[j - 1]) {
          newValue = Math.min(
            newValue,
            lastValue,
            costs[j]
          ) + 1;
        }

        costs[j - 1] = lastValue;
        lastValue = newValue;
      }
    }

    if (i > 0) {
      costs[shorter.length] = lastValue;
    }
  }

  const distance = costs[shorter.length];
  return (longer.length - distance) / longer.length;
}

module.exports = similarity;
