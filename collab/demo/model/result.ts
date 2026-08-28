type Result<DataType, FailureType = string> =
  | { success: false; failure: FailureType; data?: undefined }
  | { success: true; failure?: undefined; data: DataType };

function failWith<FailureType = string>(
  failure: FailureType,
): { success: false; failure: FailureType; data?: undefined } {
  return {
    success: false,
    failure,
  };
}

function succeedWith<DataType>(data: DataType): {
  success: true;
  data: DataType;
} {
  return {
    success: true,
    data,
  };
}

export { failWith, succeedWith };
export type { Result };

