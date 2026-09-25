export interface Banknote {
  value: number;
  qty: number;
}

export type Strategy = "CashCow" | "UserFriendly";

export interface WithdrawalResult {
  selectedRequests: number[];
  dispensed: Banknote[];
  remaining: Banknote[];
  total: number;
}

type Allocation = number[];

function validateBanknotes(banknotes: Banknote[]): void {
  for (const banknote of banknotes) {
    if (!Number.isInteger(banknote.value) || banknote.value <= 0) {
      throw new Error("Banknote values must be positive integers.");
    }

    if (!Number.isInteger(banknote.qty) || banknote.qty < 0) {
      throw new Error("Banknote quantities must be non-negative integers.");
    }
  }
}

function findAllocations(amount: number, banknotes: Banknote[]): Allocation[] {
  if (!Number.isInteger(amount) || amount < 0) {
    throw new Error("Withdrawal amounts must be non-negative integers.");
  }

  const allocations: Allocation[] = [];
  const current = Array.from({ length: banknotes.length }, () => 0);

  function search(index: number, remaining: number): void {
    if (remaining === 0) {
      allocations.push([...current]);
      return;
    }

    if (index === banknotes.length) {
      return;
    }

    const banknote = banknotes[index];
    const maxUse = Math.min(
      banknote.qty,
      Math.floor(remaining / banknote.value),
    );

    for (let used = maxUse; used >= 0; used -= 1) {
      current[index] = used;
      search(index + 1, remaining - used * banknote.value);
    }

    current[index] = 0;
  }

  search(0, amount);
  return allocations;
}

/** Returns one valid way to dispense exactly `amount`, or null if impossible. */
export function canWithdraw(
  amount: number,
  banknotes: Banknote[],
): Banknote[] | null {
  validateBanknotes(banknotes);
  const allocation = findAllocations(amount, banknotes)[0];

  if (!allocation) {
    return null;
  }

  return banknotes
    .map((banknote, index) => ({
      value: banknote.value,
      qty: allocation[index],
    }))
    .filter((banknote) => banknote.qty > 0);
}

function isBetter(
  candidate: SearchResult,
  current: SearchResult,
  strategy: Strategy,
): boolean {
  if (strategy === "CashCow") {
    return candidate.total > current.total;
  }

  return candidate.selected.length > current.selected.length;
}

interface SearchResult {
  selected: number[];
  allocations: Allocation[];
  total: number;
}

/**
 * Selects a feasible subset of requests using the requested ATM policy.
 * Returns null when no request can be fulfilled.
 */
export function withdraw(
  banknotes: Banknote[],
  requests: number[],
  strategy: Strategy,
): WithdrawalResult | null {
  validateBanknotes(banknotes);

  if (strategy !== "CashCow" && strategy !== "UserFriendly") {
    throw new Error("Strategy must be CashCow or UserFriendly.");
  }

  const requestAllocations = requests.map((request) =>
    findAllocations(request, banknotes),
  );
  const memo = new Map<string, SearchResult>();

  function search(index: number, remaining: number[]): SearchResult {
    if (index === requests.length) {
      return { selected: [], allocations: [], total: 0 };
    }

    const key = `${index}:${remaining.join(",")}`;
    const saved = memo.get(key);
    if (saved) {
      return saved;
    }

    let best = search(index + 1, remaining);

    for (const allocation of requestAllocations[index]) {
      const canUse = allocation.every(
        (qty, noteIndex) => qty <= remaining[noteIndex],
      );
      if (!canUse) {
        continue;
      }

      const nextRemaining = remaining.map(
        (qty, noteIndex) => qty - allocation[noteIndex],
      );
      const following = search(index + 1, nextRemaining);
      const candidate: SearchResult = {
        selected: [index, ...following.selected],
        allocations: [allocation, ...following.allocations],
        total: requests[index] + following.total,
      };

      if (isBetter(candidate, best, strategy)) {
        best = candidate;
      }
    }

    memo.set(key, best);
    return best;
  }

  const best = search(
    0,
    banknotes.map((banknote) => banknote.qty),
  );
  if (best.selected.length === 0) {
    return null;
  }

  const used = banknotes.map(() => 0);
  for (const allocation of best.allocations) {
    allocation.forEach((qty, index) => {
      used[index] += qty;
    });
  }

  return {
    selectedRequests: best.selected,
    dispensed: banknotes
      .map((banknote, index) => ({ value: banknote.value, qty: used[index] }))
      .filter((banknote) => banknote.qty > 0),
    remaining: banknotes
      .map((banknote, index) => ({
        value: banknote.value,
        qty: banknote.qty - used[index],
      }))
      .filter((banknote) => banknote.qty > 0),
    total: best.total,
  };
}

// Examples:
canWithdraw(12, [{ value: 1, qty: 3 }, { value: 5, qty: 5 }, { value: 10, qty: 2 }]);
const cc = withdraw([{ value: 1, qty: 9 }], [3, 3, 7], "CashCow");
const uf = withdraw([{ value: 1, qty: 9 }], [3, 3, 7], "UserFriendly");
