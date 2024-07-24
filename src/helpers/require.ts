/**
 * simple require function that throws an error when a logic fails.
 * Throws an error with the provided message if the condition is false.
 * @param condition - The condition to check.
 * @param message - The error message to throw if the condition is false.
 */
export default function Require(condition: boolean, message: string): void {
   if (!condition) {
      throw new Error(message);
   }
}
