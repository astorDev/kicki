export async function attempt(asyncFn, maxAttempts) {
    let attempts = 0;
  
    while (attempts < maxAttempts) {
      try {
        const result = await asyncFn();
        return { 
          result: result,
          error: null
        }
      } catch (error) {
        attempts++;
        if (attempts === maxAttempts) {
          return {
              result: null,
              error: error
          }
        }
      }
    }
  }