export async function isUserAllowedToConsumeAPI(_userId: string) {
  try {
    // TODO: Add logic
    return true;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      throw error;
    }
    return false;
  }
}

export async function isIPAllowedToConsumeAPI(_ip: string) {
  try {
    // TODO: Add logic
    return true;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      throw error;
    }
    return false;
  }
}
