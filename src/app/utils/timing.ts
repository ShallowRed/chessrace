// Durations are held in seconds throughout, because that is what a css
// transition takes. setTimeout is not.
export function ms(seconds: number): number {

  return seconds * 1000;
}

// Cleanup that has to land while a move is still playing out, close enough to
// the end that the eye reads it as part of the same beat.
export function beforeTheEndOf(seconds: number): number {

  return ms(seconds) * 0.8;
}
