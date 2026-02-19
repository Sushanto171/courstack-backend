// convert tokenExpiresIn to milliseconds
export const maxAgeConvertor = (expires: string) => {
  let tokenMaxAge;
  const tokenUnit = (expires.slice(-1)).toLowerCase();
  const tokenValue = parseInt(expires.slice(0, -1));
  if (tokenUnit === "y") {
    tokenMaxAge = tokenValue * 365 * 24 * 60 * 60 * 1000;
  } else if (tokenUnit === "M") {
    tokenMaxAge = tokenValue * 30 * 24 * 60 * 60 * 1000;
  } else if (tokenUnit === "w") {
    tokenMaxAge = tokenValue * 7 * 24 * 60 * 60 * 1000;
  } else if (tokenUnit === "d") {
    tokenMaxAge = tokenValue * 24 * 60 * 60 * 1000;
  } else if (tokenUnit === "h") {
    tokenMaxAge = tokenValue * 60 * 60 * 1000;
  } else if (tokenUnit === "m") {
    tokenMaxAge = tokenValue * 60 * 1000;
  } else if (tokenUnit === "s") {
    tokenMaxAge = tokenValue * 1000;
  } else {
    tokenMaxAge = 1000 * 60 * 60; // default 1 hour
  }
  return tokenMaxAge;
};