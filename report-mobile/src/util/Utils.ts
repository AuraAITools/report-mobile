export const binarySearchUpperBound = (array: number[], target: number): number => {
  let left = 0
  let right = array.length - 1
  let closestAbove = -1

  while (left <= right) {
    const mid = Math.floor((left + right) / 2)

    if (array[mid] > target) {
      closestAbove = mid
      right = mid - 1
    } else {
      left = mid + 1
    }
  }

  return closestAbove !== -1 ? closestAbove : array.length - 1
}
