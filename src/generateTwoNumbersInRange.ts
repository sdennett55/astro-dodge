export function generateTwoNumbersInRange(
  target: number = 70,
  min: number = 10,
  max: number = 60
): [number, number] {
  // Calculate the maximum and minimum values for the two numbers
  const maxNum = Math.min(max, target - min)
  const minNum = Math.max(min, target - max)

  // Generate a random number between the minNum and maxNum (inclusive)
  const firstNumber = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum

  // Calculate the second number
  const secondNumber = target - firstNumber

  return [firstNumber, secondNumber]
}
