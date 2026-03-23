export const handleApiError = (error: any) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  

  return error.message;
};