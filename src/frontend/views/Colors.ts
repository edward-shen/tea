// Colors were chosen here: https://www.colorhexa.com/d5f1fb
enum BackgroundColors {
  GREAT = '#8ff4aa',
  GOOD = '#d5fbdf',
  NEUTRAL = '#fff',
  BAD = '#fbd5de',
  TERRIBLE = '#f7a6b9',
}

enum ErrorColors {
  INFO = '#ccc',
  WARN = '#ffd280',
  ERROR = '#f7a6b9', // Should be identical to BackgroundColors.TERRIBLE
}
const PRIMARY = '#d41b2c';

export { BackgroundColors, ErrorColors, PRIMARY };
